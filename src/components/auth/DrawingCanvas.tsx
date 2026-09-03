import React, { useRef, useState, useEffect } from 'react';
import { Stroke, Point, DrawingData } from '../../utils/shapeMatcher';
import { sounds } from '../../utils/sound';

interface DrawingCanvasProps {
  onDrawingChange: (data: DrawingData) => void;
  initialDrawing?: DrawingData | null;
  mode?: 'register' | 'login';
  title?: string;
  subtitle?: string;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onDrawingChange,
  initialDrawing,
  mode = 'register',
  title = 'SECRET SECURITY DRAWING',
  subtitle = 'Because apparently passwords were too convenient.',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>(initialDrawing?.strokes || []);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const [fakeQuality, setFakeQuality] = useState<number>(37);
  const [fakeConfidence, setFakeConfidence] = useState<number>(14);
  const [analysisText, setAnalysisText] = useState<string>('WAITING FOR GEOMETRIC GESTURE...');

  // Redraw canvas whenever strokes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chaotic grid lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let x = 20; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 20; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw all completed strokes
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const allStrokes = [...strokes, currentStroke];
    for (const stroke of allStrokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, currentStroke]);

  // Coordinate helper
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    sounds.playKeypress();
    const point = getCanvasCoords(e);
    if (!point) return;

    setIsDrawing(true);
    setCurrentStroke([point]);
    setAnalysisText('ANALYZING ARTISTIC INTENT IN REAL-TIME...');
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const point = getCanvasCoords(e);
    if (!point) return;

    setCurrentStroke(prev => [...prev, point]);

    // Update fake analytics to induce psychological curiosity
    setFakeQuality(prev => Math.min(99, (prev + 3) % 100));
    setFakeConfidence(prev => Math.min(88, prev + 1));
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    sounds.playDing();

    if (currentStroke.length > 0) {
      const updated = [...strokes, currentStroke];
      setStrokes(updated);
      setCurrentStroke([]);
      const drawingData: DrawingData = {
        strokes: updated,
        timestamp: Date.now(),
      };
      onDrawingChange(drawingData);

      const fakeStatuses = [
        'ASKING GEOMETRY DEPARTMENT FOR OPINION...',
        'SHAPE CONFIDENCE CALCULATED AT 14.2%.',
        'VERIFYING NON-EUCLIDEAN CONVEXITY...',
        'COMPARING DRAWING WITH REJECTED PATENTS...',
        'SHAPE REGISTERED IN UNSTABLE MEMORY.'
      ];
      setAnalysisText(fakeStatuses[Math.floor(Math.random() * fakeStatuses.length)]);
    }
  };

  const handleClear = () => {
    sounds.playBuzzer();
    setStrokes([]);
    setCurrentStroke([]);
    setFakeQuality(12);
    setFakeConfidence(4);
    setAnalysisText('CANVAS PURGED. GEOMETRIC EXISTENCE RESET.');
    onDrawingChange({ strokes: [], timestamp: Date.now() });
  };

  return (
    <div className={`drawing-canvas-wrapper mode-${mode}`}>
      <div className="canvas-header-scam">
        <h3 className="canvas-title">{title}</h3>
        <p className="canvas-subtitle">{subtitle}</p>
        <span className="canvas-badge-rot">CONFIDENTIAL SHAPE™</span>
      </div>

      <div className="canvas-frame-tilted">
        <canvas
          ref={canvasRef}
          width={280}
          height={180}
          className="cursed-drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="canvas-watermark">DRAW WITH FINGER OR MOUSE</div>
      </div>

      {/* Cursed Analysis Meters */}
      <div className="canvas-metrics-panel">
        <div className="metric-row">
          <span>SHAPE CONFIDENCE:</span>
          <span className="metric-val text-neon-pink">{fakeConfidence}%</span>
        </div>
        <div className="metric-row">
          <span>GEOMETRIC SUSPICION:</span>
          <span className="metric-val text-neon-green">HIGH</span>
        </div>
        <div className="metric-progress-bar">
          <div className="metric-progress-fill" style={{ width: `${fakeQuality}%` }} />
        </div>
        <div className="metric-status-msg">{analysisText}</div>
      </div>

      <div className="canvas-actions-row">
        <button
          type="button"
          className="canvas-btn-clear"
          onClick={handleClear}
          title="Clear canvas"
        >
          🗑️ CLEAR DRAWING
        </button>

        <button
          type="button"
          className="canvas-btn-confirm"
          onClick={() => {
            sounds.playDing();
            alert('SHAPE ACCEPTED INTO CORPORATE CLOUD (PROBABLY).');
          }}
        >
          ✓ I HAVE DRAWN SOMETHING
        </button>
      </div>
    </div>
  );
};
