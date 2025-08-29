import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import './Canvas.css';

export interface CanvasHandles {
  clearCanvas: () => void;
  toggleDarkMode: () => void;
  undo: () => void;
  redo: () => void;
}

interface CanvasProps {
  color: string;
  darkMode: boolean;
  onFinishDrawing: (predictions: string[]) => void;
}

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
}

const Canvas: React.ForwardRefRenderFunction<CanvasHandles, CanvasProps> = ({ color, darkMode, onFinishDrawing }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const [strokes, setStrokes] = useState<Stroke[]>([]);   // stack of strokes
  const currentStrokeRef = useRef<Stroke | null>(null);   // current stroke being drawn
  const [undoneStrokes, setUndoneStrokes] = useState<Stroke[]>([]); // stack of undone strokes

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = 5;
        contextRef.current = context;
        strokes.forEach(drawStroke); // Redraw existing strokes
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    if (context) {
      context.lineCap = 'round';
      context.strokeStyle = color;
      context.lineWidth = 5;
      contextRef.current = context;
    }
  }, [color]); // Remove strokes from dependency array as it's not needed here

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.backgroundColor = darkMode ? '#333' : '#fff';
    }
  }, [darkMode]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect(); // Gets the position of the canvas relative to the viewport
    // Calculates mouse position inside canvas (mouse's screen coordinates (clientX, clientY) - canvas's top-left corner (rect.left, rect.top))
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;

    isDrawingRef.current = true;
    lastPosRef.current = { x, y };

    currentStrokeRef.current = {
      color: color,
      points: [{ x, y }],
    }; // Initialize current stroke with the first point
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isDrawingRef.current || !contextRef.current || !canvasRef.current) return;

    const rect = canvas.getBoundingClientRect(); // Gets the position of the canvas relative to the viewport
    // Calculates mouse position inside canvas (mouse's screen coordinates (clientX, clientY) - canvas's top-left corner (rect.left, rect.top))
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(lastPosRef.current.x, lastPosRef.current.y);
// Add x and y coordinates to the stack here (these are individual points)
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();  // Renders the line on the canvas
    contextRef.current.closePath();  // Closes the path

    lastPosRef.current = { x, y };  // Updates the last position to the current position

    currentStrokeRef.current?.points.push({ x, y }); // Add the current point to the current stroke

    if (undoneStrokes.length > 0) {
      setUndoneStrokes([]); // Clear undone strokes if drawing
    }
  };

  const finishDrawing = async () => {
    isDrawingRef.current = false;

    const stroke = currentStrokeRef.current;
    if (stroke) {
      const newStrokes = [...strokes, stroke];
      setStrokes(newStrokes);
      currentStrokeRef.current = null; // Reset current stroke

      try {
        const response = await fetch('http://localhost:5002/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            rawStrokes: newStrokes,
            exclude: [] // Pass empty array for now, could be used to exclude previous wrong guesses
          }),
        });
        const data = await response.json();
        if (data.prediction) {
          onFinishDrawing(data.prediction);
        }
      } catch (error) {
        console.error('Error getting prediction:', error);
        onFinishDrawing([]); // Send empty array on error
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  useImperativeHandle(ref, () => ({
    clearCanvas,
    toggleDarkMode: () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const newDarkMode = canvas.style.backgroundColor === '#fff';
        canvas.style.backgroundColor = newDarkMode ? '#333' : '#fff';
      }
    },
    undo,
    redo,
  }));

  const undo = () => {
    if (strokes.length === 0) return;
    const newStrokes = [...strokes];
    const undone = newStrokes.pop();
    if (undone) {
      setStrokes(newStrokes);
      setUndoneStrokes(prev => [...prev, undone]);
      clearCanvas();
      newStrokes.forEach(drawStroke);
    }
  };
  
  const redo = () => {
    if (undoneStrokes.length === 0) return;
    const newUndone = [...undoneStrokes];
    const redone = newUndone.pop();
    if (redone) {
      const newStrokes = [...strokes, redone];
      setStrokes(newStrokes);
      setUndoneStrokes(newUndone);
      drawStroke(redone);
    }
  };
  
  const drawStroke = (stroke: Stroke) => {
    const context = contextRef.current;
    if (!context || stroke.points.length < 2) return;
  
    context.beginPath();
    context.strokeStyle = stroke.color;
    context.lineWidth = 5;
  
    for (let i = 1; i < stroke.points.length; i++) {
      const from = stroke.points[i - 1];
      const to = stroke.points[i];
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
    }
  
    context.stroke();
    context.closePath();
  };

  return (
    <div className="canvas-container">
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

export default forwardRef(Canvas);
