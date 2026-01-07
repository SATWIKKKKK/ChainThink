import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { createSession } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { problemId } = await req.json();

    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    const session = await createSession(user.id!, problemId);

    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
    console.error('Create session error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}