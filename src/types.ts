export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
  starred?: boolean;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  lastUsage?: { input: number; output: number };
}

export type ModelId =
  | 'claude-sonnet-4-5-20250929'
  | 'claude-opus-4-6'
  | 'x-ai/grok-4.1-fast'
  | 'x-ai/grok-4-fast'
  | 'google/gemini-3.1-pro-preview'
  | 'google/gemini-3-flash-preview'
  | 'google/gemini-3-pro-preview'
  | 'qwen/qwen3.5-plus-02-15'
  | 'minimax/minimax-m2.5'
  | 'z-ai/glm-5'
  | 'openai/gpt-5.2';

export type ModelProvider = 'anthropic' | 'openrouter';

export interface ModelOption {
  id: ModelId;
  label: string;
  description: string;
  provider: ModelProvider;
  defaultMaxTokens: number;
}

export const MODELS: ModelOption[] = [
  // ── Anthropic ──────────────────────────────────────────
  {
    id: 'claude-sonnet-4-5-20250929',
    label: 'Sonnet 4.5',
    description: 'Claude Sonnet 4.5 — rapide et efficace',
    provider: 'anthropic',
    defaultMaxTokens: 64000,
  },
  {
    id: 'claude-opus-4-6',
    label: 'Opus 4.6',
    description: 'Claude Opus 4.6 — le plus puissant',
    provider: 'anthropic',
    defaultMaxTokens: 128000,
  },
  // ── xAI ────────────────────────────────────────────────
  {
    id: 'x-ai/grok-4.1-fast',
    label: 'Grok 4.1 Fast',
    description: 'xAI Grok 4.1 Fast — rapide',
    provider: 'openrouter',
    defaultMaxTokens: 32768,
  },
  {
    id: 'x-ai/grok-4-fast',
    label: 'Grok 4 Fast',
    description: 'xAI Grok 4 Fast',
    provider: 'openrouter',
    defaultMaxTokens: 32768,
  },
  // ── Google ──────────────────────────────────────────────
  {
    id: 'google/gemini-3.1-pro-preview',
    label: 'Gemini 3.1 Pro',
    description: 'Google Gemini 3.1 Pro Preview',
    provider: 'openrouter',
    defaultMaxTokens: 16384,
  },
  {
    id: 'google/gemini-3-flash-preview',
    label: 'Gemini 3 Flash',
    description: 'Google Gemini 3 Flash Preview — très rapide',
    provider: 'openrouter',
    defaultMaxTokens: 16384,
  },
  {
    id: 'google/gemini-3-pro-preview',
    label: 'Gemini 3 Pro',
    description: 'Google Gemini 3 Pro Preview',
    provider: 'openrouter',
    defaultMaxTokens: 16384,
  },
  // ── Qwen ────────────────────────────────────────────────
  {
    id: 'qwen/qwen3.5-plus-02-15',
    label: 'Qwen 3.5 Plus',
    description: 'Qwen 3.5 Plus — Alibaba',
    provider: 'openrouter',
    defaultMaxTokens: 32768,
  },
  // ── MiniMax ─────────────────────────────────────────────
  {
    id: 'minimax/minimax-m2.5',
    label: 'MiniMax M2.5',
    description: 'MiniMax M2.5',
    provider: 'openrouter',
    defaultMaxTokens: 16384,
  },
  // ── Z-AI ────────────────────────────────────────────────
  {
    id: 'z-ai/glm-5',
    label: 'GLM-5',
    description: 'Z-AI GLM-5',
    provider: 'openrouter',
    defaultMaxTokens: 16384,
  },
  // ── OpenAI ──────────────────────────────────────────────
  {
    id: 'openai/gpt-5.2',
    label: 'GPT-5.2',
    description: 'OpenAI GPT-5.2',
    provider: 'openrouter',
    defaultMaxTokens: 32768,
  },
];

export interface UserInfo {
  username: string;
  role: 'admin' | 'user';
}

export interface UserEntry {
  username: string;
  role: string;
  createdAt: number;
}

export interface SharedConversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  sharedBy: string;
  createdAt: number;
}
