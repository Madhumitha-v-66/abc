import React from 'react';
import { sounds } from '../../utils/sound';
import { useAuth } from '../../context/AuthContext';
import { usePopup } from '../../context/PopupContext';
import { Flame, Skull, RotateCcw, X } from 'lucide-react';

interface RageQuitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RageQuitModal: React.FC<RageQuitModalProps> = ({ isOpen, onClose }) => {
  const { suspicionScore } = useAuth();
  const { triggerPopup } = usePopup();

  if (!isOpen) return null;

  const handleDefinitiveQuit = () => {
    sounds.playBuzzer();
    triggerPopup({
      title: 'YOU CANNOT SIMPLY QUIT',
      subtitle: 'ONE DOES NOT MERELY WALK AWAY FROM SUPERGLUEDIN',
      body: 'To complete your rage quit, please submit a 3-page handwritten essay on why the Atbash keyboard caused you distress.',
      type: 'existential',
      closeType: 'double-negative',
    });
    onClose();
  };

  return (
    <div className="rage-quit-overlay">
      <div className="rage-quit-card">
        <div className="rage-quit-header">
          <Flame size={32} color="#ff0033" className="flame-pulse" />
          <h2>🔥 RAGE QUIT REGISTERED! 🔥</h2>
          <button className="rage-close-x" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="rage-quit-body">
          <div className="skull-big">💀🤡💥</div>
          <h3>YOU COULD NOT HANDLE SUPERGLUEDIN™!</h3>
          <p>
            Congratulations! You have reached Stage 10 of the emotional progression:
            <b> ABSOLUTE UNADULTERATED RAGE QUIT.</b>
          </p>

          <div className="rage-stats-table">
            <div className="rage-stat-cell">
              <span className="stat-label">Keyboard Reversals Endured:</span>
              <span className="stat-value text-neon-green">∞</span>
            </div>
            <div className="rage-stat-cell">
              <span className="stat-label">Ambiguous Vehicles Questioned:</span>
              <span className="stat-value text-yellow">10 Items</span>
            </div>
            <div className="rage-stat-cell">
              <span className="stat-label">Computer Sadness Level:</span>
              <span className="stat-value text-neon-pink">73% Sad</span>
            </div>
            <div className="rage-stat-cell">
              <span className="stat-label">Final Paranoia Index:</span>
              <span className="stat-value text-cyan">{suspicionScore}%</span>
            </div>
          </div>

          <p className="rage-quote">
            “The website didn’t fail you. You failed the website’s rigorous ergonomic improvements.”
          </p>

          <div className="rage-btn-row">
            <button
              className="rage-resume-btn"
              onClick={() => {
                sounds.playDing();
                onClose();
              }}
            >
              <RotateCcw size={16} /> RETURN TO SUFFERING
            </button>

            <button
              className="rage-exit-btn"
              onClick={handleDefinitiveQuit}
            >
              <Skull size={16} /> ATTEMPT TO EXIT FOREVER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
