import React from 'react';
import './Predictions.css';

interface PredictionsProps {
  predictions: string[];
}

const Predictions: React.FC<PredictionsProps> = ({ predictions }) => {
  return (
    <div className="predictions">
      {predictions.map((prediction, index) => (
        <span key={index} className="prediction-item">{prediction}</span>
      ))}
    </div>
  );
};

export default Predictions;