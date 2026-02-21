import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Conversation, ModelId, MODELS, UserInfo, UserEntry, SharedConversation } from './types';
import Markdown from './Markdown';
import styles from './styles';

const styleEl = document.createElement('style');
styleEl.textContent = styles;
document.head.appendChild(styleEl);

const VALID_MODEL_IDS = new Set(MODELS.map(m => m.id));
const DEFAULT_MODEL = MODELS[0].id;

function themeKey() { return 'chat_theme'; }

async function fetchConversations(): Promise<Conversation[]> {
  const auth = getAuth();
  try {
    const res = await fetch('/api/conversations', {
      headers: { username: auth.username, password: auth.password },
    });
    if (!res.ok) return [];
    const convs: Conversation[] = await res.json();
    return convs.map(c => ({
      ...c,
      model: VALID_MODEL_IDS.has(c.model as ModelId) ? c.model : DEFAULT_MODEL,
    }));
  } catch { return []; }
}

async function persistConversations(convs: Conversation[]): Promise<void> {
  const auth = getAuth();
  try {
    await fetch('/api/conversations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', username: auth.username, password: auth.password },
      body: JSON.stringify({ conversations: convs }),
    });
  } catch {}
}

function generateId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function getAuth(): { username: string; password: string } { return JSON.parse(sessionStorage.getItem('auth') || '{}'); }
function formatTime(ts: number): string { return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }

// ---- Shared View ----
function SharedView({ shareId }: { shareId: string }) {
  const [share, setShare] = useState<SharedConversation | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.body.classList.add('shared-page');
    return () => { document.body.classList.remove('shared-page'); };
  }, []);

  useEffect(() => {
    fetch(`/api/share/${shareId}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setShare).catch(() => setError(true));
  }, [shareId]);

  if (error) return (
    <div className="shared-view"><div className="shared-error"><h2>Conversation introuvable</h2><p>Ce lien n'existe pas ou a été supprimé.</p></div></div>
  );
  if (!share) return (
    <div className="shared-view"><div className="shared-error"><p>Chargement...</p></div></div>
  );

  const modelLabel = MODELS.find(m => m.id === share.model)?.label || share.model;
  const dateStr = new Date(share.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="shared-view">
      <div className="shared-header">
        <h1>{share.title}</h1>
        <div className="shared-meta">
          <span>Partagé par {share.sharedBy}</span>
          <span>{modelLabel}</span>
          <span>{dateStr}</span>
        </div>
      </div>
      <div className="shared-messages">
        {share.messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-avatar">{msg.role === 'user' ? 'U' : 'C'}</div>
            <div className="message-content-wrapper">
              <div className="message-bubble">
                {msg.role === 'assistant' ? <Markdown content={msg.content} /> : msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="shared-footer">Claude Chat — Conversation partagée</div>
    </div>
  );
}

// ---- Login ----
function LoginScreen({ onLogin }: { onLogin: (user: UserInfo) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) { setError('Identifiants incorrects'); return; }
      const user = await res.json();
      sessionStorage.setItem('auth', JSON.stringify({ username, password }));
      sessionStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch { setError('Erreur de connexion'); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Claude Chat</h1>
        <p>Connectez-vous pour accéder à votre espace</p>
        {error && <div className="error">{error}</div>}
        <div className="input-group">
          <label>Utilisateur</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nom d'utilisateur" autoFocus autoComplete="username" />
        </div>
        <div className="input-group">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

// ---- Admin Panel ----
function AdminPanel({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const auth = getAuth();

  const fetchUsers = useCallback(async () => {
    const res = await fetch('/api/users', { headers: { username: auth.username, password: auth.password } });
    if (res.ok) setUsers(await res.json());
  }, [auth.username, auth.password]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess('');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', username: auth.username, password: auth.password },
      body: JSON.stringify({ username: newUser, password: newPass, role: newRole }),
    });
    if (res.ok) {
      setSuccess(`Utilisateur "${newUser}" créé`);
      setNewUser(''); setNewPass(''); setNewRole('user');
      fetchUsers(); setTimeout(() => setSuccess(''), 3000);
    } else { const d = await res.json(); setError(d.error || 'Erreur'); }
  };

  const deleteUser = async (username: string) => {
    if (!confirm(`Supprimer "${username}" ?`)) return;
    const res = await fetch(`/api/users/${username}`, { method: 'DELETE', headers: { username: auth.username, password: auth.password } });
    if (res.ok) fetchUsers();
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Administration</h2>
        <button className="btn-back" onClick={onBack}>← Retour</button>
      </div>
      <div className="admin-content">
        <div className="admin-section">
          <h3>Créer un utilisateur</h3>
          <form className="user-form" onSubmit={createUser}>
            {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}
            {success && <div className="success-msg">{success}</div>}
            <div className="form-row">
              <div className="input-group"><label>Identifiant</label><input type="text" value={newUser} onChange={e => setNewUser(e.target.value)} placeholder="jean.dupont" required /></div>
              <div className="input-group"><label>Mot de passe</label><input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 4 caractères" required /></div>
            </div>
            <div className="input-group">
              <label>Rôle</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Créer</button>
          </form>
          <h3>Utilisateurs ({users.length})</h3>
          <div className="user-list">
            {users.map(u => (
              <div key={u.username} className="user-card">
                <div className="user-card-info">
                  <div className="user-card-name">{u.username}</div>
                  <div className={`user-card-role ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>{u.role === 'admin' ? 'Admin' : 'Utilisateur'}</div>
                </div>
                <div className="user-card-actions">
                  {u.username !== 'admin' && <button className="btn-delete-user" onClick={() => deleteUser(u.username)}>Supprimer</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Message Item ----
function MessageItem({ msg, index, isLast, isStreaming, username, conv, onRegenerate, activeMsgIdx, setActiveMsgIdx }: {
  msg: Message; index: number; isLast: boolean; isStreaming: boolean;
  username: string; conv: Conversation;
  onRegenerate: () => void;
  activeMsgIdx: number | null;
  setActiveMsgIdx: (i: number | null) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isActionsVisible = activeMsgIdx === index;
  const showRegenerate = msg.role === 'assistant' && isLast && !isStreaming;
  const showUsage = msg.role === 'assistant' && isLast && conv.lastUsage;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleBubbleClick = () => {
    setActiveMsgIdx(isActionsVisible ? null : index);
  };

  return (
    <div className={`message ${msg.role}`}>
      <div className="message-avatar">
        {msg.role === 'user' ? username[0].toUpperCase() : '✦'}
      </div>
      <div className="message-content-wrapper">
        <div className="message-bubble" onClick={handleBubbleClick} style={{ cursor: 'pointer' }}>
          {msg.role === 'assistant' ? <Markdown content={msg.content} /> : msg.content}
          {isStreaming && msg.role === 'assistant' && isLast && (
            <span className="typing-indicator"><span /><span /><span /></span>
          )}
        </div>
        <div className="message-meta">
          {msg.timestamp && <span className="message-timestamp">{formatTime(msg.timestamp)}</span>}
          {showUsage && conv.lastUsage && (
            <span className="token-usage">
              <span>↑ {conv.lastUsage.input.toLocaleString()}</span>
              <span>↓ {conv.lastUsage.output.toLocaleString()} tok</span>
            </span>
          )}
        </div>
        <div className={`message-actions ${isActionsVisible ? 'visible' : ''}`}>
          <button className={`msg-action-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copié' : 'Copier'}
          </button>
          {showRegenerate && (
            <button className="msg-action-btn" onClick={e => { e.stopPropagation(); onRegenerate(); }}>
              ↺ Régénérer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Settings Panel ----
function SettingsPanel({ conv, onClose, onUpdate }: { conv: Conversation; onClose: () => void; onUpdate: (u: Partial<Conversation>) => void; }) {
  const [systemPrompt, setSystemPrompt] = useState(conv.systemPrompt || '');
  const [temperature, setTemperature] = useState(conv.temperature ?? 1.0);
  const [maxTokens, setMaxTokens] = useState(conv.maxTokens ?? 0);

  const MAX_TOKEN_OPTIONS = [
    { label: 'Défaut (auto)', value: 0 }, { label: '1 000', value: 1000 },
    { label: '4 000', value: 4000 }, { label: '16 000', value: 16000 },
    { label: '32 000', value: 32000 }, { label: '64 000', value: 64000 },
    { label: '128 000', value: 128000 },
  ];

  const handleSave = () => {
    onUpdate({ systemPrompt: systemPrompt.trim() || undefined, temperature, maxTokens: maxTokens || undefined });
    onClose();
  };

  return (
    <div className="settings-panel">
      <div className="settings-panel-header">
        <h3>Réglages</h3>
        <button className="btn-close-panel" onClick={onClose}>×</button>
      </div>
      <div className="settings-panel-body">
        <div className="settings-section">
          <label>System Prompt</label>
          <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} placeholder="Tu es un assistant expert en..." rows={5} />
          <p className="hint">Instructions de comportement pour le modèle dans cette conversation.</p>
        </div>
        <div className="settings-section">
          <label>Température — {temperature.toFixed(2)}</label>
          <div className="slider-row">
            <span style={{ fontSize: 11, color: 'var(--fg4)' }}>0</span>
            <input type="range" min="0" max="1" step="0.05" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} />
            <span style={{ fontSize: 11, color: 'var(--fg4)' }}>1</span>
          </div>
          <p className="hint">0 = précis et déterministe · 1 = créatif et varié</p>
        </div>
        <div className="settings-section">
          <label>Max Tokens de sortie</label>
          <select value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))}>
            {MAX_TOKEN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <p className="hint">Limite la longueur maximale de la réponse.</p>
        </div>
        <button className="btn-primary" onClick={handleSave}>Enregistrer</button>
      </div>
    </div>
  );
}

// ---- Chat Component ----
function ChatApp({ user, onLogout }: { user: UserInfo; onLogout: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [model, setModel] = useState<ModelId>(DEFAULT_MODEL);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem(themeKey()) as 'light' | 'dark') || 'light');
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [activeMsgIdx, setActiveMsgIdx] = useState<number | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || null;

  // Theme
  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(themeKey(), theme);
  }, [theme]);

  // Load conversations
  useEffect(() => {
    fetchConversations().then(convs => { setConversations(convs); setLoading(false); });
  }, [user.username]);

  // Save (debounced)
  useEffect(() => {
    if (loading) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => persistConversations(conversations), 800);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [conversations, loading]);

  // Scroll to bottom
  useEffect(() => {
    const c = messagesContainerRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, [activeConv?.messages]);

  // Focus rename input
  useEffect(() => {
    if (renamingId && renameInputRef.current) renameInputRef.current.focus();
  }, [renamingId]);

  // Close more menu on outside click
  useEffect(() => {
    if (!showMoreMenu) return;
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) setShowMoreMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMoreMenu]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); createConversation(); }
      if (e.key === 'Escape') { setShowSettings(false); setSidebarOpen(false); setRenamingId(null); setShowMoreMenu(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close message actions on scroll
  useEffect(() => {
    const c = messagesContainerRef.current;
    if (!c) return;
    const handler = () => setActiveMsgIdx(null);
    c.addEventListener('scroll', handler, { passive: true });
    return () => c.removeEventListener('scroll', handler);
  }, []);

  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'; }
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  // Sorted/filtered conversations
  const filteredConvs = conversations.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.messages.some(m => m.content.toLowerCase().includes(q));
  }).sort((a, b) => {
    if (a.starred && !b.starred) return -1;
    if (!a.starred && b.starred) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const starredConvs = filteredConvs.filter(c => c.starred);
  const regularConvs = filteredConvs.filter(c => !c.starred);

  const createConversation = (): Conversation => {
    const conv: Conversation = { id: generateId(), title: 'Nouvelle conversation', messages: [], model, createdAt: Date.now(), updatedAt: Date.now() };
    setConversations(prev => [conv, ...prev]);
    setActiveConvId(conv.id); setSidebarOpen(false); setShowSettings(false); setActiveMsgIdx(null);
    return conv;
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
  };

  const toggleStar = (id: string) => setConversations(prev => prev.map(c => c.id === id ? { ...c, starred: !c.starred } : c));

  const startRename = (conv: Conversation, e: React.MouseEvent) => { e.stopPropagation(); setRenamingId(conv.id); setRenameValue(conv.title); };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) setConversations(prev => prev.map(c => c.id === renamingId ? { ...c, title: renameValue.trim() } : c));
    setRenamingId(null);
  };

  const updateConvSettings = (updates: Partial<Conversation>) => {
    if (!activeConvId) return;
    setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, ...updates } : c));
  };

  const exportMarkdown = () => {
    if (!activeConv || !activeConv.messages.length) return;
    const modelLabel = MODELS.find(m => m.id === activeConv.model)?.label || activeConv.model;
    let md = `# ${activeConv.title}\n\n**Modèle :** ${modelLabel}  \n**Date :** ${new Date(activeConv.createdAt).toLocaleDateString('fr-FR')}\n\n---\n\n`;
    for (const msg of activeConv.messages) {
      md += `### ${msg.role === 'user' ? '👤 Utilisateur' : '🤖 Assistant'}\n\n${msg.content}\n\n---\n\n`;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
    a.download = `${activeConv.title.replace(/[^a-z0-9]/gi, '_').slice(0, 50)}.md`;
    a.click();
    showToast('Export Markdown téléchargé');
  };

  const shareConversation = async () => {
    if (!activeConv || !activeConv.messages.length) return;
    const auth = getAuth();
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', username: auth.username, password: auth.password },
        body: JSON.stringify({ title: activeConv.title, messages: activeConv.messages, model: activeConv.model }),
      });
      if (!res.ok) { showToast('Erreur lors du partage'); return; }
      const { url } = await res.json();
      const fullUrl = `${window.location.origin}${url}`;
      try { await navigator.clipboard.writeText(fullUrl); showToast('Lien copié !'); }
      catch { window.prompt('Lien de partage :', fullUrl); }
    } catch { showToast('Erreur réseau'); }
  };

  const stopStreaming = () => abortRef.current?.abort();

  const sendMessage = async (overrideMessages?: Message[]) => {
    if (!overrideMessages && !input.trim()) return;
    if (isStreaming) return;

    let messagesToSend: Message[];
    let conv = activeConv;

    if (overrideMessages) {
      messagesToSend = overrideMessages;
    } else {
      const userMessage: Message = { role: 'user', content: input.trim(), timestamp: Date.now() };
      if (!conv) conv = createConversation();
      messagesToSend = [...conv.messages, userMessage];
      const title = conv.messages.length === 0 ? userMessage.content.slice(0, 50) : conv.title;
      setConversations(prev => prev.map(c => c.id === conv!.id ? { ...c, messages: messagesToSend, title, model, updatedAt: Date.now() } : c));
      setActiveConvId(conv.id);
      setInput('');
      setActiveMsgIdx(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }

    setIsStreaming(true);
    const auth = getAuth();
    const controller = new AbortController();
    abortRef.current = controller;
    const currentConv = conversations.find(c => c.id === (conv?.id || activeConvId)) || conv;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', username: auth.username, password: auth.password },
        body: JSON.stringify({
          messages: messagesToSend, model: currentConv?.model || model,
          system: currentConv?.systemPrompt || undefined,
          temperature: currentConv?.temperature,
          max_tokens: currentConv?.maxTokens || undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let buffer = '';
      let usage: { input: number; output: number } | undefined;
      const assistantTs = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'text') {
              assistantText += data.text;
              setConversations(prev => prev.map(c => c.id === conv!.id ? {
                ...c, messages: [...messagesToSend, { role: 'assistant' as const, content: assistantText, timestamp: assistantTs }], updatedAt: Date.now(),
              } : c));
            } else if (data.type === 'usage') {
              usage = { input: data.usage.input_tokens, output: data.usage.output_tokens };
            } else if (data.type === 'error') {
              assistantText += `\n[Erreur: ${data.error}]`;
            }
          } catch {}
        }
      }

      if (!assistantText) assistantText = '[Pas de réponse]';
      setConversations(prev => prev.map(c => c.id === conv!.id ? {
        ...c,
        messages: [...messagesToSend, { role: 'assistant' as const, content: assistantText, timestamp: assistantTs }],
        updatedAt: Date.now(), lastUsage: usage,
      } : c));
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setConversations(prev => prev.map(c => c.id === conv!.id ? {
          ...c, messages: [...messagesToSend, { role: 'assistant' as const, content: `[Erreur: ${err.message}]`, timestamp: Date.now() }], updatedAt: Date.now(),
        } : c));
      }
    } finally { setIsStreaming(false); abortRef.current = null; }
  };

  const regenerateResponse = () => {
    if (!activeConv || isStreaming) return;
    const msgs = activeConv.messages;
    if (!msgs.length) return;
    const baseMessages = msgs[msgs.length - 1].role === 'assistant' ? msgs.slice(0, -1) : msgs;
    if (!baseMessages.length) return;
    setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: baseMessages } : c));
    sendMessage(baseMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const isToday = d.toDateString() === new Date().toDateString();
    return isToday ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const hasMessages = activeConv && activeConv.messages.length > 0 && !isStreaming;

  if (loading) return (
    <div className="chat-app" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="loading-state">
        <div className="loading-spinner" />
        <span style={{ fontSize: 13 }}>Chargement...</span>
      </div>
    </div>
  );

  if (showAdmin && user.role === 'admin') return (
    <div className="chat-app"><AdminPanel onBack={() => setShowAdmin(false)} /></div>
  );

  const ConvList = ({ convs, label }: { convs: Conversation[]; label?: string }) => (
    <>
      {label && convs.length > 0 && <div className="conv-section-label">{label}</div>}
      {convs.map(c => (
        <div
          key={c.id}
          className={`conv-item ${c.id === activeConvId ? 'active' : ''}`}
          onClick={() => { if (renamingId === c.id) return; setActiveConvId(c.id); setModel(c.model as ModelId); setSidebarOpen(false); setShowSettings(false); setActiveMsgIdx(null); }}
        >
          <div className="conv-item-info">
            {renamingId === c.id ? (
              <input ref={renameInputRef} className="conv-item-rename" value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenamingId(null); e.stopPropagation(); }}
                onClick={e => e.stopPropagation()} />
            ) : (
              <div className="conv-item-title" onDoubleClick={e => startRename(c, e)}>{c.title}</div>
            )}
            <div className="conv-item-meta">
              {MODELS.find(m => m.id === c.model)?.label || c.model} · {formatDate(c.updatedAt)}
              {c.systemPrompt ? ' · ⚙' : ''}
            </div>
          </div>
          <div className="conv-item-actions">
            <button className={`conv-item-btn star ${c.starred ? 'starred' : ''}`} onClick={e => { e.stopPropagation(); toggleStar(c.id); }} title={c.starred ? 'Retirer' : 'Favori'}>
              {c.starred ? '★' : '☆'}
            </button>
            <button className="conv-item-btn" onClick={e => startRename(c, e)} title="Renommer">✎</button>
            <button className="conv-item-btn delete" onClick={e => { e.stopPropagation(); deleteConversation(c.id); }} title="Supprimer">×</button>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="chat-app" onClick={() => { setActiveMsgIdx(null); setShowMoreMenu(false); }}>
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="sidebar-header">
          <h2>Conversations</h2>
          <button className="btn-new-chat" onClick={createConversation} title="⌘K">+ Nouveau</button>
        </div>
        <div className="sidebar-search">
          <div className="sidebar-search-wrapper">
            <span className="sidebar-search-icon">⌕</span>
            <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Rechercher..." />
          </div>
        </div>
        <div className="sidebar-conversations">
          {filteredConvs.length === 0 && (
            <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--fg4)', fontSize: 13 }}>
              {searchQuery ? 'Aucun résultat' : 'Aucune conversation'}
            </div>
          )}
          {starredConvs.length > 0 && <ConvList convs={starredConvs} label="★ Favoris" />}
          <ConvList convs={regularConvs} label={starredConvs.length > 0 ? 'Toutes' : undefined} />
        </div>
        <div className="sidebar-footer">
          {user.role === 'admin' && (
            <button className="btn-admin" onClick={() => { setShowAdmin(true); setSidebarOpen(false); }}>Administration</button>
          )}
          <button className="btn-logout" onClick={onLogout}>Déconnexion</button>
          <div className="user-badge">{user.username} · {user.role}</div>
        </div>
      </aside>

      <main className="chat-main" onClick={e => e.stopPropagation()}>
        <div className="chat-header">
          <button className="btn-menu" onClick={() => setSidebarOpen(true)}>☰</button>

          <div className="model-selector">
            <select className="model-select" value={model} onChange={e => {
              const v = e.target.value as ModelId;
              setModel(v);
              if (activeConvId) setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, model: v } : c));
            }}>
              <optgroup label="Anthropic">{MODELS.filter(m => m.provider === 'anthropic').map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</optgroup>
              <optgroup label="xAI">{MODELS.filter(m => m.provider === 'openrouter' && m.id.startsWith('x-ai/')).map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</optgroup>
              <optgroup label="Google">{MODELS.filter(m => m.provider === 'openrouter' && m.id.startsWith('google/')).map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</optgroup>
              <optgroup label="Autres">{MODELS.filter(m => m.provider === 'openrouter' && !m.id.startsWith('x-ai/') && !m.id.startsWith('google/')).map(m => <option key={m.id} value={m.id}>{m.label}</option>)}</optgroup>
            </select>
          </div>

          <div className="header-actions" ref={moreMenuRef} onClick={e => e.stopPropagation()}>
            {/* Desktop buttons */}
            {activeConv && (
              <button className="btn-header-action" onClick={() => setShowSettings(s => !s)} title="Réglages">
                ⚙ <span>Réglages</span>
              </button>
            )}
            {hasMessages && <button className="btn-header-action" onClick={exportMarkdown}>↓ <span>Export</span></button>}
            {hasMessages && <button className="btn-header-action" onClick={shareConversation}>↗ <span>Partager</span></button>}
            <button className="btn-theme" onClick={toggleTheme} title="Thème">{theme === 'light' ? '🌙' : '☀️'}</button>

            {/* Mobile ⋮ button */}
            <button className="btn-more-menu" onClick={() => setShowMoreMenu(s => !s)} title="Plus d'options">⋮</button>

            {showMoreMenu && (
              <div className="more-menu-dropdown" onClick={e => e.stopPropagation()}>
                {activeConv && (
                  <button className="more-menu-item" onClick={() => { setShowSettings(s => !s); setShowMoreMenu(false); }}>
                    ⚙ Réglages
                  </button>
                )}
                {hasMessages && (
                  <button className="more-menu-item" onClick={() => { exportMarkdown(); setShowMoreMenu(false); }}>
                    ↓ Exporter
                  </button>
                )}
                {hasMessages && (
                  <button className="more-menu-item" onClick={() => { shareConversation(); setShowMoreMenu(false); }}>
                    ↗ Partager
                  </button>
                )}
                <button className="more-menu-item" onClick={() => { toggleTheme(); setShowMoreMenu(false); }}>
                  {theme === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="messages-container" ref={messagesContainerRef}>
          {(!activeConv || activeConv.messages.length === 0) && (
            <div className="empty-state">
              <div className="empty-state-icon">✦</div>
              <h3>Bonjour, {user.username}</h3>
              <p>Sélectionnez un modèle et posez votre question. Appuyez sur <strong>Entrée</strong> pour envoyer.</p>
              <div className="empty-state-hint">
                <kbd style={{ fontFamily: 'inherit' }}>⌘K</kbd>
                <span>Nouvelle conversation</span>
              </div>
            </div>
          )}
          {activeConv?.messages.map((msg, i) => (
            <MessageItem
              key={i} msg={msg} index={i}
              isLast={i === activeConv.messages.length - 1}
              isStreaming={isStreaming} username={user.username} conv={activeConv}
              onRegenerate={regenerateResponse}
              activeMsgIdx={activeMsgIdx} setActiveMsgIdx={setActiveMsgIdx}
            />
          ))}
          {isStreaming && activeConv && activeConv.messages[activeConv.messages.length - 1]?.role === 'user' && (
            <div className="message assistant">
              <div className="message-avatar">✦</div>
              <div className="message-content-wrapper">
                <div className="message-bubble">
                  <span className="typing-indicator"><span /><span /><span /></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef} value={input}
              onChange={e => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder="Votre message... (Entrée pour envoyer)"
              rows={1} disabled={isStreaming}
            />
            {isStreaming
              ? <button className="btn-stop" onClick={stopStreaming}>⏹ Stop</button>
              : <button className="btn-send" onClick={() => sendMessage()} disabled={!input.trim()} title="Envoyer">➤</button>
            }
          </div>
        </div>

        {showSettings && activeConv && (
          <SettingsPanel conv={activeConv} onClose={() => setShowSettings(false)} onUpdate={updateConvSettings} />
        )}
      </main>

      {toast && <div className="share-toast">{toast}</div>}
    </div>
  );
}

// ---- App root ----
export default function App() {
  const [user, setUser] = useState<UserInfo | null>(() => {
    try { const s = sessionStorage.getItem('user'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });

  const path = window.location.pathname;
  const shareMatch = path.match(/^\/share\/([a-z0-9]+)$/);
  if (shareMatch) return <SharedView shareId={shareMatch[1]} />;

  const handleLogout = () => { sessionStorage.removeItem('auth'); sessionStorage.removeItem('user'); setUser(null); };
  if (!user) return <LoginScreen onLogin={setUser} />;
  return <ChatApp user={user} onLogout={handleLogout} />;
}
