import React from 'react';
import './Instructions.css';

interface InstructionsProps {
  targetWord: string;
}

const Instructions: React.FC<InstructionsProps> = ({ targetWord }) => {
  return (
    <div className="instructions">
      Draw: <span className="target-word">{targetWord}</span>
    </div>
  );
};

export default Instructions;