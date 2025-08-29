import React, { useState, useEffect } from 'react';
import './Timer.css';

interface TimerProps {
  initialTime: number;
  onTimeExpired: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeExpired }) => {
  const [time, setTime] = useState(initialTime);

  // Reset timer when initialTime changes or component mounts
  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (time > 0) {
      const timerId = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onTimeExpired();
    }
  }, [time, onTimeExpired]);

  return (
    <div className="timer">
      {String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}
    </div>
  );
};

export default Timer;
