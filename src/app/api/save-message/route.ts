import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { addMessage } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const { sessionId, message, metadata } = await req.json();

    await addMessage(sessionId, 'assistant', message, metadata);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save message';
    console.error('Save message error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}