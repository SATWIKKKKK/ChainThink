import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getSessionState, addMessage, updateSessionState } from '@/lib/db/queries';
import { determineHintLevel, buildPromptForMode } from '@/lib/ai/orchestration';
import { streamClaudeResponse } from '@/lib/ai/claude';

interface AIContext {
  problem: string;
  conversationHistory: { role: string; content: string }[];
  userMessage: string;
  hintsUsed: number;
  mode: 'socratic' | 'breakdown' | 'validation' | 'hint';
  hintLevel?: number;
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get session state
    const state = await getSessionState(sessionId, user.id!);
    if (!state) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Save hint request as user message
    await addMessage(sessionId, 'user', 'I need a hint.');

    // Determine hint level
    const hintLevel = determineHintLevel(state);

    // Build context
    const context: AIContext = {
      problem: state.problem.description,
      conversationHistory: state.messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      userMessage: 'I need a hint.',
      hintsUsed: state.hintsUsed,
      mode: 'hint',
      hintLevel,
    };

    // Build prompt
    const systemPrompt = buildPromptForMode('hint', context);

    // Prepare messages for Claude
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...context.conversationHistory.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: 'I need a hint.' },
    ];

    // Stream response
    const stream = await streamClaudeResponse(systemPrompt, messages);

    // Update session state
    updateSessionState(sessionId, {
      hintsUsed: state.hintsUsed + 1,
      currentMode: 'hint',
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get hint';
    console.error('Hint error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}
