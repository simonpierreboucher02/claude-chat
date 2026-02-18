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

// ---- Streaming chat endpoint ----
app.post('/api/chat', authMiddleware, async (req, res) => {
  const { messages, model } = req.body;

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 15000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-5-20250929',
        max_tokens: model === 'claude-opus-4-6' ? 128000 : 64000,
        stream: true,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      sendSSE(res, { type: 'error', error: errText });
      clearInterval(keepAlive);
      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
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
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              sendSSE(res, { type: 'text', text: parsed.delta.text });
            } else if (parsed.type === 'message_stop') {
              sendSSE(res, { type: 'done' });
            } else if (parsed.type === 'message_start' && parsed.message?.usage) {
              sendSSE(res, { type: 'usage', usage: parsed.message.usage });
            } else if (parsed.type === 'error') {
              sendSSE(res, { type: 'error', error: parsed.error?.message || 'Unknown API error' });
            }
          } catch (e) {}
        }
      }
    }

    if (buffer.trim().startsWith('data: ')) {
      const data = buffer.trim().slice(6).trim();
      if (data && data !== '[DONE]') {
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            sendSSE(res, { type: 'text', text: parsed.delta.text });
          }
        } catch (e) {}
      }
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
