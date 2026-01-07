import { prisma } from './prisma';
import { SessionState } from '@/types';

export async function getSessionState(
  sessionId: string,
  userId: string
): Promise<SessionState | null> {
  const session = await prisma.problemSession.findFirst({
    where: {
      id: sessionId,
      userId: userId,
    },
    include: {
      problem: true,
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!session) return null;

  const timeStuck = Math.floor(
    (Date.now() - session.lastActivityAt.getTime()) / 1000
  );

  return {
    id: session.id,
    userId: session.userId,
    problemId: session.problemId,
    problem: {
      id: session.problem.id,
      title: session.problem.title,
      description: session.problem.description,
      difficulty: session.problem.difficulty,
      hints: session.problem.hints as any,
    },
    messages: session.messages.map((msg) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      createdAt: msg.createdAt,
    })),
    hintsUsed: session.hintsUsed,
    consecutiveWrongAttempts: session.consecutiveWrongAttempts,
    currentMode: session.currentMode as any,
    timeStuck,
    startedAt: session.startedAt,
    lastActivityAt: session.lastActivityAt,
  };
}

export async function createSession(userId: string, problemId: string) {
  return await prisma.problemSession.create({
    data: {
      userId,
      problemId,
    },
  });
}

export async function addMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: any
) {
  await prisma.message.create({
    data: {
      sessionId,
      role,
      content,
      metadata,
    },
  });

  await prisma.problemSession.update({
    where: { id: sessionId },
    data: {
      lastActivityAt: new Date(),
    },
  });
}

export async function updateSessionState(
  sessionId: string,
  updates: {
    hintsUsed?: number;
    consecutiveWrongAttempts?: number;
    currentMode?: string;
    completed?: boolean;
    timeSpentSeconds?: number;
  }
) {
  await prisma.problemSession.update({
    where: { id: sessionId },
    data: updates,
  });
}

export async function getUserSessions(userId: string) {
  return await prisma.problemSession.findMany({
    where: { userId },
    include: {
      problem: true,
    },
    orderBy: { lastActivityAt: 'desc' },
  });
}

export async function getAllProblems() {
  return await prisma.problem.findMany({
    orderBy: { orderIndex: 'asc' },
  });
}

export async function getProblemById(id: string) {
  return await prisma.problem.findUnique({
    where: { id },
  });
}