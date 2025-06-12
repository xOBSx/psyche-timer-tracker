
import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerControlsProps {
  isActive: boolean;
  isPaused: boolean;
  duration: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStop: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  isPaused,
  duration,
  onStart,
  onPause,
  onReset,
  onStop,
}) => {
  return (
    <div className="flex gap-2 justify-center">
      {!isActive ? (
        <Button
          onClick={onStart}
          disabled={duration === 0}
          className="flex-1 h-12"
          size="lg"
        >
          <Play className="h-5 w-5 mr-2" />
          Start
        </Button>
      ) : (
        <>
          <Button
            onClick={onPause}
            variant="outline"
            className="flex-1 h-12"
            size="lg"
          >
            <Pause className="h-5 w-5 mr-2" />
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            onClick={onStop}
            variant="destructive"
            className="h-12 px-6"
            size="lg"
          >
            Stop & Report
          </Button>
        </>
      )}
      
      <Button
        onClick={onReset}
        variant="outline"
        className="h-12 px-6"
        size="lg"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default TimerControls;
