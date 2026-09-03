import React, { useState } from 'react';
import { usePopup, ActivePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';

export const PopupHell: React.FC = () => {
  const { popups, closePopup, triggerPopup } = usePopup();

  if (popups.length === 0) return null;

  return (
    <div className="popup-hell-backdrop">
      {popups.map((popup, index) => (
        <SinglePopupItem
          key={popup.id}
          popup={popup}
          index={index}
          total={popups.length}
          onClose={() => closePopup(popup.id)}
          onSpawnMore={() => triggerPopup()}
        />
      ))}
    </div>
  );
};

interface SinglePopupProps {
  popup: ActivePopup;
  index: number;
  total: number;
  onClose: () => void;
  onSpawnMore: () => void;
}

const SinglePopupItem: React.FC<SinglePopupProps> = ({
  popup,
  index,
  total,
  onClose,
  onSpawnMore,
}) => {
  const [escapePos, setEscapePos] = useState({ x: 0, y: 0 });
  const [btnDodgeCount, setBtnDodgeCount] = useState(0);

  // Evasive state for [x] close button
  const [xDodgeCount, setXDodgeCount] = useState(0);
  const [xOffset, setXOffset] = useState({ x: 0, y: 0, rot: 0, scale: 1 });

  // Stagger positions of overlapping popups
  const offsetStyle = {
    marginTop: `${index * 25 - (total * 12)}px`,
    marginLeft: `${index * 30 - (total * 15)}px`,
    zIndex: 1000 + index * 10,
  };

  const handleEvadeHover = () => {
    if (popup.closeType === 'moving-btn') {
      if (btnDodgeCount < 4) {
        sounds.playBoing();
        setBtnDodgeCount(prev => prev + 1);
        setEscapePos({
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 45,
        });
      } else {
        // Settles down after 4 attempts!
        setEscapePos({ x: 0, y: 0 });
      }
    }
  };

  // Evasive [X] button hover
  const handleXHover = () => {
    if (xDodgeCount < 3) {
      sounds.playBoing();
      setXDodgeCount(prev => prev + 1);
      setXOffset({
        x: (Math.random() - 0.5) * 36,
        y: (Math.random() - 0.5) * 26,
        rot: (Math.random() - 0.5) * 30,
        scale: 0.85 + Math.random() * 0.25,
      });
    } else {
      // Settles down!
      setXOffset({ x: 0, y: 0, rot: 0, scale: 1 });
    }
  };

  const handleDeceptivePrimary = () => {
    sounds.playDing();
    alert('SUCCESS: You have agreed to receive 34 daily SMS updates regarding corporate synergies!');
    onClose();
  };

  const renderCloseButton = () => {
    switch (popup.closeType) {
      case 'tiny-x':
        return (
          <button
            className="popup-close-tiny-x"
            style={{
              transform: `translate(${xOffset.x}px, ${xOffset.y}px) rotate(${xOffset.rot}deg) scale(${xOffset.scale})`,
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={handleXHover}
            onClick={onClose}
            title="Close"
          >
            x
          </button>
        );

      case 'moving-btn':
        return (
          <div className="popup-moving-btn-container">
            <button
              className="popup-btn-evasive"
              style={{
                transform: `translate(${escapePos.x}px, ${escapePos.y}px)`,
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={handleEvadeHover}
              onClick={onClose}
            >
              CLOSE THIS POPUP
            </button>
          </div>
        );

      case 'double-negative':
        return (
          <div className="popup-double-negative-actions">
            <button className="popup-btn-opt1" onClick={onSpawnMore}>
              DO NOT DECLINE THIS OFFER
            </button>
            <button className="popup-btn-opt2" onClick={onClose}>
              CANCEL CANCELLATION OF CLOSING
            </button>
          </div>
        );

      case 'hidden-text':
        return (
          <div className="popup-hidden-text-container">
            <button className="popup-btn-loud" onClick={handleDeceptivePrimary}>
              CLAIM EVERYTHING NOW
            </button>
            <span className="popup-faint-close" onClick={onClose}>
              no thanks, i actively despise savings, joy, and convenience
            </span>
          </div>
        );

      default:
        return (
          <button className="popup-close-default" onClick={onClose}>
            Close
          </button>
        );
    }
  };

  return (
    <div className={`rage-popup-card popup-variant-${popup.type}`} style={offsetStyle}>
      <div className="rage-popup-banner-top">
        <span className="popup-pill-tag">🔥 CRITICAL ALERT #{index + 1} OF {total}</span>
        {popup.closeType === 'tiny-x' && renderCloseButton()}
      </div>

      <div className="rage-popup-content">
        <h2 className="rage-popup-title">{popup.title}</h2>
        <h4 className="rage-popup-subtitle">{popup.subtitle}</h4>
        <p className="rage-popup-body">{popup.body}</p>

        {popup.closeType !== 'tiny-x' && (
          <div className="rage-popup-custom-actions">
            {renderCloseButton()}
          </div>
        )}

        <div className="rage-popup-footer">
          <small className="rage-popup-disclaimer">
            *Certified 100% genuine ragebait. By reading this sentence, your soul has been licensed to SUPERGLUEDIN.
          </small>
        </div>
      </div>
    </div>
  );
};
