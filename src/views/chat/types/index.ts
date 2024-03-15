export interface ChatItem {
  avatar?: string;
  time?: string;
  direction: 'left' | 'right';
  name: string;
  role: '' | 'user' | 'system' | 'assistant';
  content: string;
}
