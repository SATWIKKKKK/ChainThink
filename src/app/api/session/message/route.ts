import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import {
  getSessionState,
  addMessage,
  updateSessionState,
} from '@/lib/db/queries';
import {
  routeAgent,
  determineHintLevel,
  buildPromptForMode,
  type AIContext,
} from '@/lib/ai/orchestration';
import { streamClaudeResponse } from '@/lib/ai/claude';

interface SessionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { sessionId, message, isHintRequest } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Session ID and message are required' },
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

    // Save user message immediately
    await addMessage(sessionId, 'user', message);

    // Determine which agent should respond
    const mode = routeAgent(state, message, isHintRequest || false);
    const hintLevel = mode === 'hint' ? determineHintLevel(state) : undefined;

    // Build context
    const context: AIContext = {
      problem: state.problem.description,
      conversationHistory: state.messages.map((m: SessionMessage) => ({
        role: m.role,
        content: m.content,
      })),
      userMessage: message,
      hintsUsed: state.hintsUsed,
      mode,
      hintLevel,
    };

    // Build prompt
    const systemPrompt = buildPromptForMode(mode, context);

    // Prepare messages for Claude
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...context.conversationHistory.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    // Stream response
    const stream = await streamClaudeResponse(systemPrompt, messages);

    // Update session state (don't await, let it happen async)
    const updates: {
      currentMode: string;
      hintsUsed?: number;
    } = {
      currentMode: mode,
    };
    
    if (mode === 'hint') {
      updates.hintsUsed = state.hintsUsed + 1;
    }

    updateSessionState(sessionId, updates);

    // We'll save the assistant's message in a separate endpoint after streaming completes
    // For now, return the stream

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process message';
    console.error('Message error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}