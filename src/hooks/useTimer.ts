import { useEffect, useState, useCallback, useRef } from "react";

export const useTimer = (initialTime: number, onTimeOut: () => void) => {
  const [timer, setTimer] = useState(initialTime);
  const timeoutTriggered = useRef(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      if (!timeoutTriggered.current) {
        timeoutTriggered.current = true;
        onTimeOut();
      }
    }
  }, [timer, onTimeOut]);

  const resetTimer = useCallback(() => {
    setTimer(initialTime);
    timeoutTriggered.current = false;
  }, [initialTime]);

  return { timer, resetTimer };
};
