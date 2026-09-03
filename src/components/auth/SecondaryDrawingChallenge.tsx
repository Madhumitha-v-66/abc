import React, { useState } from 'react';
import { DrawingCanvas } from './DrawingCanvas';
import { DrawingData } from '../../utils/shapeMatcher';
import { sounds } from '../../utils/sound';

interface SecondaryDrawingChallengeProps {
  onPassed: () => void;
  onCancel: () => void;
}

export const SecondaryDrawingChallenge: React.FC<SecondaryDrawingChallengeProps> = ({
  onPassed,
  onCancel,
}) => {
  const [selectedShape, setSelectedShape] = useState<string>('Triangle');
  const [drawing, setDrawing] = useState<DrawingData | null>(null);
  const [attemptFeedback, setAttemptFeedback] = useState<string | null>(null);

  const SHAPES = ['Triangle', 'Square', 'Star', 'Arrow'];

  const handleVerify = () => {
    if (!drawing || drawing.strokes.length === 0) {
      sounds.playBuzzer();
      setAttemptFeedback('ERROR: YOU DREW ABSOLUTELY NOTHING. INVISIBLE SHAPES ARE NOT ACCEPTED.');
      return;
    }

    sounds.playDing();
    setAttemptFeedback('GEOMETRIC EXAM PASSED: You survived the secondary distraction drawing!');
    setTimeout(() => {
      onPassed();
    }, 1200);
  };

  return (
    <div className="secondary-challenge-overlay">
      <div className="secondary-challenge-card">
        <div className="challenge-banner-top">
          ⚠️ ANOMALOUS BEHAVIOR MITIGATION: GEOMETRIC INTERROGATION
        </div>

        <div className="challenge-body">
          <p className="challenge-instruction-riddle">
            “DRAW EXACTLY ONE OF THE FOLLOWING SHAPES. HOWEVER, DO NOT DRAW THE SHAPE YOU SELECTED, UNLESS YOU DRAW THE THIRD SHAPE FROM THE LEFT WITHOUT BELIEVING IN SQUARES.”
          </p>

          <div className="shape-selection-row">
            {SHAPES.map(s => (
              <button
                key={s}
                type="button"
                className={`shape-sel-btn ${selectedShape === s ? 'shape-sel-active' : ''}`}
                onClick={() => { sounds.playKeypress(); setSelectedShape(s); }}
              >
                {s === 'Triangle' && '△'}
                {s === 'Square' && '□'}
                {s === 'Star' && '★'}
                {s === 'Arrow' && '↗'}{' '}
                {s}
              </button>
            ))}
          </div>

          <div className="challenge-canvas-holder">
            <DrawingCanvas
              title="SECONDARY RIDDLE CANVAS"
              subtitle={`Selected: ${selectedShape} (Remember: Do not draw what you selected)`}
              onDrawingChange={setDrawing}
              mode="login"
            />
          </div>

          {attemptFeedback && (
            <div className="challenge-feedback-callout">
              {attemptFeedback}
            </div>
          )}

          <div className="challenge-actions-row">
            <button
              type="button"
              className="challenge-submit-btn"
              onClick={handleVerify}
            >
              📐 VERIFY PHILOSOPHICAL SHAPE
            </button>
            <button
              type="button"
              className="challenge-cancel-btn"
              onClick={onCancel}
            >
              SURRENDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
