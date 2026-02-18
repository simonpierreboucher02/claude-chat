export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

export type ModelId = 'claude-sonnet-4-5-20250929' | 'claude-opus-4-6';

export interface ModelOption {
  id: ModelId;
  label: string;
  description: string;
}

export const MODELS: ModelOption[] = [
  {
    id: 'claude-sonnet-4-5-20250929',
    label: 'Claude Sonnet 4.5',
    description: 'Rapide et efficace',
  },
  {
    id: 'claude-opus-4-6',
    label: 'Claude Opus 4.6',
    description: 'Le plus puissant',
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
