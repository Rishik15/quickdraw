import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';

interface CanvasProps {}

const Canvas: React.FC<CanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const [color, setColor] = useState('black');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 900;
    canvas.height = 675;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  }, [color]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;

    isDrawingRef.current = true;
    lastPosRef.current = { x, y };
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawingRef.current || !contextRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();

    lastPosRef.current = { x, y };
  };

  const finishDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className="canvas-container">
      <div className="toolbar">
        <label>
          Brush Color:{' '}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseOut={finishDrawing}
      />
    </div>
  );
};

export default Canvas;
