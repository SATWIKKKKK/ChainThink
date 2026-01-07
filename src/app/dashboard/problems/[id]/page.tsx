import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getProblemById, getSessionState, createSession } from '@/lib/db/queries';
import { ProblemViewer } from '@/app/components/ui/ProblemViewer';
import { ChatInterface } from '@/app/components/ui/ChatInterface';
import { ProgressIndicator } from '@/app/components/ui/ProgressIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export default async function ProblemPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const problem = await getProblemById(params.id);
  if (!problem) redirect('/dashboard');

  // Get or create session
  let sessionId = searchParams.session;
  let sessionState = null;

  if (sessionId && user.id) {
    sessionState = await getSessionState(sessionId, user.id);
  }

  if (!sessionState && user.id && sessionId) {
    const newSession = await createSession(user.id, params.id);
    sessionId = newSession.id;
    if (sessionId) {
      sessionState = await getSessionState(sessionId, user.id);
    }
  } else if (!sessionState && user.id) {
    const newSession = await createSession(user.id, params.id);
    const newSessionId = newSession.id;
    sessionId = newSessionId;
    sessionState = await getSessionState(newSessionId, user.id);
  }

  if (!sessionState) redirect('/dashboard');

  // Use timeStuck from session state (already calculated server-side in queries.ts)
  const initialTimeSpent = sessionState.timeStuck;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[1fr,1fr,300px] gap-6 h-[calc(100vh-120px)]">
        {/* Problem Description */}
        <div className="overflow-auto">
          <ProblemViewer
            problem={{
              id: problem.id,
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty,
              topic: problem.topic,
            }}
          />
        </div>

        {/* Chat Interface */}
        <div className="overflow-hidden">
          <ChatInterface
            sessionId={sessionId!}
            initialMessages={sessionState.messages.map((m: Message) => ({
              id: m.id,
              role: m.role,
              content: m.content,
            }))}
          />
        </div>

        {/* Progress Sidebar */}
        <div>
          <ProgressIndicator
            hintsUsed={sessionState.hintsUsed}
            timeSpent={initialTimeSpent}
            completed={false}
          />
        </div>
      </div>
    </div>
  );
}