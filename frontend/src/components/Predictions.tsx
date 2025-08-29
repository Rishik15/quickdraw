import React from 'react';
import './Predictions.css';

interface PredictionsProps {
  predictions: string[];
  status: 'playing' | 'success' | 'timeout';
  targetWord: string;
}

const Predictions: React.FC<PredictionsProps> = ({ predictions, status, targetWord }) => {
  if (status === 'playing' && predictions.length === 0) {
    return (
      <div className="predictions-overlay">
        <div className="predictions-bubble playing">
          <div>...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="predictions-overlay">
      <div className={`predictions-bubble ${status}`}>
        {status === 'success' && (
          <div>Yes, that's a {targetWord}! Well done! 🎉</div>
        )}
        {status === 'timeout' && (
          <div>Time's up! The word was {targetWord}. Better luck next time! ⏰</div>
        )}
        {status === 'playing' && predictions.length > 0 && (
          <div>I see {predictions.join(', ')}</div>
        )}
      </div>
    </div>
  );
};

export default Predictions;
