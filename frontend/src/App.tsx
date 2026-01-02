import React, { useState, useRef, useCallback } from 'react';
import Canvas, { CanvasHandles } from './components/Canvas';
import Timer from './components/Timer';
import Predictions from './components/Predictions';
import './App.css';

function App() {
  const prompts = [
    "apple", "basketball", "bicycle", "cake", "clock", "cloud", "crown", "cup",
    "flower", "hot air balloon", "house", "ice cream", "lollipop", "moustache",
    "pizza", "smiley face", "star", "suitcase", "t-shirt", "tree"
  ];
  
  const [availablePrompts, setPrompts] = useState(prompts);

  // Shuffle prompts array on component mount
  React.useEffect(() => {
    const shuffledPrompts = [...prompts].sort(() => Math.random() - 0.5);
    setPrompts(shuffledPrompts);
  }, []);
  const canvasRef = useRef<CanvasHandles>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [color, setColor] = useState('black');
  const [darkMode, setDarkMode] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'success' | 'timeout'>('playing');

  const handleClear = () => canvasRef.current?.clearCanvas();
  const handleUndo = () => canvasRef.current?.undo();
  const handleRedo = () => canvasRef.current?.redo();
  const handleToggleDarkMode = () => setDarkMode(!darkMode);

  const handleTimeExpired = useCallback(() => {
    setGameStatus('timeout');
    setPredictions([]); // Clear predictions when time expires
    if (currentPromptIndex < availablePrompts.length - 1) {
      setTimeout(() => {
        setCurrentPromptIndex(prev => prev + 1);
        setGameStatus('playing');
        setWrongGuesses([]);
        setPredictions([]); // Clear predictions for next prompt
        canvasRef.current?.clearCanvas();
      }, 2000);
    }
  }, [currentPromptIndex, prompts.length]);

  const handlePredictions = useCallback((newPredictions: string[]) => {
    setPredictions(newPredictions);
    
    // Check if any new prediction matches the current prompt
    // Only consider predictions that haven't been wrong before
    const correctGuess = newPredictions.find(pred => 
      !wrongGuesses.includes(pred) && 
      pred.toLowerCase() === availablePrompts[currentPromptIndex].toLowerCase()
    );

    if (correctGuess) {
      setGameStatus('success');
      if (currentPromptIndex < availablePrompts.length - 1) {
        setTimeout(() => {
          setCurrentPromptIndex(prev => prev + 1);
          setGameStatus('playing');
          setWrongGuesses([]);
          setPredictions([]); // Clear predictions for next prompt
          canvasRef.current?.clearCanvas();
        }, 2000);
      }
    } else {
      // Add new predictions to wrong guesses
      setWrongGuesses(prev => [...prev, ...newPredictions]);
    }
  }, [currentPromptIndex, availablePrompts, wrongGuesses]);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <div className="header-left">
          Draw: {availablePrompts[currentPromptIndex]}
        </div>
        <div className="toolbar-controls">
          <label className="color-picker-label">
            Brush Color:{' '}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-picker"
            />
          </label>
          <button onClick={handleClear} className="icon">Clear</button>
          <button onClick={handleToggleDarkMode} className="icon">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleUndo} className="icon">Undo</button>
          <button onClick={handleRedo} className="icon">Redo</button>
        </div>
        <Timer 
          key={currentPromptIndex} 
          initialTime={20} 
          onTimeExpired={handleTimeExpired} 
        />
        <div className="header-icons">
          <div className="icon">💾</div>
          <div className="icon">»</div>
          <div className="icon">✕</div>
        </div>
      </header>
      <main className="app-main">
        <Canvas 
          ref={canvasRef} 
          color={color} 
          darkMode={darkMode} 
          onFinishDrawing={handlePredictions} 
        />
        <Predictions 
          predictions={predictions} 
          status={gameStatus} 
          targetWord={availablePrompts[currentPromptIndex]} 
        />
      </main>
    </div>
  );
}

export default App;
