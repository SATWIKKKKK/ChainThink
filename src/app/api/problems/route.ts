import { NextResponse } from 'next/server';
import { getAllProblems } from '@/lib/db/queries';
import { requireAuth } from '@/lib/auth/session';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  topic: string;
}

export async function GET() {
  try {
    await requireAuth();
    const problems = await getAllProblems();
    
    // Don't send hints or solutions to client
    const sanitized = problems.map((p: Problem) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      difficulty: p.difficulty,
      topic: p.topic,
    }));

    return NextResponse.json({ problems: sanitized });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}