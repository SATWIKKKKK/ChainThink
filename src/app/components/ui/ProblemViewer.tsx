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
  1: 'bg-green-500',
  2: 'bg-green-600',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500',
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
            className={`${
              difficultyColors[problem.difficulty as keyof typeof difficultyColors]
            } text-white`}
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