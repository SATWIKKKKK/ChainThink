'use client';

import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface HintButtonProps {
  onClick: () => void;
  disabled?: boolean;
  hintsUsed: number;
}

export function HintButton({ onClick, disabled, hintsUsed }: HintButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      className="gap-2"
      title={`Request a hint (${hintsUsed} used)`}
    >
      <Lightbulb className="h-4 w-4" />
      <span>Hint</span>
      {hintsUsed > 0 && (
        <span className="text-xs text-muted-foreground">({hintsUsed})</span>
      )}
    </Button>
  );
}
