
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionRecorderProps {
  onRecordQuestion: () => void;
  isPaused: boolean;
}

const QuestionRecorder: React.FC<QuestionRecorderProps> = ({ onRecordQuestion, isPaused }) => {
  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground bg-muted p-3 rounded-lg">
        <p className="font-medium">Press SPACEBAR to record each question</p>
        <p>A ding sound will confirm your input</p>
      </div>
      
      <Button
        onClick={onRecordQuestion}
        disabled={isPaused}
        className="w-full h-12"
        size="lg"
        variant="outline"
      >
        <Check className="h-5 w-5 mr-2" />
        Record Question
      </Button>
    </div>
  );
};

export default QuestionRecorder;
