const styles = `
/* ===================== CSS VARIABLES ===================== */
:root {
  --bg: #ffffff;
  --bg2: #f8f8f9;
  --bg3: #f0f0f2;
  --fg: #111111;
  --fg2: #4a4a4a;
  --fg3: #888;
  --fg4: #c0c0c0;
  --border: #e8e8ea;
  --border2: #d0d0d4;
  --accent: #2563eb;
  --accent-bg: rgba(37,99,235,0.08);
  --msg-user-bg: #111111;
  --msg-user-fg: #ffffff;
  --msg-ai-bg: #f4f4f6;
  --msg-ai-border: #e8e8ea;
  --shadow: rgba(0,0,0,0.05);
  --shadow2: rgba(0,0,0,0.14);
  --shadow3: rgba(0,0,0,0.24);
  --danger: #dc2626;
  --danger-bg: #fef2f2;
  --danger-border: #fecaca;
  --success: #16a34a;
  --success-bg: #f0fdf4;
  --success-border: #bbf7d0;
  --radius: 16px;
}

body.dark {
  --bg: #0c0c0e;
  --bg2: #161618;
  --bg3: #222226;
  --fg: #f2f2f4;
  --fg2: #9d9daa;
  --fg3: #6b6b78;
  --fg4: #44444e;
  --border: #222226;
  --border2: #333340;
  --accent: #60a5fa;
  --accent-bg: rgba(96,165,250,0.1);
  --msg-user-bg: #1e1e24;
  --msg-user-fg: #f2f2f4;
  --msg-ai-bg: #161618;
  --msg-ai-border: #222226;
  --shadow: rgba(0,0,0,0.35);
  --shadow2: rgba(0,0,0,0.55);
  --shadow3: rgba(0,0,0,0.7);
  --danger: #f87171;
  --danger-bg: #3b0505;
  --danger-border: #7f1d1d;
  --success: #4ade80;
  --success-bg: #052e16;
  --success-border: #14532d;
}

* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

html {
  /* Let iOS handle safe areas */
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--fg);
  overflow: hidden;
  height: 100vh;
  height: 100dvh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background 0.2s, color 0.2s;
}

#root {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* ===================== LOGIN ===================== */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%);
  padding: 20px;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}

.login-card {
  background: var(--bg);
  border-radius: 20px;
  padding: 40px 32px 36px;
  width: 100%;
  max-width: 380px;
  border: 1px solid var(--border);
  box-shadow: 0 8px 40px var(--shadow2);
}

.login-card h1 {
  text-align: center;
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 6px;
  color: var(--fg);
  letter-spacing: -0.8px;
}

.login-card p {
  text-align: center;
  color: var(--fg3);
  margin-bottom: 28px;
  font-size: 13px;
  line-height: 1.5;
}

.login-card .error {
  background: var(--danger-bg);
  color: var(--danger);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 16px;
  text-align: center;
  border: 1px solid var(--danger-border);
}

.input-group { margin-bottom: 14px; }

.input-group label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--fg3);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg2);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  color: var(--fg);
  font-size: 15px;
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
  font-family: inherit;
  -webkit-appearance: none;
}

.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.input-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 34px;
}

.btn-primary {
  width: 100%;
  padding: 13px;
  background: var(--fg);
  color: var(--bg);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.18s, transform 0.1s;
  font-family: inherit;
  letter-spacing: 0.1px;
}
.btn-primary:hover { opacity: 0.88; }
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

/* ===================== LAYOUT ===================== */
.chat-app {
  display: flex;
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* ===================== SIDEBAR ===================== */
.sidebar {
  width: 272px;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header {
  padding: 12px 10px 10px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: max(12px, env(safe-area-inset-top));
}

.sidebar-header h2 {
  font-size: 14px;
  font-weight: 700;
  color: var(--fg);
  letter-spacing: -0.4px;
  flex: 1;
}

.btn-new-chat {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 12px;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap;
  font-family: inherit;
}
.btn-new-chat:hover { opacity: 0.9; }
.btn-new-chat:active { transform: scale(0.97); }

/* Search bar */
.sidebar-search {
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}

.sidebar-search-wrapper { position: relative; }

.sidebar-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--fg4);
  font-size: 13px;
  pointer-events: none;
}

.sidebar-search input {
  width: 100%;
  padding: 8px 10px 8px 32px;
  background: var(--bg3);
  border: 1.5px solid transparent;
  border-radius: 8px;
  color: var(--fg);
  font-size: 13px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.18s, box-shadow 0.18s;
  -webkit-appearance: none;
}
.sidebar-search input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-bg);
  background: var(--bg);
}
.sidebar-search input::placeholder { color: var(--fg4); }

.sidebar-conversations {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 6px 8px;
}

.sidebar-conversations::-webkit-scrollbar { width: 3px; }
.sidebar-conversations::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

.conv-section-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--fg4);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  padding: 8px 4px 3px;
}

.conv-item {
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 2px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid transparent;
  position: relative;
  min-height: 52px;
}
.conv-item:hover { background: var(--bg3); }
.conv-item.active {
  background: var(--bg3);
  border-color: var(--border2);
}

.conv-item-info { flex: 1; min-width: 0; }

.conv-item-title {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--fg);
  line-height: 1.4;
}

.conv-item-rename {
  font-size: 13px;
  background: var(--bg);
  border: 1.5px solid var(--accent);
  border-radius: 6px;
  color: var(--fg);
  padding: 3px 8px;
  width: 100%;
  outline: none;
  font-family: inherit;
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.conv-item-meta {
  font-size: 11px;
  color: var(--fg4);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.conv-item-actions {
  display: flex;
  gap: 1px;
  align-items: center;
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}
.conv-item:hover .conv-item-actions { opacity: 1; }

.conv-item-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 6px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1;
  color: var(--fg4);
  transition: all 0.12s;
  min-width: 30px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.conv-item-btn:hover { background: var(--bg2); color: var(--fg); }
.conv-item-btn.delete:hover { color: var(--danger); background: var(--danger-bg); }
.conv-item-btn.star { color: var(--fg4); }
.conv-item-btn.star.starred { color: #f59e0b; opacity: 1; }
.conv-item:hover .conv-item-btn.star,
.conv-item-btn.star.starred { opacity: 1; }

.sidebar-footer {
  padding: 10px 12px;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.btn-admin, .btn-logout {
  width: 100%;
  padding: 9px;
  background: transparent;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.btn-admin { color: var(--fg2); }
.btn-admin:hover { background: var(--bg3); color: var(--fg); }
.btn-logout { color: var(--fg3); }
.btn-logout:hover { background: var(--danger-bg); border-color: var(--danger-border); color: var(--danger); }

.user-badge {
  text-align: center;
  font-size: 11px;
  color: var(--fg4);
  padding-top: 2px;
  letter-spacing: 0.1px;
}

/* ===================== MAIN CHAT ===================== */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  background: var(--bg);
  position: relative;
}

/* ===================== CHAT HEADER ===================== */
.chat-header {
  padding: 10px 14px;
  padding-top: max(10px, env(safe-area-inset-top));
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg2);
  flex-shrink: 0;
  min-height: 56px;
}

.btn-menu {
  display: none;
  background: none;
  border: none;
  color: var(--fg2);
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  min-width: 40px;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.btn-menu:hover { background: var(--bg3); }

.model-selector { display: flex; align-items: center; }

.model-select {
  padding: 7px 28px 7px 10px;
  background: var(--bg3);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  color: var(--fg);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  font-family: inherit;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 9px center;
  transition: border-color 0.18s, box-shadow 0.18s;
  max-width: 170px;
}
.model-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-bg);
}
.model-select option, .model-select optgroup {
  background: var(--bg);
  color: var(--fg);
  font-size: 13px;
}

/* Header action buttons */
.header-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  margin-left: auto;
  position: relative;
}

.btn-header-action {
  padding: 7px 11px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  color: var(--fg2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: inherit;
  min-height: 36px;
}
.btn-header-action:hover { background: var(--bg3); color: var(--fg); border-color: var(--border2); }

.btn-theme {
  padding: 7px 9px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  color: var(--fg2);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  min-height: 38px;
}
.btn-theme:hover { background: var(--bg3); border-color: var(--border2); }

/* ⋮ More menu button (hidden on desktop) */
.btn-more-menu {
  display: none;
  padding: 7px 9px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  color: var(--fg2);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  min-height: 38px;
  letter-spacing: 1px;
  line-height: 1;
}
.btn-more-menu:hover { background: var(--bg3); border-color: var(--border2); }

.more-menu-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 8px 32px var(--shadow3);
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
  animation: menuFadeIn 0.15s ease;
}
@keyframes menuFadeIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.more-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  font-size: 14px;
  color: var(--fg);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-family: inherit;
  transition: background 0.12s;
  min-height: 48px;
}
.more-menu-item:hover { background: var(--bg2); }
.more-menu-item + .more-menu-item { border-top: 1px solid var(--border); }

/* ===================== MESSAGES ===================== */
.messages-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  padding: 20px 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--bg);
  min-height: 0;
}
.messages-container::-webkit-scrollbar { width: 3px; }
.messages-container::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

.message {
  display: flex;
  gap: 10px;
  max-width: 86%;
  animation: fadeIn 0.22s ease;
  position: relative;
}
.message:hover .message-actions { opacity: 1; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user { align-self: flex-end; flex-direction: row-reverse; }

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
  box-shadow: 0 1px 4px var(--shadow2);
}
.message.user .message-avatar { background: var(--msg-user-bg); color: var(--msg-user-fg); }
.message.assistant .message-avatar { background: linear-gradient(135deg, #6366f1, #3b82f6); color: #fff; }

.message-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}
.message.user .message-content-wrapper { align-items: flex-end; }

.message-bubble {
  padding: 11px 15px;
  font-size: 14px;
  line-height: 1.68;
  word-break: break-word;
  overflow-x: hidden;
  min-width: 0;
}

.message.user .message-bubble {
  background: var(--msg-user-bg);
  color: var(--msg-user-fg);
  border-radius: 18px 18px 4px 18px;
  white-space: pre-wrap;
  box-shadow: 0 2px 8px var(--shadow2);
}

.message.assistant .message-bubble {
  background: var(--msg-ai-bg);
  border: 1.5px solid var(--msg-ai-border);
  border-radius: 18px 18px 18px 4px;
  color: var(--fg);
  box-shadow: 0 1px 4px var(--shadow);
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
}

.message-timestamp { font-size: 10px; color: var(--fg4); }

.token-usage { font-size: 10px; color: var(--fg4); display: flex; gap: 8px; }
.token-usage span { display: flex; align-items: center; gap: 2px; }

/* Message action buttons */
.message-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
  margin-top: 2px;
  flex-wrap: wrap;
}
.message.user .message-actions { justify-content: flex-end; }
.message-actions.visible { opacity: 1; }

.msg-action-btn {
  padding: 5px 10px;
  background: var(--bg2);
  border: 1.5px solid var(--border);
  border-radius: 7px;
  color: var(--fg3);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  font-family: inherit;
  font-weight: 500;
}
.msg-action-btn:hover { background: var(--bg3); color: var(--fg); border-color: var(--border2); }
.msg-action-btn:active { transform: scale(0.96); }
.msg-action-btn.copied { color: var(--success); border-color: var(--success-border); background: var(--success-bg); }

/* ===================== MARKDOWN ===================== */
.message.assistant .message-bubble p { margin: 0 0 10px 0; }
.message.assistant .message-bubble p:last-child { margin-bottom: 0; }

.message.assistant .message-bubble h1,
.message.assistant .message-bubble h2,
.message.assistant .message-bubble h3,
.message.assistant .message-bubble h4 {
  color: var(--fg);
  margin: 18px 0 8px 0;
  letter-spacing: -0.3px;
  line-height: 1.3;
}
.message.assistant .message-bubble h1:first-child,
.message.assistant .message-bubble h2:first-child,
.message.assistant .message-bubble h3:first-child { margin-top: 0; }
.message.assistant .message-bubble h1 { font-size: 17px; }
.message.assistant .message-bubble h2 { font-size: 15px; }
.message.assistant .message-bubble h3 { font-size: 14px; font-weight: 600; }

.message.assistant .message-bubble ul,
.message.assistant .message-bubble ol { padding-left: 20px; margin: 8px 0; }
.message.assistant .message-bubble li { margin: 4px 0; }
.message.assistant .message-bubble li::marker { color: var(--fg4); }

.message.assistant .message-bubble blockquote {
  border-left: 3px solid var(--border2);
  padding-left: 14px;
  margin: 10px 0;
  color: var(--fg2);
  font-style: italic;
}

.message.assistant .message-bubble a { color: var(--accent); text-decoration: none; border-bottom: 1px solid rgba(37,99,235,0.3); }
.message.assistant .message-bubble a:hover { border-bottom-color: var(--accent); }
.message.assistant .message-bubble strong { color: var(--fg); font-weight: 600; }
.message.assistant .message-bubble em { color: var(--fg2); }
.message.assistant .message-bubble hr { border: none; border-top: 1px solid var(--border); margin: 14px 0; }

/* LaTeX */
.message.assistant .message-bubble .katex-display { margin: 14px 0; overflow-x: auto; overflow-y: hidden; padding: 8px 0; }
.message.assistant .message-bubble .katex { font-size: 1.05em; color: var(--fg); }
.message.assistant .message-bubble .katex-display > .katex { font-size: 1.15em; }
.message.assistant .message-bubble .katex-error { color: var(--fg4); font-size: 13px; overflow: hidden; max-height: 1.8em; }

/* Inline code */
.inline-code {
  background: var(--bg3);
  color: #c0254d;
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 12.5px;
  font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  border: 1px solid var(--border);
  word-break: break-all;
}
body.dark .inline-code { color: #f472b6; }

/* Code blocks */
.code-block {
  margin: 12px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #3a3a4e;
  background: #1e1e2e;
  max-width: 100%;
}
.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: #252535;
  border-bottom: 1px solid #3a3a4e;
}
.code-lang {
  color: #9090a8;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.6px;
}
.copy-btn {
  padding: 3px 10px;
  background: #3a3a4e;
  border: 1px solid #4a4a5e;
  border-radius: 5px;
  color: #c0c0d0;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.copy-btn:hover { background: #4a4a5e; color: #fff; }

/* Tables */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 10px 0;
  border-radius: 10px;
  border: 1px solid var(--border);
}
.table-wrapper table { border-collapse: collapse; width: 100%; font-size: 13px; }
.table-wrapper th, .table-wrapper td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; color: var(--fg); }
.table-wrapper th { background: var(--bg2); color: var(--fg2); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; }
.table-wrapper tr:nth-child(even) { background: var(--bg2); }

/* Typing indicator */
.typing-indicator { display: inline-flex; gap: 5px; padding: 4px 0; align-items: center; }
.typing-indicator span { width: 6px; height: 6px; background: var(--fg4); border-radius: 50%; animation: typing 1.4s infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* ===================== INPUT ===================== */
.input-area {
  padding: 10px 14px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid var(--border);
  background: var(--bg2);
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  max-width: 820px;
  margin: 0 auto;
}

.input-wrapper textarea {
  flex: 1;
  padding: 11px 14px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  color: var(--fg);
  font-size: 16px; /* ≥16px prevents iOS auto-zoom */
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 46px;
  max-height: 160px;
  line-height: 1.5;
  transition: border-color 0.18s, box-shadow 0.18s;
  -webkit-appearance: none;
}
.input-wrapper textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}
.input-wrapper textarea::placeholder { color: var(--fg4); }

.btn-send {
  padding: 11px 15px;
  background: var(--fg);
  border: none;
  border-radius: 12px;
  color: var(--bg);
  cursor: pointer;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  min-height: 46px;
  min-width: 46px;
  flex-shrink: 0;
}
.btn-send:disabled { background: var(--bg3); color: var(--fg4); cursor: not-allowed; }
.btn-send:hover:not(:disabled) { opacity: 0.85; }
.btn-send:active:not(:disabled) { transform: scale(0.95); }

.btn-stop {
  padding: 10px 15px;
  background: var(--danger);
  border: none;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  min-height: 46px;
  flex-shrink: 0;
  gap: 5px;
  font-family: inherit;
}
.btn-stop:hover { opacity: 0.88; }
.btn-stop:active { transform: scale(0.96); }

/* ===================== EMPTY STATE ===================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  padding: 20px;
  text-align: center;
}

.empty-state-icon {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  box-shadow: 0 8px 24px rgba(99,102,241,0.3);
  margin-bottom: 4px;
}

.empty-state h3 {
  font-size: 20px;
  color: var(--fg);
  font-weight: 700;
  letter-spacing: -0.5px;
}

.empty-state p {
  font-size: 14px;
  color: var(--fg3);
  max-width: 260px;
  line-height: 1.6;
}

.empty-state-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--fg4);
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 12px;
  margin-top: 4px;
}

/* ===================== SETTINGS PANEL ===================== */
.settings-overlay {
  display: none;
}

.settings-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: var(--bg2);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: 30;
  box-shadow: -6px 0 32px var(--shadow2);
  animation: slideInRight 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.settings-panel-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.settings-panel-header h3 { font-size: 14px; font-weight: 700; color: var(--fg); }

.btn-close-panel {
  background: none;
  border: none;
  color: var(--fg3);
  cursor: pointer;
  font-size: 20px;
  padding: 2px 8px;
  border-radius: 6px;
  line-height: 1;
  min-width: 36px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.btn-close-panel:hover { background: var(--bg3); color: var(--fg); }

.settings-panel-body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-section label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--fg3);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.settings-section textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  color: var(--fg);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  min-height: 100px;
  line-height: 1.5;
  transition: border-color 0.18s;
  -webkit-appearance: none;
}
.settings-section textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-bg); }
.settings-section textarea::placeholder { color: var(--fg4); }

.settings-section p.hint {
  font-size: 11px;
  color: var(--fg4);
  margin-top: 6px;
  line-height: 1.5;
}

.slider-row { display: flex; align-items: center; gap: 10px; }
.slider-row input[type=range] { flex: 1; accent-color: var(--accent); cursor: pointer; height: 4px; }
.slider-value { font-size: 13px; font-weight: 600; color: var(--fg); min-width: 32px; text-align: right; }

.settings-section select {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  color: var(--fg);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  transition: border-color 0.18s;
}
.settings-section select:focus { border-color: var(--accent); }

/* ===================== SIDEBAR OVERLAY ===================== */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 15;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

/* ===================== LOADING ===================== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 14px;
  color: var(--fg3);
}
.loading-spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid var(--border2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ===================== TOAST ===================== */
.share-toast {
  position: fixed;
  bottom: max(80px, calc(env(safe-area-inset-bottom) + 70px));
  left: 50%;
  transform: translateX(-50%);
  background: var(--fg);
  color: var(--bg);
  padding: 11px 22px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  z-index: 200;
  box-shadow: 0 6px 24px var(--shadow3);
  animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s;
  white-space: nowrap;
  pointer-events: none;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(12px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes toastOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* ===================== ADMIN PANEL ===================== */
.admin-panel { flex: 1; display: flex; flex-direction: column; height: 100%; background: var(--bg); }

.admin-header {
  padding: 14px 20px;
  padding-top: max(14px, env(safe-area-inset-top));
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.admin-header h2 { font-size: 16px; font-weight: 700; color: var(--fg); letter-spacing: -0.4px; }

.btn-back {
  padding: 8px 14px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  color: var(--fg2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.btn-back:hover { background: var(--bg3); color: var(--fg); }

.admin-content { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 24px 20px; }
.admin-section { max-width: 560px; margin: 0 auto; }
.admin-section h3 { font-size: 11px; font-weight: 700; color: var(--fg3); margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.6px; }

.user-form { background: var(--bg2); border: 1.5px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 28px; }
.user-form .form-row { display: flex; gap: 12px; margin-bottom: 12px; }
.user-form .form-row .input-group { flex: 1; margin-bottom: 0; }

.user-list { display: flex; flex-direction: column; gap: 6px; }
.user-card { background: var(--bg2); border: 1.5px solid var(--border); border-radius: 12px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; transition: border-color 0.15s; }
.user-card:hover { border-color: var(--border2); }
.user-card-info { display: flex; flex-direction: column; gap: 3px; }
.user-card-name { font-size: 14px; font-weight: 500; color: var(--fg); }
.user-card-role { font-size: 10px; color: var(--fg3); text-transform: uppercase; letter-spacing: 0.6px; font-weight: 700; }
.role-admin { color: var(--accent) !important; }
.role-user { color: var(--success) !important; }
.user-card-actions { display: flex; gap: 8px; }
.btn-delete-user { padding: 6px 12px; background: var(--bg); border: 1.5px solid var(--border); border-radius: 7px; color: var(--fg3); font-size: 11px; cursor: pointer; transition: all 0.15s; font-family: inherit; }
.btn-delete-user:hover { background: var(--danger-bg); border-color: var(--danger-border); color: var(--danger); }
.success-msg { background: var(--success-bg); color: var(--success); padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 12px; text-align: center; border: 1px solid var(--success-border); }
.error { background: var(--danger-bg); color: var(--danger); padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 16px; text-align: center; border: 1px solid var(--danger-border); }

/* ===================== SHARED VIEW ===================== */
body.shared-page { overflow: auto; height: auto; }
body.shared-page #root { height: auto; }

.shared-view { max-width: 800px; margin: 0 auto; padding: 20px; min-height: 100vh; background: var(--bg); }
.shared-header { text-align: center; padding: 24px 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
.shared-header h1 { font-size: 20px; font-weight: 700; color: var(--fg); margin-bottom: 6px; letter-spacing: -0.4px; }
.shared-meta { font-size: 12px; color: var(--fg3); display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.shared-messages { display: flex; flex-direction: column; gap: 20px; padding-bottom: 40px; }
.shared-footer { text-align: center; padding: 20px 0; border-top: 1px solid var(--border); margin-top: 24px; font-size: 12px; color: var(--fg4); }
.shared-error { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: var(--fg3); gap: 8px; }
.shared-error h2 { font-size: 18px; color: var(--fg2); }

/* ===================== MOBILE ===================== */
@media (max-width: 768px) {
  /* Sidebar */
  .sidebar {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    z-index: 20;
    width: 88vw;
    max-width: 320px;
    transform: translateX(-100%);
    box-shadow: 4px 0 24px var(--shadow3);
  }
  .sidebar.open { transform: translateX(0); }
  .sidebar-overlay.open { display: block; }

  /* Header */
  .btn-menu {
    display: flex;
    min-width: 44px;
    min-height: 44px;
  }
  .chat-header { padding: 8px 10px; padding-top: max(8px, env(safe-area-inset-top)); gap: 6px; min-height: 54px; }
  .model-selector { flex: 1; }
  .model-select { max-width: none; width: 100%; font-size: 13px; padding: 8px 28px 8px 10px; }

  /* Show ⋮, hide desktop action buttons */
  .btn-more-menu { display: flex; min-width: 44px; min-height: 44px; }
  .btn-header-action { display: none; }
  .btn-theme { min-width: 44px; min-height: 44px; padding: 8px; }

  /* Messages */
  .message { max-width: 94%; }
  .messages-container { padding: 14px 10px 10px; gap: 12px; }

  /* Message actions — always visible on touch */
  .message-actions { opacity: 1; }
  .msg-action-btn { padding: 7px 12px; font-size: 12px; min-height: 34px; }

  /* Input */
  .input-area { padding: 8px 10px; padding-bottom: max(10px, env(safe-area-inset-bottom)); }
  .input-wrapper textarea { font-size: 16px; padding: 10px 12px; min-height: 46px; border-radius: 12px; }
  .btn-send, .btn-stop { min-width: 48px; min-height: 46px; border-radius: 12px; }

  /* Settings — bottom sheet */
  .settings-panel {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    top: auto;
    width: 100%;
    max-height: 88vh;
    border-radius: 20px 20px 0 0;
    border-left: none;
    border-top: 1.5px solid var(--border);
    box-shadow: 0 -8px 40px var(--shadow3);
    animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    padding-bottom: env(safe-area-inset-bottom);
  }
  @keyframes slideUp {
    from { transform: translateY(40px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* Conv items touch targets */
  .conv-item { min-height: 56px; padding: 10px; }
  .conv-item-actions { opacity: 1; }
  .conv-item-btn { min-width: 36px; min-height: 36px; }

  /* Admin */
  .user-form .form-row { flex-direction: column; }
  .admin-content { padding: 16px 14px; }

  /* More menu position adjustment */
  .more-menu-dropdown { right: 0; min-width: 200px; }
}

/* Extra small screens */
@media (max-width: 380px) {
  .model-select { font-size: 12px; }
  .message { max-width: 98%; }
}
`;

export default styles;
