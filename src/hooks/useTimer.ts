import { useState, useEffect, useRef, useCallback } from 'react';

interface QuestionData {
  questionNumber: number;
  elapsedTime: number;
  timeTaken: number;
}

export const useTimer = () => {
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(0);
  const [showReport, setShowReport] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const recordQuestion = useCallback(() => {
    if (!isActive || isPaused || !startTime) return;

    const currentTime = Date.now();
    const totalElapsedTime = Math.floor((currentTime - startTime - totalPausedTime) / 1000);
    
    // We're finishing the current question (questions.length + 1)
    const questionNumber = questions.length + 1;
    const timeTaken = totalElapsedTime - currentQuestionStartTime;

    const newQuestion: QuestionData = {
      questionNumber,
      elapsedTime: totalElapsedTime,
      timeTaken,
    };

    setQuestions(prev => [...prev, newQuestion]);
    // Set the start time for the NEXT question
    setCurrentQuestionStartTime(totalElapsedTime);
  }, [isActive, isPaused, startTime, totalPausedTime, questions, currentQuestionStartTime]);

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            // Timer is expiring, record the final question at the exact end time
            setIsActive(false);
            setShowReport(true);
            
            // Record final question with the exact duration as elapsed time
            if (startTime) {
              const questionNumber = questions.length + 1;
              const timeTaken = duration - currentQuestionStartTime;

              const finalQuestion: QuestionData = {
                questionNumber,
                elapsedTime: duration,
                timeTaken,
              };

              setQuestions(prev => [...prev, finalQuestion]);
            }
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
  }, [isActive, isPaused, timeLeft, duration, startTime, questions, currentQuestionStartTime]);

  const handleStart = () => {
    if (duration === 0) return;
    
    if (!isActive) {
      setTimeLeft(duration);
      setStartTime(Date.now());
      setTotalPausedTime(0);
      setQuestions([]);
      setCurrentQuestionStartTime(0);
      setShowReport(false);
    }
    
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!isPaused) {
      // Starting pause
      setPauseStartTime(Date.now());
      setIsPaused(true);
    } else {
      // Ending pause
      if (pauseStartTime) {
        const pauseDuration = Date.now() - pauseStartTime;
        setTotalPausedTime(prev => prev + pauseDuration);
        setPauseStartTime(null);
      }
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(0);
    setStartTime(null);
    setPauseStartTime(null);
    setTotalPausedTime(0);
    setQuestions([]);
    setCurrentQuestionStartTime(0);
    setShowReport(false);
  };

  const handleStop = () => {
    // Record the current question before stopping
    recordQuestion();
    setIsActive(false);
    setIsPaused(false);
    setShowReport(true);
  };

  return {
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
  };
};
