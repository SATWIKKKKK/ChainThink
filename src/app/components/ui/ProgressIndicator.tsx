'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Lightbulb, Target } from 'lucide-react';

interface ProgressIndicatorProps {
  hintsUsed: number;
  timeSpent: number; 
  completed: boolean;
}

export function ProgressIndicator({
  hintsUsed,
  timeSpent,
  completed,
}: ProgressIndicatorProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <Badge variant={completed ? 'default' : 'secondary'}>
              {completed ? 'Completed' : 'In Progress'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Hints Used</span>
            </div>
            <span className="text-sm font-bold">{hintsUsed}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Spent</span>
            </div>
            <span className="text-sm font-bold">{formatTime(timeSpent)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}