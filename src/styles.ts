const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #ffffff;
  color: #1a1a1a;
  overflow: hidden;
  height: 100vh;
  height: 100dvh;
  -webkit-font-smoothing: antialiased;
}

#root {
  height: 100vh;
  height: 100dvh;
}

/* ===================== LOGIN ===================== */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f5f5;
  padding: 20px;
}

.login-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 40px 32px;
  width: 100%;
  max-width: 380px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.login-card h1 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.login-card p {
  text-align: center;
  color: #888;
  margin-bottom: 28px;
  font-size: 13px;
}

.login-card .error {
  background: #fef2f2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
  text-align: center;
  border: 1px solid #fecaca;
}

.input-group {
  margin-bottom: 14px;
}

.input-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-group input, .input-group select {
  width: 100%;
  padding: 11px 14px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-group input:focus, .input-group select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

.input-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #333;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===================== LAYOUT ===================== */
.chat-app {
  display: flex;
  height: 100%;
  position: relative;
}

/* ===================== SIDEBAR ===================== */
.sidebar {
  width: 280px;
  background: #fafafa;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 14px 16px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.sidebar-header h2 {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.3px;
}

.btn-new-chat {
  padding: 7px 12px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-new-chat:hover {
  background: #f0f0f0;
  border-color: #d0d0d0;
}

.sidebar-conversations {
  flex: 1;
  overflow-y: auto;
  padding: 6px 8px;
}

.sidebar-conversations::-webkit-scrollbar {
  width: 4px;
}

.sidebar-conversations::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

.conv-item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2px;
  transition: background 0.15s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border: 1px solid transparent;
}

.conv-item:hover {
  background: #f0f0f0;
}

.conv-item.active {
  background: #e8e8e8;
  border-color: #d5d5d5;
}

.conv-item-info {
  flex: 1;
  min-width: 0;
}

.conv-item-title {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1a1a1a;
}

.conv-item-meta {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.conv-item-delete {
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 15px;
  line-height: 1;
  opacity: 0;
  transition: all 0.15s;
}

.conv-item:hover .conv-item-delete {
  opacity: 1;
}

.conv-item-delete:hover {
  color: #dc2626;
  background: #fef2f2;
}

.sidebar-footer {
  padding: 12px 14px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn-admin {
  width: 100%;
  padding: 9px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #555;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-admin:hover {
  background: #f0f0f0;
  color: #1a1a1a;
}

.btn-logout {
  width: 100%;
  padding: 9px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #999;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-logout:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.user-badge {
  text-align: center;
  font-size: 11px;
  color: #bbb;
  padding: 2px 0 0;
}

/* ===================== MAIN CHAT ===================== */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  background: #ffffff;
}

.chat-header {
  padding: 10px 16px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fafafa;
}

.btn-menu {
  display: none;
  background: none;
  border: none;
  color: #555;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.model-selector {
  display: flex;
  gap: 4px;
  background: #f0f0f0;
  padding: 3px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.model-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.model-btn:hover {
  color: #555;
}

.model-btn.active {
  background: #ffffff;
  color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
}

/* ===================== MESSAGES ===================== */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #ffffff;
}

.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

.message {
  display: flex;
  gap: 10px;
  max-width: 82%;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}

.message.user .message-avatar {
  background: #1a1a1a;
  color: #ffffff;
}

.message.assistant .message-avatar {
  background: #f0f0f0;
  color: #3b82f6;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.65;
  word-break: break-word;
  overflow: hidden;
}

.message.user .message-bubble {
  background: #1a1a1a;
  color: #ffffff;
  border-bottom-right-radius: 4px;
  white-space: pre-wrap;
}

.message.assistant .message-bubble {
  background: #f7f7f8;
  border: 1px solid #e5e5e5;
  border-bottom-left-radius: 4px;
  color: #1a1a1a;
}

/* ===================== MARKDOWN ===================== */
.message.assistant .message-bubble p {
  margin: 0 0 10px 0;
}

.message.assistant .message-bubble p:last-child {
  margin-bottom: 0;
}

.message.assistant .message-bubble h1,
.message.assistant .message-bubble h2,
.message.assistant .message-bubble h3,
.message.assistant .message-bubble h4 {
  color: #1a1a1a;
  margin: 18px 0 8px 0;
  letter-spacing: -0.3px;
}

.message.assistant .message-bubble h1:first-child,
.message.assistant .message-bubble h2:first-child,
.message.assistant .message-bubble h3:first-child {
  margin-top: 0;
}

.message.assistant .message-bubble h1 { font-size: 18px; }
.message.assistant .message-bubble h2 { font-size: 16px; }
.message.assistant .message-bubble h3 { font-size: 14px; font-weight: 600; }

.message.assistant .message-bubble ul,
.message.assistant .message-bubble ol {
  padding-left: 20px;
  margin: 8px 0;
}

.message.assistant .message-bubble li {
  margin: 4px 0;
}

.message.assistant .message-bubble li::marker {
  color: #bbb;
}

.message.assistant .message-bubble blockquote {
  border-left: 3px solid #d0d0d0;
  padding-left: 14px;
  margin: 10px 0;
  color: #666;
}

.message.assistant .message-bubble a {
  color: #3b82f6;
  text-decoration: none;
  border-bottom: 1px solid rgba(59,130,246,0.3);
}

.message.assistant .message-bubble a:hover {
  border-bottom-color: #3b82f6;
}

.message.assistant .message-bubble strong {
  color: #1a1a1a;
  font-weight: 600;
}

.message.assistant .message-bubble em {
  color: #555;
}

.message.assistant .message-bubble hr {
  border: none;
  border-top: 1px solid #e5e5e5;
  margin: 14px 0;
}

/* Inline code */
.inline-code {
  background: #f0f0f0;
  color: #d6336c;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 12.5px;
  font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  border: 1px solid #e0e0e0;
}

/* Code blocks */
.code-block {
  margin: 12px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background: #1e1e2e;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: #2d2d3d;
  border-bottom: 1px solid #3a3a4e;
}

.code-lang {
  color: #a0a0b0;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.5px;
}

.copy-btn {
  padding: 3px 10px;
  background: #3a3a4e;
  border: 1px solid #4a4a5e;
  border-radius: 4px;
  color: #c0c0d0;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.copy-btn:hover {
  background: #4a4a5e;
  color: #ffffff;
}

/* Tables */
.table-wrapper {
  overflow-x: auto;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.table-wrapper table {
  border-collapse: collapse;
  width: 100%;
  font-size: 13px;
}

.table-wrapper th, .table-wrapper td {
  border: 1px solid #e5e5e5;
  padding: 8px 12px;
  text-align: left;
}

.table-wrapper th {
  background: #f5f5f5;
  color: #555;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.table-wrapper tr:nth-child(even) {
  background: #fafafa;
}

/* Typing indicator */
.typing-indicator {
  display: inline-flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 5px;
  height: 5px;
  background: #bbb;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
  30% { transform: translateY(-5px); opacity: 1; }
}

/* ===================== INPUT ===================== */
.input-area {
  padding: 12px 16px 14px;
  border-top: 1px solid #e5e5e5;
  background: #fafafa;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  max-width: 800px;
  margin: 0 auto;
}

.input-wrapper textarea {
  flex: 1;
  padding: 11px 14px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  color: #1a1a1a;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 44px;
  max-height: 150px;
  line-height: 1.5;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrapper textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

.input-wrapper textarea::placeholder {
  color: #bbb;
}

.btn-send {
  padding: 11px 14px;
  background: #1a1a1a;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  min-height: 44px;
}

.btn-send:disabled {
  background: #e0e0e0;
  color: #bbb;
  cursor: not-allowed;
}

.btn-send:hover:not(:disabled) {
  background: #333;
}

/* ===================== EMPTY STATE ===================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #bbb;
  gap: 10px;
  padding: 20px;
  text-align: center;
}

.empty-state .icon {
  font-size: 40px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  color: #888;
  font-weight: 600;
}

.empty-state p {
  font-size: 13px;
  max-width: 280px;
  line-height: 1.5;
}

/* ===================== SIDEBAR OVERLAY ===================== */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 10;
  backdrop-filter: blur(2px);
}

/* ===================== ADMIN PANEL ===================== */
.admin-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
}

.admin-header {
  padding: 14px 20px;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-header h2 {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.3px;
}

.btn-back {
  padding: 7px 14px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #555;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-back:hover {
  background: #f0f0f0;
  color: #1a1a1a;
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
}

.admin-section {
  max-width: 560px;
  margin: 0 auto;
}

.admin-section h3 {
  font-size: 12px;
  font-weight: 700;
  color: #888;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-form {
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 28px;
}

.user-form .form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.user-form .form-row .input-group {
  flex: 1;
  margin-bottom: 0;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-card {
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.15s;
}

.user-card:hover {
  border-color: #d0d0d0;
}

.user-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-card-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.user-card-role {
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.role-admin {
  color: #3b82f6 !important;
}

.role-user {
  color: #16a34a !important;
}

.user-card-actions {
  display: flex;
  gap: 8px;
}

.btn-delete-user {
  padding: 5px 12px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #999;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-delete-user:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.success-msg {
  background: #f0fdf4;
  color: #16a34a;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
  text-align: center;
  border: 1px solid #bbf7d0;
}

/* ===================== SHARE ===================== */
.btn-share {
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #555;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  margin-left: auto;
}

.btn-share:hover {
  background: #f0f0f0;
  color: #1a1a1a;
}

.share-toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes toastOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Shared view (public) - override body lock */
body.shared-page {
  overflow: auto;
  height: auto;
}

body.shared-page #root {
  height: auto;
}

.shared-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: #ffffff;
}

.shared-header {
  text-align: center;
  padding: 24px 0 20px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 24px;
}

.shared-header h1 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.shared-meta {
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.shared-messages {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 40px;
}

.shared-footer {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #e5e5e5;
  margin-top: 24px;
  font-size: 12px;
  color: #bbb;
}

.shared-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #999;
  gap: 8px;
}

.shared-error h2 {
  font-size: 18px;
  color: #555;
}

/* ===================== MOBILE ===================== */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-overlay.open {
    display: block;
  }

  .btn-menu {
    display: block;
  }

  .message {
    max-width: 92%;
  }

  .model-btn {
    padding: 5px 10px;
    font-size: 11px;
  }

  .user-form .form-row {
    flex-direction: column;
  }

  .admin-content {
    padding: 16px 14px;
  }
}
`;

export default styles;
