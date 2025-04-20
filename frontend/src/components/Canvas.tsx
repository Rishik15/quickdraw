import React, { useRef, useEffect } from 'react';
import './Canvas.css';

interface CanvasProps {}

const Canvas: React.FC<CanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 900;
    canvas.height = 675;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;

    isDrawing = true;
    lastX = x;
    lastY = y;
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(lastX, lastY);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    lastX = x;
    lastY = y;
  };

  const finishDrawing = () => {
    isDrawing = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={finishDrawing}
      onMouseOut={finishDrawing}
    />
  );
};

export default Canvas;