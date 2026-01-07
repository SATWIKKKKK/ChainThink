import { prisma } from './prisma';
import type { AgentMode } from '../../../types';

interface HintLevel {
  level: number;
  text: string;
}

interface SessionState {
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

export type { SessionState };

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
      hints: (session.problem.hints as unknown) as HintLevel[],
    },
    messages: session.messages.map((msg: { id: string; role: string; content: string; createdAt: Date }) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      createdAt: msg.createdAt,
    })),
    hintsUsed: session.hintsUsed,
    consecutiveWrongAttempts: session.consecutiveWrongAttempts,
    currentMode: session.currentMode as AgentMode,
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
  metadata?: object
) {
  await prisma.message.create({
    data: {
      sessionId,
      role,
      content,
      metadata: metadata ?? undefined,
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
