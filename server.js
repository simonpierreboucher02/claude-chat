const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load .env manually
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}

const app = express();
const PORT = process.env.PORT || 3002;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const USERS_FILE = path.join(__dirname, 'users.json');
const SHARES_FILE = path.join(__dirname, 'shares.json');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const CONVERSATIONS_FILE = path.join(__dirname, 'conversations.json');

// ---- Conversations persistence ----
function loadAllConversations() {
  try {
    return JSON.parse(fs.readFileSync(CONVERSATIONS_FILE, 'utf8'));
  } catch {
    fs.writeFileSync(CONVERSATIONS_FILE, '{}');
    return {};
  }
}

function saveAllConversations(data) {
  fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify(data, null, 2));
}

// ---- Shares management ----
function loadShares() {
  try {
    return JSON.parse(fs.readFileSync(SHARES_FILE, 'utf8'));
  } catch {
    fs.writeFileSync(SHARES_FILE, '{}');
    return {};
  }
}

function saveShares(shares) {
  fs.writeFileSync(SHARES_FILE, JSON.stringify(shares, null, 2));
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// ---- Users management ----
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch {
    const defaults = {
      admin: { username: 'admin', password: 'admin123', role: 'admin', createdAt: Date.now() }
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Auth middleware - returns user object
function authMiddleware(req, res, next) {
  const { username, password } = req.headers;
  const users = loadUsers();
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  next();
}

// Admin-only middleware
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ---- Auth endpoint ----
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ username: user.username, role: user.role });
});

// ---- User management endpoints (admin only) ----
app.get('/api/users', authMiddleware, adminMiddleware, (req, res) => {
  const users = loadUsers();
  const userList = Object.values(users).map(u => ({
    username: u.username,
    role: u.role,
    createdAt: u.createdAt,
  }));
  res.json(userList);
});

app.post('/api/users', authMiddleware, adminMiddleware, (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (username.length < 2 || password.length < 4) {
    return res.status(400).json({ error: 'Username min 2 chars, password min 4 chars' });
  }
  const users = loadUsers();
  if (users[username]) {
    return res.status(409).json({ error: 'User already exists' });
  }
  users[username] = {
    username,
    password,
    role: role || 'user',
    createdAt: Date.now(),
  };
  saveUsers(users);
  res.json({ username, role: role || 'user' });
});

app.delete('/api/users/:username', authMiddleware, adminMiddleware, (req, res) => {
  const { username } = req.params;
  if (username === 'admin') {
    return res.status(400).json({ error: 'Cannot delete admin' });
  }
  const users = loadUsers();
  if (!users[username]) {
    return res.status(404).json({ error: 'User not found' });
  }
  delete users[username];
  saveUsers(users);
  res.json({ success: true });
});

app.put('/api/users/:username', authMiddleware, adminMiddleware, (req, res) => {
  const { username } = req.params;
  const { password, role } = req.body;
  const users = loadUsers();
  if (!users[username]) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (password) users[username].password = password;
  if (role && username !== 'admin') users[username].role = role;
  saveUsers(users);
  res.json({ username, role: users[username].role });
});

// ---- Helper: send SSE event and flush ----
function sendSSE(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
  if (typeof res.flush === 'function') res.flush();
}

// ---- Conversations endpoints ----
app.get('/api/conversations', authMiddleware, (req, res) => {
  const all = loadAllConversations();
  res.json(all[req.user.username] || []);
});

app.put('/api/conversations', authMiddleware, (req, res) => {
  const { conversations } = req.body;
  if (!Array.isArray(conversations)) {
    return res.status(400).json({ error: 'conversations must be an array' });
  }
  const all = loadAllConversations();
  all[req.user.username] = conversations;
  saveAllConversations(all);
  res.json({ ok: true });
});

// ---- Default max tokens per model ----
const MODEL_MAX_TOKENS = {
  'claude-sonnet-4-5-20250929': 64000,
  'claude-opus-4-6': 128000,
  'x-ai/grok-4.1-fast': 32768,
  'x-ai/grok-4-fast': 32768,
  'google/gemini-3.1-pro-preview': 16384,
  'google/gemini-3-flash-preview': 16384,
  'google/gemini-3-pro-preview': 16384,
  'qwen/qwen3.5-plus-02-15': 32768,
  'minimax/minimax-m2.5': 16384,
  'z-ai/glm-5': 16384,
  'openai/gpt-5.2': 32768,
};

// ---- SSE stream parser helper ----
async function parseSSEStream(reader, decoder, onChunk) {
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;
        try { onChunk(JSON.parse(data)); } catch {}
      }
    }
  }
  // flush remaining buffer
  if (buffer.trim().startsWith('data: ')) {
    const data = buffer.trim().slice(6).trim();
    if (data && data !== '[DONE]') {
      try { onChunk(JSON.parse(data)); } catch {}
    }
  }
}

// ---- Streaming chat endpoint ----
app.post('/api/chat', authMiddleware, async (req, res) => {
  const { messages, model, system, temperature, max_tokens } = req.body;

  const isOpenRouter = model && model.includes('/');
  const apiKey = isOpenRouter ? OPENROUTER_API_KEY : ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: isOpenRouter ? 'OpenRouter API key not configured' : 'Anthropic API key not configured' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const keepAlive = setInterval(() => { res.write(': keepalive\n\n'); }, 15000);
  const cleanMsgs = messages.map(({ role, content }) => ({ role, content }));
  const defaultMaxTokens = MODEL_MAX_TOKENS[model] || 16384;
  const maxTokens = max_tokens || defaultMaxTokens;

  try {
    let response;

    if (isOpenRouter) {
      // ── OpenRouter (OpenAI-compatible) ──
      const orMessages = [];
      if (system && system.trim()) {
        orMessages.push({ role: 'system', content: system.trim() });
      }
      orMessages.push(...cleanMsgs);

      const body = {
        model,
        messages: orMessages,
        stream: true,
        max_tokens: maxTokens,
      };
      if (temperature !== undefined && temperature !== null) body.temperature = temperature;

      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://claude-chat.local',
          'X-Title': 'Claude Chat',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        sendSSE(res, { type: 'error', error: errText });
        clearInterval(keepAlive); res.end(); return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let inputTokens = 0, outputTokens = 0;

      await parseSSEStream(reader, decoder, (parsed) => {
        // OpenAI-style streaming delta
        const delta = parsed.choices?.[0]?.delta;
        if (delta?.content) {
          sendSSE(res, { type: 'text', text: delta.content });
        }
        // Token usage (sent in final chunk or usage field)
        if (parsed.usage) {
          inputTokens = parsed.usage.prompt_tokens || 0;
          outputTokens = parsed.usage.completion_tokens || 0;
        }
      });

      if (inputTokens || outputTokens) {
        sendSSE(res, { type: 'usage', usage: { input_tokens: inputTokens, output_tokens: outputTokens } });
      }

    } else {
      // ── Anthropic ──
      const body = {
        model: model || 'claude-sonnet-4-5-20250929',
        max_tokens: maxTokens,
        stream: true,
        messages: cleanMsgs,
      };
      if (system && system.trim()) body.system = system.trim();
      if (temperature !== undefined && temperature !== null) body.temperature = temperature;

      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        sendSSE(res, { type: 'error', error: errText });
        clearInterval(keepAlive); res.end(); return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      await parseSSEStream(reader, decoder, (parsed) => {
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          sendSSE(res, { type: 'text', text: parsed.delta.text });
        } else if (parsed.type === 'message_start' && parsed.message?.usage) {
          sendSSE(res, { type: 'usage', usage: parsed.message.usage });
        } else if (parsed.type === 'error') {
          sendSSE(res, { type: 'error', error: parsed.error?.message || 'API error' });
        }
      });
    }

    sendSSE(res, { type: 'done' });
    clearInterval(keepAlive);
    res.end();
  } catch (error) {
    sendSSE(res, { type: 'error', error: error.message });
    clearInterval(keepAlive);
    res.end();
  }
});

// ---- Share endpoints ----
app.post('/api/share', authMiddleware, (req, res) => {
  const { title, messages, model } = req.body;
  if (!messages || !messages.length) {
    return res.status(400).json({ error: 'No messages to share' });
  }
  const shareId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const shares = loadShares();
  shares[shareId] = {
    id: shareId,
    title: title || 'Conversation partagee',
    messages,
    model: model || 'unknown',
    sharedBy: req.user.username,
    createdAt: Date.now(),
  };
  saveShares(shares);
  res.json({ shareId, url: `/share/${shareId}` });
});

app.get('/api/share/:id', (req, res) => {
  const shares = loadShares();
  const share = shares[req.params.id];
  if (!share) {
    return res.status(404).json({ error: 'Share not found' });
  }
  res.json(share);
});

app.delete('/api/share/:id', authMiddleware, (req, res) => {
  const shares = loadShares();
  if (!shares[req.params.id]) {
    return res.status(404).json({ error: 'Share not found' });
  }
  if (shares[req.params.id].sharedBy !== req.user.username && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }
  delete shares[req.params.id];
  saveShares(shares);
  res.json({ success: true });
});

// Serve React app for all other routes
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
