
import React from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';
import { useKeyboard } from '@/hooks/useKeyboard';
import TimerDisplay from './TimerDisplay';
import TimeSelector from './TimeSelector';
import TimerControls from './TimerControls';
import QuestionRecorder from './QuestionRecorder';
import SessionProgress from './SessionProgress';
import ProgressReport from './ProgressReport';

const CountdownTimer = () => {
  const {
    duration,
    setDuration,
    timeLeft,
    isActive,
    isPaused,
    questions,
    showReport,
    setShowReport,
    handleStart,
    handlePause,
    handleReset,
    handleStop,
    recordQuestion,
  } = useTimer();

  const { playDingSound } = useAudio();

  const handleRecordQuestion = () => {
    recordQuestion();
    playDingSound();
  };

  useKeyboard(handleRecordQuestion);

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

        <TimerDisplay timeLeft={timeLeft} questionCount={questions.length} />

        <div className="w-full max-w-md mx-auto space-y-6">
          {!isActive && timeLeft === 0 && (
            <TimeSelector duration={duration} onDurationChange={setDuration} />
          )}

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
            <QuestionRecorder
              onRecordQuestion={handleRecordQuestion}
              isPaused={isPaused}
            />
          )}
        </div>

        {questions.length > 0 && (
          <SessionProgress questions={questions} />
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
