import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getAllProblems, getUserSessions } from '@/lib/db/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  topic: string;
  orderIndex: number;
}

interface Session {
  id: string;
  problemId: string;
  completed: boolean;
  startedAt: Date;
  problem: {
    id: string;
    title: string;
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const [problems, sessions] = await Promise.all([
    getAllProblems(),
    getUserSessions(user.id!),
  ]) as [Problem[], Session[]];

  const completedProblemIds = new Set(
    sessions.filter((s: Session) => s.completed).map((s: Session) => s.problemId)
  );

  const inProgressSessions = sessions.filter((s: Session) => !s.completed);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">Ready to level up your problem-solving skills?</p>
      </div>

      {/* In Progress */}
      {inProgressSessions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
          <div className="grid gap-4">
            {inProgressSessions.map((session: Session) => (
              <Card key={session.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="font-semibold">{session.problem.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Started {new Date(session.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/dashboard/problems/${session.problemId}?session=${session.id}`}>
                      Continue
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Problem Library */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Dynamic Programming Problems</h2>
        <div className="grid gap-4">
          {problems.map((problem: Problem) => {
            const isCompleted = completedProblemIds.has(problem.id);
            const inProgress = inProgressSessions.find((s: Session) => s.problemId === problem.id);

            return (
              <Card key={problem.id} className={isCompleted ? 'border-emerald-500/50' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : inProgress ? (
                          <Clock className="h-5 w-5 text-amber-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <CardTitle>{problem.title}</CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {problem.description.split('\n')[0]}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        problem.difficulty <= 2 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        problem.difficulty <= 3 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }
                    >
                      Difficulty {problem.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild variant={isCompleted ? 'outline' : 'default'}>
                    <Link href={`/dashboard/problems/${problem.id}`}>
                      {isCompleted ? 'Review' : inProgress ? 'Continue' : 'Start Problem'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}