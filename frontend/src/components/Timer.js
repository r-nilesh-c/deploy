import React, { useState, useEffect } from 'react';

/**
 * Timer Component - Displays countdown timer for the quiz
 * Handles time formatting and warning states
 */
const Timer = ({ duration, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Reset timer when duration changes
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    // Create interval for countdown
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Time's up!
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Determine timer style based on remaining time
  const getTimerClass = () => {
    if (timeLeft <= 60) return 'timer warning'; // Last minute - red and pulsing
    if (timeLeft <= 300) return 'timer caution'; // Last 5 minutes - orange
    return 'timer'; // Normal - default color
  };

  // Get warning message based on time left
  const getWarningMessage = () => {
    if (timeLeft <= 60) return '⚠️ Less than 1 minute left!';
    if (timeLeft <= 300) return '⏰ 5 minutes remaining';
    return null;
  };

  return (
    <div className="timer-container">
      <div className={getTimerClass()}>
        <span className="timer-icon">⏱️</span>
        <span className="timer-text">{formatTime(timeLeft)}</span>
      </div>
      
      {/* Warning message for low time */}
      {getWarningMessage() && (
        <div className="timer-warning">
          {getWarningMessage()}
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="timer-progress">
        <div 
          className="timer-progress-bar"
          style={{
            width: `${(timeLeft / duration) * 100}%`,
            backgroundColor: timeLeft <= 60 ? '#e53e3e' : timeLeft <= 300 ? '#ed8936' : '#48bb78'
          }}
        />
      </div>
    </div>
  );
};

export default Timer;