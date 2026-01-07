import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getUserSessions } from '@/lib/db/queries';

export async function GET() {
  try {
    const user = await requireAuth();
    const sessions = await getUserSessions(user.id!);

    return NextResponse.json({ sessions });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}