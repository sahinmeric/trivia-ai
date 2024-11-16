import { useEffect, useState, useCallback } from "react";

export const useTimer = (initialTime: number, onTimeOut: () => void) => {
  const [timer, setTimer] = useState(initialTime);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      onTimeOut();
    }
  }, [timer, onTimeOut]);

  const resetTimer = useCallback(() => {
    setTimer(initialTime);
  }, [initialTime]);

  return { timer, resetTimer };
};
