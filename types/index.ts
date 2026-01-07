export type AgentMode = 'socratic' | 'breakdown' | 'validation' | 'hint';

export interface SessionState {
  id: string;
  userId: string;
  problemId: string;
  problem: {
    id: string;
    title: string;
    description: string;
    difficulty: number;
    hints: HintLevel[];
  };
  messages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
  }[];
  hintsUsed: number;
  consecutiveWrongAttempts: number;
  currentMode: AgentMode;
  timeStuck: number;
  startedAt: Date;
  lastActivityAt: Date;
}

export interface HintLevel {
  level: number;
  text: string;
}

export interface AIContext {
  problem: string;
  conversationHistory: { role: string; content: string }[];
  userMessage: string;
  hintsUsed: number;
  mode: AgentMode;
  hintLevel?: number;
}