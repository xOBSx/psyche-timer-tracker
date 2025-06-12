
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TimeSelectorProps {
  duration: number;
  onDurationChange: (seconds: number) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ duration, onDurationChange }) => {
  const presetTimes = [
    { label: '15 min', seconds: 15 * 60 },
    { label: '30 min', seconds: 30 * 60 },
    { label: '45 min', seconds: 45 * 60 },
    { label: '60 min', seconds: 60 * 60 },
    { label: '90 min', seconds: 90 * 60 },
    { label: '120 min', seconds: 120 * 60 },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Select Duration</h3>
        {duration > 0 && (
          <div className="text-2xl font-mono font-bold text-primary">
            {formatTime(duration)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {presetTimes.map((time) => (
          <Button
            key={time.seconds}
            variant={duration === time.seconds ? "default" : "outline"}
            onClick={() => onDurationChange(time.seconds)}
            className="h-12"
          >
            {time.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Custom Duration</label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="0"
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value) || 0;
                    const currentSeconds = duration % 60;
                    onDurationChange(minutes * 60 + currentSeconds);
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="0"
                  onChange={(e) => {
                    const seconds = parseInt(e.target.value) || 0;
                    const currentMinutes = Math.floor(duration / 60);
                    onDurationChange(currentMinutes * 60 + seconds);
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSelector;
