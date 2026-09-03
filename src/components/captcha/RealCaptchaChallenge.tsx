import React, { useState } from 'react';
import { sounds } from '../../utils/sound';
import { CheckCircle2 } from 'lucide-react';

interface RealCaptchaChallengeProps {
  challengeIndex: number;
  stepNumber: number;
  totalSteps: number;
  onSubmitAnswer: (isCorrect: boolean) => void;
}

export const RealCaptchaChallenge: React.FC<RealCaptchaChallengeProps> = ({
  challengeIndex,
  stepNumber,
  totalSteps,
  onSubmitAnswer,
}) => {
  // Selected multi-tiles
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // Single selection
  const [singleChoice, setSingleChoice] = useState<string | null>(null);
  // Text input for distorted text
  const [textInput, setTextInput] = useState('');

  const toggleTile = (id: number) => {
    sounds.playKeypress();
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleSingleSelect = (val: string) => {
    sounds.playKeypress();
    setSingleChoice(val);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playKeypress();

    let passed = false;

    switch (challengeIndex % 12) {
      // Challenge 0: Traffic lights (1, 3, 5)
      case 0:
        passed =
          selectedIds.includes(1) &&
          selectedIds.includes(3) &&
          selectedIds.includes(5) &&
          !selectedIds.includes(2) &&
          !selectedIds.includes(4) &&
          !selectedIds.includes(6);
        break;

      // Challenge 1: Bicycles (1, 3, 4)
      case 1:
        passed =
          selectedIds.includes(1) &&
          selectedIds.includes(3) &&
          selectedIds.includes(4) &&
          !selectedIds.includes(2) &&
          !selectedIds.includes(5) &&
          !selectedIds.includes(6);
        break;

      // Challenge 2: Stairs or Crosswalks (1, 3, 5)
      case 2:
        passed =
          selectedIds.includes(1) &&
          selectedIds.includes(3) &&
          selectedIds.includes(5) &&
          !selectedIds.includes(2) &&
          !selectedIds.includes(4) &&
          !selectedIds.includes(6);
        break;

      // Challenge 3: Odd object out (Baguette = 'baguette')
      case 3:
        passed = singleChoice === 'baguette';
        break;

      // Challenge 4: Matching symbol (star = 'star')
      case 4:
        passed = singleChoice === 'star';
        break;

      // Challenge 5: Water apparatus (1, 3, 6)
      case 5:
        passed =
          selectedIds.includes(1) &&
          selectedIds.includes(3) &&
          selectedIds.includes(6) &&
          !selectedIds.includes(2) &&
          !selectedIds.includes(4) &&
          !selectedIds.includes(5);
        break;

      // Challenge 6: Distorted characters ("7K9M")
      case 6:
        passed = textInput.trim().toUpperCase() === '7K9M';
        break;

      // Challenge 7: Approximately 37% of a bicycle (2, 4, 6)
      case 7:
        passed =
          selectedIds.includes(2) &&
          selectedIds.includes(4) &&
          selectedIds.includes(6) &&
          !selectedIds.includes(1) &&
          !selectedIds.includes(3) &&
          !selectedIds.includes(5);
        break;

      // Challenge 8: Employable items (1, 3, 5)
      case 8:
        passed =
          selectedIds.includes(1) &&
          selectedIds.includes(3) &&
          selectedIds.includes(5) &&
          !selectedIds.includes(2) &&
          !selectedIds.includes(4) &&
          !selectedIds.includes(6);
        break;

      // Challenge 9: Professional rectangle ('rect-16-9')
      case 9:
        passed = singleChoice === 'rect-16-9';
        break;

      // Challenge 10: Hot black corporate coffee (1, 3, 5)
      case 10:
        passed =
          selectedIds.includes(1) &&
          selectedIds.includes(3) &&
          selectedIds.includes(5) &&
          !selectedIds.includes(2) &&
          !selectedIds.includes(4) &&
          !selectedIds.includes(6);
        break;

      // Challenge 11: Freight commercial vehicle ('truck')
      case 11:
        passed = singleChoice === 'truck';
        break;

      default:
        passed = true;
    }

    // Call submit without revealing whether it was right or wrong!
    onSubmitAnswer(passed);
  };

  const renderCurrentChallengeContent = () => {
    switch (challengeIndex % 12) {
      // 0: Traffic lights
      case 0:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>SELECT ALL SQUARES WITH <u>TRAFFIC LIGHTS</u></h4>
              <p>Click verify once all traffic signals are selected.</p>
            </div>
            <div className="captcha-tiles-grid-6">
              {[
                { id: 1, label: '3-Signal Traffic Light (Green)', emoji: '🚦' },
                { id: 2, label: 'Paper Lantern', emoji: '🏮' },
                { id: 3, label: 'Pedestrian Beacon', emoji: '🚸' },
                { id: 4, label: 'Glow Stick', emoji: '🪄' },
                { id: 5, label: 'Gantry Signal Lights', emoji: '🚥' },
                { id: 6, label: 'Police Siren', emoji: '🚨' },
              ].map(tile => (
                <div
                  key={tile.id}
                  className={`captcha-tile-item ${selectedIds.includes(tile.id) ? 'tile-active' : ''}`}
                  onClick={() => toggleTile(tile.id)}
                >
                  <span className="tile-check">{selectedIds.includes(tile.id) ? '☑' : '☐'}</span>
                  <div className="tile-emoji">{tile.emoji}</div>
                  <span className="tile-label">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 1: Bicycles
      case 1:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>SELECT ALL SQUARES WITH <u>HUMAN-POWERED BICYCLES</u></h4>
              <p>Do not select motorbikes or shopping carts.</p>
            </div>
            <div className="captcha-tiles-grid-6">
              {[
                { id: 1, label: 'Road Racing Bicycle', emoji: '🚲' },
                { id: 2, label: '1200cc Motorcycle', emoji: '🏍️' },
                { id: 3, label: 'Mountain Trail Bike', emoji: '🚵' },
                { id: 4, label: 'Penny-Farthing Cycle', emoji: '🚴' },
                { id: 5, label: 'Electric Kick Scooter', emoji: '🛴' },
                { id: 6, label: 'Shopping Cart', emoji: '🛒' },
              ].map(tile => (
                <div
                  key={tile.id}
                  className={`captcha-tile-item ${selectedIds.includes(tile.id) ? 'tile-active' : ''}`}
                  onClick={() => toggleTile(tile.id)}
                >
                  <span className="tile-check">{selectedIds.includes(tile.id) ? '☑' : '☐'}</span>
                  <div className="tile-emoji">{tile.emoji}</div>
                  <span className="tile-label">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 2: Stairs or Crosswalks
      case 2:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>SELECT ALL SQUARES WITH <u>STAIRS OR PEDESTRIAN CROSSWALKS</u></h4>
              <p>Municipal pedestrian infrastructure.</p>
            </div>
            <div className="captcha-tiles-grid-6">
              {[
                { id: 1, label: 'Zebra Road Crossing', emoji: '🦓' },
                { id: 2, label: 'Fallen Tree Trunk', emoji: '🪵' },
                { id: 3, label: 'Fire Escape Steps', emoji: '🪜' },
                { id: 4, label: 'Office Window Frame', emoji: '🪟' },
                { id: 5, label: 'Pedestrian Footbridge Stairs', emoji: '🚶' },
                { id: 6, label: 'Basement Door', emoji: '🚪' },
              ].map(tile => (
                <div
                  key={tile.id}
                  className={`captcha-tile-item ${selectedIds.includes(tile.id) ? 'tile-active' : ''}`}
                  onClick={() => toggleTile(tile.id)}
                >
                  <span className="tile-check">{selectedIds.includes(tile.id) ? '☑' : '☐'}</span>
                  <div className="tile-emoji">{tile.emoji}</div>
                  <span className="tile-label">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 3: Odd object out
      case 3:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>CLICK THE SINGLE OBJECT THAT <u>CANNOT</u> BE RIDDEN TO AN OFFICE</h4>
              <p>Identify the non-vehicular biological entity.</p>
            </div>
            <div className="captcha-mcq-grid-4">
              {[
                { id: 'skateboard', label: 'Maple Skateboard with Bearings', emoji: '🛹' },
                { id: 'scooter', label: 'Alloy Kick Scooter', emoji: '🛴' },
                { id: 'baguette', label: 'Fresh Sourdough Baguette', emoji: '🥖' },
                { id: 'bike', label: 'Commuter Bicycle', emoji: '🚲' },
              ].map(item => (
                <div
                  key={item.id}
                  className={`captcha-choice-card ${singleChoice === item.id ? 'choice-card-picked' : ''}`}
                  onClick={() => handleSingleSelect(item.id)}
                >
                  <div className="tile-emoji">{item.emoji}</div>
                  <span className="tile-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 4: Matching symbol
      case 4:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>CLICK THE MATCHING GEOMETRY: <span className="text-yellow font-bold">[ ★ NEON GOLD STAR ]</span></h4>
              <p>Select target shape without decoy confusion.</p>
            </div>
            <div className="captcha-symbols-grid">
              {[
                { id: 'triangle', symbol: '▲', color: '#00ffff' },
                { id: 'square', symbol: '■', color: '#ff00ff' },
                { id: 'star', symbol: '★', color: '#ffff00' },
                { id: 'circle', symbol: '●', color: '#39ff14' },
                { id: 'diamond', symbol: '♦', color: '#ff5500' },
                { id: 'hexagon', symbol: '⬢', color: '#ffffff' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  className={`symbol-pick-btn ${singleChoice === item.id ? 'symbol-picked' : ''}`}
                  style={{ color: item.color }}
                  onClick={() => handleSingleSelect(item.id)}
                >
                  {item.symbol}
                </button>
              ))}
            </div>
          </div>
        );

      // 5: Water Apparatus / Fire Hydrant
      case 5:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>SELECT ALL SQUARES WITH <u>CIVIC WATER-SUPPLY APPARATUS</u></h4>
              <p>Hydrants, standpipes, and drinking fountains.</p>
            </div>
            <div className="captcha-tiles-grid-6">
              {[
                { id: 1, label: 'Municipal Fire Hydrant', emoji: '🧱' },
                { id: 2, label: 'Chemical Foam Canister', emoji: '🧯' },
                { id: 3, label: 'Street Water Standpipe', emoji: '🚰' },
                { id: 4, label: 'Diesel Engine Firetruck', emoji: '🚒' },
                { id: 5, label: 'Fuel Pump', emoji: '⛽' },
                { id: 6, label: 'Park Drinking Fountain', emoji: '🚿' },
              ].map(tile => (
                <div
                  key={tile.id}
                  className={`captcha-tile-item ${selectedIds.includes(tile.id) ? 'tile-active' : ''}`}
                  onClick={() => toggleTile(tile.id)}
                >
                  <span className="tile-check">{selectedIds.includes(tile.id) ? '☑' : '☐'}</span>
                  <div className="tile-emoji">{tile.emoji}</div>
                  <span className="tile-label">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 6: Distorted characters
      case 6:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>TYPE THE DISTORTED ANTI-AUTOMATION CHARACTERS</h4>
              <p>Decipher the obscured visual sequence.</p>
            </div>
            <div className="distorted-captcha-box">
              <span className="distort-char char-1">7</span>
              <span className="distort-char char-2">K</span>
              <span className="distort-noise">~~~</span>
              <span className="distort-char char-3">9</span>
              <span className="distort-char char-4">M</span>
            </div>
            <div className="distorted-input-row">
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Type characters here..."
                className="cursed-input distorted-text-input"
                autoFocus
              />
            </div>
          </div>
        );

      // 7: Approximately 37% of a bicycle
      case 7:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>SELECT THE TILES WITH <u>APPROXIMATELY 37% OF A BICYCLE</u></h4>
              <p>Fractional component segmentation analysis.</p>
            </div>
            <div className="captcha-tiles-grid-6">
              {[
                { id: 1, label: 'Empty Blue Sky (0%)', emoji: '☁️' },
                { id: 2, label: 'Handlebars & Fork (~37%)', emoji: '🚲' },
                { id: 3, label: 'Asphalt Pavement (0%)', emoji: '🛣️' },
                { id: 4, label: 'Down Tube & Pedals (~37%)', emoji: '⚙️' },
                { id: 5, label: 'Warehouse Wall (0%)', emoji: '🧱' },
                { id: 6, label: 'Rear Wheel & Cassette (~37%)', emoji: '🔘' },
              ].map(tile => (
                <div
                  key={tile.id}
                  className={`captcha-tile-item ${selectedIds.includes(tile.id) ? 'tile-active' : ''}`}
                  onClick={() => toggleTile(tile.id)}
                >
                  <span className="tile-check">{selectedIds.includes(tile.id) ? '☑' : '☐'}</span>
                  <div className="tile-emoji">{tile.emoji}</div>
                  <span className="tile-label">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 8: Employable objects
      case 8:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>SELECT ALL SQUARES CONTAINING <u>OBJECTIVELY EMPLOYABLE ARTIFACTS</u></h4>
              <p>Proof of corporate readiness and synergy preparedness.</p>
            </div>
            <div className="captcha-tiles-grid-6">
              {[
                { id: 1, label: 'Silk Business Necktie', emoji: '👔' },
                { id: 2, label: '3:00 PM Slumber Pillow', emoji: '🛌' },
                { id: 3, label: 'Upward Trending Bar Chart', emoji: '📊' },
                { id: 4, label: 'RGB Gaming Controller', emoji: '🎮' },
                { id: 5, label: 'Manila Folder with Q3 Goals', emoji: '📁' },
                { id: 6, label: 'Beach Vacation Umbrella', emoji: '🏖️' },
              ].map(tile => (
                <div
                  key={tile.id}
                  className={`captcha-tile-item ${selectedIds.includes(tile.id) ? 'tile-active' : ''}`}
                  onClick={() => toggleTile(tile.id)}
                >
                  <span className="tile-check">{selectedIds.includes(tile.id) ? '☑' : '☐'}</span>
                  <div className="tile-emoji">{tile.emoji}</div>
                  <span className="tile-label">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 9: Professional Rectangle
      case 9:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>SELECT THE <u>MOST PROFESSIONAL RECTANGLE</u></h4>
              <p>Strict prohibition: Squares (1:1 aspect ratio) are unacceptable.</p>
            </div>
            <div className="captcha-rectangles-stack">
              {[
                { id: 'square-1-1', label: '1:1 Square (Unacceptable)', style: { width: '80px', height: '80px' } },
                { id: 'rect-16-9', label: '16:9 Standard Enterprise Aspect (Recommended)', style: { width: '160px', height: '90px' } },
                { id: 'trapezoid', label: 'Parallelogram with excessive confidence', style: { width: '130px', height: '60px', transform: 'skewX(-15deg)' } },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  className={`rect-choice-btn ${singleChoice === item.id ? 'rect-choice-active' : ''}`}
                  onClick={() => handleSingleSelect(item.id)}
                >
                  <div className="rect-preview-box" style={item.style} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // 10: Coffee vs Non-Coffee
      case 10:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>SELECT ALL CONTAINERS OF <u>HOT BLACK CORPORATE COFFEE</u></h4>
              <p>Biological fuel identification.</p>
            </div>
            <div className="captcha-tiles-grid-6">
              {[
                { id: 1, label: 'Steaming Ceramic Coffee Mug', emoji: '☕' },
                { id: 2, label: 'Cardboard Juice Box', emoji: '🧃' },
                { id: 3, label: 'Double Shot Espresso Cup', emoji: '🍵' },
                { id: 4, label: 'Infant Feeding Bottle', emoji: '🍼' },
                { id: 5, label: 'Takeaway Paper Coffee Cup', emoji: '☕' },
                { id: 6, label: 'Tropical Cocktail Glass', emoji: '🍸' },
              ].map(tile => (
                <div
                  key={tile.id}
                  className={`captcha-tile-item ${selectedIds.includes(tile.id) ? 'tile-active' : ''}`}
                  onClick={() => toggleTile(tile.id)}
                >
                  <span className="tile-check">{selectedIds.includes(tile.id) ? '☑' : '☐'}</span>
                  <div className="tile-emoji">{tile.emoji}</div>
                  <span className="tile-label">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 11: Freight commercial vehicle
      case 11:
        return (
          <div className="real-captcha-body">
            <div className="challenge-prompt-callout">
              <h4>CLICK THE <u>COMMERCIAL FREIGHT VEHICLE</u></h4>
              <p>Classify legitimate logistics hardware.</p>
            </div>
            <div className="captcha-mcq-grid-4">
              {[
                { id: 'scooter', label: 'Toy Kick Scooter', emoji: '🛴' },
                { id: 'truck', label: '18-Wheeler Freight Semi-Truck', emoji: '🚚' },
                { id: 'skate', label: 'Vintage Roller Skate', emoji: '🛼' },
                { id: 'chair', label: 'Office Swivel Chair', emoji: '🪑' },
              ].map(item => (
                <div
                  key={item.id}
                  className={`captcha-choice-card ${singleChoice === item.id ? 'choice-card-picked' : ''}`}
                  onClick={() => handleSingleSelect(item.id)}
                >
                  <div className="tile-emoji">{item.emoji}</div>
                  <span className="tile-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleVerify} className="real-captcha-form">
      {/* Step Header */}
      <div className="captcha-step-indicator-bar">
        <div className="step-tag font-pixel">
          VERIFICATION PROGRESS: {stepNumber} / {totalSteps}
        </div>
        <div className="step-vibe-msg">
          Human confidence: {Math.max(12, Math.min(88, Math.round((stepNumber / totalSteps) * 80)))}%
        </div>
      </div>

      {/* Progress Track Bar */}
      <div className="captcha-progress-track">
        <div
          className="captcha-progress-fill"
          style={{ width: `${((stepNumber - 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* The Single Active Mini-Challenge */}
      {renderCurrentChallengeContent()}

      {/* Action Row */}
      <div className="captcha-verify-action-row">
        <button type="submit" className="captcha-main-verify-btn">
          <CheckCircle2 size={18} />
          <span>VERIFY</span>
        </button>
      </div>
    </form>
  );
};
