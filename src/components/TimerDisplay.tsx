
import React from 'react';
import { Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimerDisplayProps {
  timeLeft: number;
  questionCount: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, questionCount }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Timer className="h-6 w-6" />
          Countdown Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-foreground mb-2">
            {formatTime(timeLeft)}
          </div>
          {questionCount > 0 && (
            <div className="text-sm text-muted-foreground">
              Questions answered: {questionCount}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerDisplay;
