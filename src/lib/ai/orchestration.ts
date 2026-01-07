import type { SessionState } from '@/lib/db/queries';
import {
  buildSocraticPrompt,
  buildBreakdownPrompt,
  buildValidationPrompt,
  buildHintPrompt,
} from './prompts';

export type AgentMode = 'socratic' | 'breakdown' | 'validation' | 'hint';

export interface AIContext {
  problem: string;
  conversationHistory: { role: string; content: string }[];
  userMessage: string;
  hintsUsed: number;
  mode: AgentMode;
  hintLevel?: number;
}

export function routeAgent(
  state: SessionState,
  userMessage: string,
  isHintRequest: boolean
): AgentMode {
  // Explicit hint request
  if (isHintRequest) {
    return 'hint';
  }

  // User is severely stuck
  if (state.timeStuck > 300 || state.consecutiveWrongAttempts >= 3) {
    return 'breakdown';
  }

  // User submitted an attempt or explanation
  const attemptKeywords = [
    'i think',
    'my answer',
    'here is',
    'the solution',
    'this would be',
    'it should be',
  ];
  
  if (attemptKeywords.some(kw => userMessage.toLowerCase().includes(kw))) {
    return 'validation';
  }

  // Default: Socratic questioning
  return 'socratic';
}

export function determineHintLevel(state: SessionState): number {
  if (state.hintsUsed === 0) return 1;
  if (state.hintsUsed === 1 && state.timeStuck < 300) return 2;
  if (state.hintsUsed >= 2 || state.timeStuck > 600) return 3;
  if (state.hintsUsed >= 4) return 4;
  return 2;
}

export function buildPromptForMode(
  mode: AgentMode,
  context: AIContext
): string {
  switch (mode) {
    case 'socratic':
      return buildSocraticPrompt(context);
    case 'breakdown':
      return buildBreakdownPrompt(context);
    case 'validation':
      return buildValidationPrompt(context);
    case 'hint':
      return buildHintPrompt(context, context.hintLevel || 1);
    default:
      return buildSocraticPrompt(context);
  }
}

export function validateAIResponse(response: string): {
  valid: boolean;
  reason?: string;
} {
  // Check for solution-dumping patterns
  const forbiddenPatterns = [
    /here'?s? the complete solution/i,
    /the answer is:?\s*\d+/i,
    /here'?s? the full code/i,
    /```[\s\S]*def\s+\w+\([\s\S]*\):\s*[\s\S]*return[\s\S]*```/i, // Complete function
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(response)) {
      return {
        valid: false,
        reason: 'AI attempted to provide full solution',
      };
    }
  }

  return { valid: true };
}
