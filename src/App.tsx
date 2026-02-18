import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Conversation, ModelId, MODELS, UserInfo, UserEntry, SharedConversation } from './types';
import Markdown from './Markdown';
import styles from './styles';

// Inject styles
const styleEl = document.createElement('style');
styleEl.textContent = styles;
document.head.appendChild(styleEl);

// Valid model IDs
const VALID_MODEL_IDS = new Set(MODELS.map(m => m.id));
const DEFAULT_MODEL = MODELS[0].id;

// Storage helpers - scoped by username
function storageKey(username: string) {
  return `conversations_${username}`;
}

function loadConversations(username: string): Conversation[] {
  try {
    const convs: Conversation[] = JSON.parse(localStorage.getItem(storageKey(username)) || '[]');
    return convs.map(c => ({
      ...c,
      model: VALID_MODEL_IDS.has(c.model as ModelId) ? c.model : DEFAULT_MODEL,
    }));
  } catch {
    return [];
  }
}

function saveConversations(username: string, convs: Conversation[]) {
  localStorage.setItem(storageKey(username), JSON.stringify(convs));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getAuth(): { username: string; password: string } {
  return JSON.parse(sessionStorage.getItem('auth') || '{}');
}

// ---- Shared View (public, no login needed) ----
function SharedView({ shareId }: { shareId: string }) {
  const [share, setShare] = useState<SharedConversation | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.body.classList.add('shared-page');
    return () => { document.body.classList.remove('shared-page'); };
  }, []);

  useEffect(() => {
    fetch(`/api/share/${shareId}`)
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setShare)
      .catch(() => setError(true));
  }, [shareId]);

  if (error) {
    return (
      <div className="shared-view">
        <div className="shared-error">
          <h2>Conversation introuvable</h2>
          <p>Ce lien de partage n'existe pas ou a ete supprime.</p>
        </div>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="shared-view">
        <div className="shared-error">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  const modelLabel = MODELS.find(m => m.id === share.model)?.label || share.model;
  const dateStr = new Date(share.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="shared-view">
      <div className="shared-header">
        <h1>{share.title}</h1>
        <div className="shared-meta">
          <span>Partage par {share.sharedBy}</span>
          <span>{modelLabel}</span>
          <span>{dateStr}</span>
        </div>
      </div>
      <div className="shared-messages">
        {share.messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? 'U' : 'C'}
            </div>
            <div className="message-bubble">
              {msg.role === 'assistant' ? (
                <Markdown content={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="shared-footer">
        Claude Chat — Conversation partagee
      </div>
    </div>
  );
}

// ---- Login Component ----
function LoginScreen({ onLogin }: { onLogin: (user: UserInfo) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError('Identifiants incorrects');
        return;
      }
      const user = await res.json();
      sessionStorage.setItem('auth', JSON.stringify({ username, password }));
      sessionStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Claude Chat</h1>
        <p>Connexion requise pour acceder au chat</p>
        {error && <div className="error">{error}</div>}
        <div className="input-group">
          <label>Utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            autoFocus
          />
        </div>
        <div className="input-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
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
    const res = await fetch('/api/users', {
      headers: { username: auth.username, password: auth.password },
    });
    if (res.ok) setUsers(await res.json());
  }, [auth.username, auth.password]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        username: auth.username,
        password: auth.password,
      },
      body: JSON.stringify({ username: newUser, password: newPass, role: newRole }),
    });
    if (res.ok) {
      setSuccess(`Utilisateur "${newUser}" cree avec succes`);
      setNewUser('');
      setNewPass('');
      setNewRole('user');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      const data = await res.json();
      setError(data.error || 'Erreur');
    }
  };

  const deleteUser = async (username: string) => {
    if (!confirm(`Supprimer l'utilisateur "${username}" ?`)) return;
    const res = await fetch(`/api/users/${username}`, {
      method: 'DELETE',
      headers: { username: auth.username, password: auth.password },
    });
    if (res.ok) fetchUsers();
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Administration</h2>
        <button className="btn-back" onClick={onBack}>Retour au chat</button>
      </div>
      <div className="admin-content">
        <div className="admin-section">
          <h3>Creer un utilisateur</h3>
          <form className="user-form" onSubmit={createUser}>
            {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}
            {success && <div className="success-msg">{success}</div>}
            <div className="form-row">
              <div className="input-group">
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  value={newUser}
                  onChange={e => setNewUser(e.target.value)}
                  placeholder="jean.dupont"
                  required
                />
              </div>
              <div className="input-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="Min 4 caracteres"
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Role</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Creer l'utilisateur</button>
          </form>

          <h3>Utilisateurs ({users.length})</h3>
          <div className="user-list">
            {users.map(u => (
              <div key={u.username} className="user-card">
                <div className="user-card-info">
                  <div className="user-card-name">{u.username}</div>
                  <div className={`user-card-role ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                    {u.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </div>
                </div>
                <div className="user-card-actions">
                  {u.username !== 'admin' && (
                    <button className="btn-delete-user" onClick={() => deleteUser(u.username)}>
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Chat Component ----
function ChatApp({ user, onLogout }: { user: UserInfo; onLogout: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations(user.username));
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [model, setModel] = useState<ModelId>(DEFAULT_MODEL);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || null;

  useEffect(() => {
    saveConversations(user.username, conversations);
  }, [conversations, user.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const shareConversation = async () => {
    if (!activeConv || activeConv.messages.length === 0) return;
    const auth = getAuth();
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          username: auth.username,
          password: auth.password,
        },
        body: JSON.stringify({
          title: activeConv.title,
          messages: activeConv.messages,
          model: activeConv.model,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Erreur serveur');
        return;
      }
      const { url } = await res.json();
      const fullUrl = `${window.location.origin}${url}`;
      // Try clipboard, fallback to prompt
      try {
        await navigator.clipboard.writeText(fullUrl);
        showToast('Lien copie dans le presse-papier !');
      } catch {
        window.prompt('Copiez ce lien de partage :', fullUrl);
      }
    } catch (err: any) {
      showToast('Erreur reseau : ' + (err.message || 'inconnue'));
    }
  };

  const createConversation = (): Conversation => {
    const conv: Conversation = {
      id: generateId(),
      title: 'Nouvelle conversation',
      messages: [],
      model,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations(prev => [conv, ...prev]);
    setActiveConvId(conv.id);
    setSidebarOpen(false);
    return conv;
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    let conv = activeConv;

    if (!conv) {
      conv = createConversation();
    }

    const updatedMessages = [...conv.messages, userMessage];
    const title = conv.messages.length === 0 ? userMessage.content.slice(0, 50) : conv.title;

    setConversations(prev =>
      prev.map(c =>
        c.id === conv!.id
          ? { ...c, messages: updatedMessages, title, model, updatedAt: Date.now() }
          : c
      )
    );
    setActiveConvId(conv.id);
    setInput('');
    setIsStreaming(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const auth = getAuth();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          username: auth.username,
          password: auth.password,
        },
        body: JSON.stringify({ messages: updatedMessages, model }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let buffer = '';

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
              setConversations(prev =>
                prev.map(c =>
                  c.id === conv!.id
                    ? {
                        ...c,
                        messages: [
                          ...updatedMessages,
                          { role: 'assistant' as const, content: assistantText },
                        ],
                        updatedAt: Date.now(),
                      }
                    : c
                )
              );
            } else if (data.type === 'error') {
              assistantText += `\n[Erreur: ${data.error}]`;
            }
          } catch {}
        }
      }

      if (!assistantText) assistantText = '[Pas de reponse]';

      setConversations(prev =>
        prev.map(c =>
          c.id === conv!.id
            ? {
                ...c,
                messages: [
                  ...updatedMessages,
                  { role: 'assistant' as const, content: assistantText },
                ],
                updatedAt: Date.now(),
              }
            : c
        )
      );
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setConversations(prev =>
          prev.map(c =>
            c.id === conv!.id
              ? {
                  ...c,
                  messages: [
                    ...updatedMessages,
                    { role: 'assistant' as const, content: `[Erreur: ${err.message}]` },
                  ],
                  updatedAt: Date.now(),
                }
              : c
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  };

  if (showAdmin && user.role === 'admin') {
    return (
      <div className="chat-app">
        <AdminPanel onBack={() => setShowAdmin(false)} />
      </div>
    );
  }

  return (
    <div className="chat-app">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Conversations</h2>
          <button className="btn-new-chat" onClick={createConversation}>
            + Nouveau
          </button>
        </div>
        <div className="sidebar-conversations">
          {conversations.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
              Aucune conversation
            </div>
          )}
          {conversations.map(c => (
            <div
              key={c.id}
              className={`conv-item ${c.id === activeConvId ? 'active' : ''}`}
              onClick={() => {
                setActiveConvId(c.id);
                setModel(c.model as ModelId);
                setSidebarOpen(false);
              }}
            >
              <div className="conv-item-info">
                <div className="conv-item-title">{c.title}</div>
                <div className="conv-item-meta">
                  {MODELS.find(m => m.id === c.model)?.label || c.model} · {formatDate(c.updatedAt)}
                </div>
              </div>
              <button
                className="conv-item-delete"
                onClick={e => { e.stopPropagation(); deleteConversation(c.id); }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          {user.role === 'admin' && (
            <button className="btn-admin" onClick={() => { setShowAdmin(true); setSidebarOpen(false); }}>
              Administration
            </button>
          )}
          <button className="btn-logout" onClick={onLogout}>
            Deconnexion
          </button>
          <div className="user-badge">
            Connecte : {user.username} ({user.role})
          </div>
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-header">
          <button className="btn-menu" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="model-selector">
            {MODELS.map(m => (
              <button
                key={m.id}
                className={`model-btn ${model === m.id ? 'active' : ''}`}
                onClick={() => setModel(m.id)}
                title={m.description}
              >
                {m.label}
              </button>
            ))}
          </div>
          {activeConv && activeConv.messages.length > 0 && !isStreaming && (
            <button className="btn-share" onClick={shareConversation}>
              Partager
            </button>
          )}
        </div>

        <div className="messages-container">
          {(!activeConv || activeConv.messages.length === 0) && (
            <div className="empty-state">
              <div className="icon">💬</div>
              <h3>Claude Chat</h3>
              <p>Commencez une conversation avec Claude Sonnet 4.5 ou Opus 4.6</p>
            </div>
          )}
          {activeConv?.messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? user.username[0].toUpperCase() : 'C'}
              </div>
              <div className="message-bubble">
                {msg.role === 'assistant' ? (
                  <Markdown content={msg.content} />
                ) : (
                  msg.content
                )}
                {isStreaming && msg.role === 'assistant' && i === activeConv.messages.length - 1 && (
                  <span className="typing-indicator">
                    <span /><span /><span />
                  </span>
                )}
              </div>
            </div>
          ))}
          {isStreaming && activeConv && activeConv.messages[activeConv.messages.length - 1]?.role === 'user' && (
            <div className="message assistant">
              <div className="message-avatar">C</div>
              <div className="message-bubble">
                <span className="typing-indicator">
                  <span /><span /><span />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder="Ecrivez votre message..."
              rows={1}
              disabled={isStreaming}
            />
            <button
              className="btn-send"
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
            >
              ➤
            </button>
          </div>
        </div>
      </main>

      {toast && <div className="share-toast">{toast}</div>}
    </div>
  );
}

// ---- Main App with routing ----
export default function App() {
  const [user, setUser] = useState<UserInfo | null>(() => {
    try {
      const stored = sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Simple path-based routing for shared conversations
  const path = window.location.pathname;
  const shareMatch = path.match(/^\/share\/([a-z0-9]+)$/);

  if (shareMatch) {
    return <SharedView shareId={shareMatch[1]} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return <ChatApp user={user} onLogout={handleLogout} />;
}
