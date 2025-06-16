
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionData {
  questionNumber: number;
  elapsedTime: number;
  timeTaken: number;
}

interface SessionProgressProps {
  questions: QuestionData[];
}

const SessionProgress: React.FC<SessionProgressProps> = ({ questions }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const averageTime = questions.length > 0 
    ? questions.reduce((sum, q) => sum + q.timeTaken, 0) / questions.length 
    : 0;

  const lastQuestionTime = questions.length > 0 
    ? questions[questions.length - 1].timeTaken 
    : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Current Session Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">{questions.length}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {formatTime(Math.round(averageTime))}
            </div>
            <div className="text-sm text-muted-foreground">Avg. Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {formatTime(lastQuestionTime)}
            </div>
            <div className="text-sm text-muted-foreground">Last Question</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionProgress;
