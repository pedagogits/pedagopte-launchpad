import { useState, useEffect, useCallback } from "react";

interface UseQuestionTimerProps {
  initialTime: number;
  onTimeUp?: () => void;
  autoStart?: boolean;
}

export const useQuestionTimer = ({
  initialTime,
  onTimeUp,
  autoStart = true,
}: UseQuestionTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsTimeUp(true);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeUp, timeRemaining]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsRunning(false);
    setIsTimeUp(false);
  }, [initialTime]);

  const restart = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsRunning(true);
    setIsTimeUp(false);
  }, [initialTime]);

  return {
    timeRemaining,
    isRunning,
    isTimeUp,
    start,
    pause,
    reset,
    restart,
  };
};
