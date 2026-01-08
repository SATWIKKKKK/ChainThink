'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  topic: string;
}

interface ProblemViewerProps {
  problem: Problem;
}

const difficultyColors = {
  1: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  2: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  3: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  4: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  5: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const difficultyLabels = {
  1: 'Easy',
  2: 'Easy-Medium',
  3: 'Medium',
  4: 'Medium-Hard',
  5: 'Hard',
};

export function ProblemViewer({ problem }: ProblemViewerProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl">{problem.title}</CardTitle>
          <Badge
            variant="outline"
            className={`${
              difficultyColors[problem.difficulty as keyof typeof difficultyColors]
            }`}
          >
            {difficultyLabels[problem.difficulty as keyof typeof difficultyLabels]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground capitalize">
          {problem.topic.replace('-', ' ')}
        </p>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
          {problem.description}
        </pre>
      </CardContent>
    </Card>
  );
}