import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TimeSelector from './TimeSelector';
import TimerControls from './TimerControls';
import ProgressReport from './ProgressReport';

interface QuestionData {
  questionNumber: number;
  elapsedTime: number;
  timeTaken: number;
}

const CountdownTimer = () => {
  const [duration, setDuration] = useState(0); // in seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0); // Total time spent paused
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [showReport, setShowReport] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create a simple ding sound using Web Audio API
    const createDingSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    };

    audioRef.current = { play: createDingSound } as any;
  }, []);

  const playDingSound = useCallback(() => {
    try {
      if (audioRef.current) {
        (audioRef.current as any).play();
      }
    } catch (error) {
      console.log('Could not play sound:', error);
    }
  }, []);

  const handleSpacebarPress = useCallback(() => {
    if (!isActive || isPaused || !startTime) return;

    const currentTime = Date.now();
    const totalElapsedTime = Math.floor((currentTime - startTime - pausedTime) / 1000);
    const questionNumber = questions.length + 1; // Start from 1 for actual questions
    
    const lastElapsedTime = questions.length > 0 ? questions[questions.length - 1].elapsedTime : 0;
    const timeTaken = totalElapsedTime - lastElapsedTime;

    const newQuestion: QuestionData = {
      questionNumber,
      elapsedTime: totalElapsedTime,
      timeTaken,
    };

    setQuestions(prev => [...prev, newQuestion]);
    playDingSound();
  }, [isActive, isPaused, startTime, pausedTime, questions, playDingSound]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handleSpacebarPress();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleSpacebarPress]);

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            setShowReport(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft]);

  const handleStart = () => {
    if (duration === 0) return;
    
    if (!isActive) {
      setTimeLeft(duration);
      setStartTime(Date.now());
      setPausedTime(0);
      setQuestions([]);
      setShowReport(false);
    }
    
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (isPaused) {
      // Resuming - add the pause duration to total paused time
      const currentTime = Date.now();
      const pauseDuration = currentTime - (startTime || 0) - (duration - timeLeft) * 1000 - pausedTime;
      setPausedTime(prev => prev + pauseDuration);
    }
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(0);
    setStartTime(null);
    setPausedTime(0);
    setQuestions([]);
    setShowReport(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setShowReport(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showReport) {
    return (
      <ProgressReport
        questions={questions}
        totalDuration={duration}
        onNewSession={() => {
          setShowReport(false);
          handleReset();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Psychometric Timer</h1>
          <p className="text-muted-foreground">Track your progress with precision timing</p>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Timer className="h-6 w-6" />
              Countdown Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isActive && timeLeft === 0 && (
              <TimeSelector duration={duration} onDurationChange={setDuration} />
            )}

            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-foreground mb-2">
                {formatTime(timeLeft)}
              </div>
              {questions.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Questions answered: {questions.length}
                </div>
              )}
            </div>

            <TimerControls
              isActive={isActive}
              isPaused={isPaused}
              duration={duration}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onStop={handleStop}
            />

            {isActive && (
              <div className="space-y-4">
                <div className="text-center text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <p className="font-medium">Press SPACEBAR to record each question</p>
                  <p>A ding sound will confirm your input</p>
                </div>
                
                <Button
                  onClick={handleSpacebarPress}
                  disabled={isPaused}
                  className="w-full h-12"
                  size="lg"
                  variant="outline"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Record Question
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {questions.length > 0 && (
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
                    {questions.length > 0 ? 
                      formatTime(Math.round(questions.reduce((sum, q) => sum + q.timeTaken, 0) / questions.length))
                      : '00:00'
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {questions.length > 0 ? formatTime(questions[questions.length - 1].timeTaken) : '00:00'}
                  </div>
                  <div className="text-sm text-muted-foreground">Last Question</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
