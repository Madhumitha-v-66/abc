import React, { useState } from 'react';
import { sounds } from '../../utils/sound';

interface ImageCard {
  id: number;
  emoji: string;
  name: string;
  subtext: string;
}

const CARDS: ImageCard[] = [
  { id: 1, emoji: '🏎️', name: 'Plastic Hot Wheels Car', subtext: 'Scale 1:64. Has wheels, but carries 0 humans.' },
  { id: 2, emoji: '🛒', name: 'Wobbly Shopping Cart', subtext: 'Transports canned beans. 1 wheel spins backwards.' },
  { id: 3, emoji: '🛼', name: 'Single Vintage Roller Skate', subtext: 'Only left foot. Can you ride with one skate?' },
  { id: 4, emoji: '🥖', name: 'Baguette with Bottle Caps', subtext: 'Wheels are attached, but it is baked grain.' },
  { id: 5, emoji: '🐴', name: 'Horse with Sunglasses', subtext: 'Biological locomotion device. 1 horsepower.' },
  { id: 6, emoji: '🚲', name: 'Bicycle Inside a Dumpster', subtext: 'Has handlebars and pedals, but is in garbage.' },
  { id: 7, emoji: '🪑', name: 'Office Chair with Casters', subtext: 'Moves across carpet when pushed by human feet.' },
  { id: 8, emoji: '🛹', name: 'Skateboard with Frozen Burrito', subtext: 'Burrito is cargo. Skateboard rolls downhill.' },
  { id: 9, emoji: '🧳', name: 'Suitcase with 4 Spinner Wheels', subtext: 'Designed for airport terminal racing.' },
  { id: 10, emoji: '🛸', name: 'Unidentified Glowing Saucer', subtext: 'Propulsion physics violate general relativity.' },
];

interface ImageCaptchaProps {
  onSuccess: () => void;
  onFail: (message: string) => void;
  failureMessage: string | null;
}

export const ImageCaptcha: React.FC<ImageCaptchaProps> = ({
  onSuccess,
  onFail,
  failureMessage,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [areYouSureStep, setAreYouSureStep] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const toggleSelect = (id: number) => {
    sounds.playKeypress();
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleVerifyClick = () => {
    sounds.playDing();
    if (selected.length === 0) {
      onFail('YOU MUST SELECT AT LEAST ONE POTENTIAL VEHICLE OR PSEUDO-LOCOMOTION ENTITY.');
      return;
    }

    if (!areYouSureStep) {
      setAreYouSureStep(true);
      return;
    }

    // Process submission
    if (attemptCount === 0) {
      setAttemptCount(prev => prev + 1);
      setAreYouSureStep(false);
      onFail(
        'ONE OR MORE SELECTIONS MAY BE INCORRECT. WE ARE NOT SAYING YOU ARE A ROBOT, BUT YOUR CONCEPT OF "VEHICLE" HAS RAISED SERIOUS QUESTIONS.'
      );
      // Deselect one item randomly to annoy the user
      setSelected(prev => prev.slice(0, Math.max(1, prev.length - 1)));
      return;
    }

    // Passed on second attempt
    onSuccess();
  };

  return (
    <div className="image-captcha-container">
      <div className="captcha-instructions-banner">
        <h3 className="captcha-prompt-title">
          SELECT ALL IMAGES THAT CONTAIN SOMETHING THAT COULD POSSIBLY BE CONSIDERED A VEHICLE:
        </h3>
        <p className="captcha-prompt-note">
          (Note: Definitions of "vehicle" vary across philosophical traditions. Choose wisely.)
        </p>
      </div>

      {failureMessage && (
        <div className="captcha-error-callout">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{failureMessage}</span>
        </div>
      )}

      {areYouSureStep && (
        <div className="are-you-sure-overlay">
          <div className="are-you-sure-box">
            <h4>🤔 ARE YOU 100% SURE?</h4>
            <p>
              You selected {selected.length} items. 89% of candidates who choose these exact objects fail
              the humanity alignment test.
            </p>
            <div className="are-you-sure-btns">
              <button
                className="captcha-confirm-yes"
                onClick={handleVerifyClick}
              >
                YES, I CONFIRM MY WEIRD CHOICES
              </button>
              <button
                className="captcha-confirm-no"
                onClick={() => setAreYouSureStep(false)}
              >
                LET ME SECOND-GUESS MY EXISTENCE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10 Image Grid */}
      <div className="captcha-grid-10">
        {CARDS.map(card => {
          const isSelected = selected.includes(card.id);
          return (
            <div
              key={card.id}
              className={`captcha-card ${isSelected ? 'card-selected' : ''}`}
              onClick={() => toggleSelect(card.id)}
            >
              <div className="card-checkbox-corner">
                {isSelected ? '☑' : '☐'}
              </div>
              <div className="card-emoji-visual">{card.emoji}</div>
              <div className="card-info">
                <span className="card-name">{card.name}</span>
                <span className="card-subtext">{card.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="captcha-footer-row">
        <button
          className="captcha-reload-btn"
          onClick={() => {
            sounds.playBoing();
            setSelected([]);
            onFail('RELOADED WITH FRESH PHILOSOPHICAL UNCERTAINTY.');
          }}
        >
          🔄 GET NEW AMBIGUOUS OBJECTS
        </button>

        <button
          className="captcha-verify-btn"
          onClick={handleVerifyClick}
        >
          {areYouSureStep ? 'PROCEED ANYWAY' : 'VERIFY HUMANITY (10 IMAGES)'}
        </button>
      </div>
    </div>
  );
};
