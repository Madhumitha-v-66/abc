import React, { useState, useRef } from 'react';
import { sounds } from '../../utils/sound';
import { usePopup } from '../../context/PopupContext';

interface EvasiveLoginButtonProps {
  onRealSubmit: () => void;
  disabled?: boolean;
}

const MISLEADING_LABELS = [
  'LOGIN',
  'PROCEED',
  'SUBMIT',
  'VERIFY',
  'CONTINUE',
  'NOPE',
];

export const EvasiveLoginButton: React.FC<EvasiveLoginButtonProps> = ({
  onRealSubmit,
  disabled,
}) => {
  const { triggerPopup } = usePopup();
  const [dodgeCount, setDodgeCount] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isShrunk, setIsShrunk] = useState(false);
  const [labelIndex, setLabelIndex] = useState(0);
  const lastDodgeTimeRef = useRef<number>(0);

  // Decoy popups
  const handleDecoyClick = (type: string) => {
    sounds.playBoing();
    switch (type) {
      case 'definitely':
        triggerPopup({
          title: 'DECOY TRAP ACTIVATED!',
          subtitle: 'ERROR: DEFINITELY NOT THE REAL BUTTON',
          body: 'You clicked "Definitely Login", which in corporate terminology means "Definitely Do Not Login".',
          type: 'scam',
          closeType: 'tiny-x',
        });
        break;
      case 'not_login':
        triggerPopup({
          title: 'CONGRATULATIONS ON ACCURATE SELECTION',
          subtitle: 'YOU CLICKED "NOT LOGIN"',
          body: 'As promised, nothing happened because you selected the button that does not log in.',
          type: 'existential',
          closeType: 'double-negative',
        });
        break;
      case 'maybe':
        triggerPopup({
          title: 'MAYBE LATER CONFIRMATION',
          subtitle: 'STATUS: INDECISIVE',
          body: 'Your ambivalence has been registered in our emotional tracking ledger.',
          type: 'confirm',
          closeType: 'moving-btn',
        });
        break;
      case 'submit_something':
        alert('ALERT: Something was submitted into the void. It was not your login credentials.');
        break;
      case 'forgot':
        triggerPopup({
          title: 'MEMORY PURGE CONFIRMED',
          subtitle: 'AMNESIA PROTOCOL INITIATED',
          body: 'We have forgotten who you are, but you still need to enter your backwards password.',
          type: 'scam',
          closeType: 'tiny-x',
        });
        break;
    }
  };

  // Evasive hover: jumps horizontally/vertically, rotates, shrinks, cycles label
  const handleProximityOrHover = () => {
    const now = Date.now();
    // 160ms cooldown between movements to prevent teleportation lock
    if (now - lastDodgeTimeRef.current < 160) return;
    lastDodgeTimeRef.current = now;

    // After 5 dodges, ease up evasiveness so the user can catch and click it!
    if (dodgeCount < 5) {
      sounds.playBoing();
      setDodgeCount(prev => prev + 1);
      setLabelIndex(prev => (prev + 1) % MISLEADING_LABELS.length);
      setIsShrunk(Math.random() > 0.4);

      // Random horizontal/vertical jump up to 70px
      const jumpX = (Math.random() > 0.5 ? 1 : -1) * (25 + Math.random() * 55);
      const jumpY = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 45);
      const newRot = (Math.random() - 0.5) * 20; // -10deg to +10deg

      setOffset({ x: jumpX, y: jumpY });
      setRotation(newRot);
    } else {
      // Cooldown reached: allow click!
      setOffset({ x: 0, y: 0 });
      setRotation(0);
      setIsShrunk(false);
    }
  };

  const handleRealClick = () => {
    sounds.playDing();
    setDodgeCount(0);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
    setIsShrunk(false);
    onRealSubmit();
  };

  return (
    <div className="evasive-cluster-box" onMouseMove={handleProximityOrHover}>
      <div className="cluster-header-note">
        *AUTHENTICATION SUBMISSION INTERFACE (NO DIRECT PROMISES OF BUTTON COOPERATION):
      </div>

      <div className="button-cluster-grid">
        {/* Decoy 1 */}
        <button
          type="button"
          className="cluster-btn decoy-btn"
          onClick={() => handleDecoyClick('definitely')}
        >
          Definitely Login
        </button>

        {/* Real Evasive Button */}
        <button
          type="button"
          disabled={disabled}
          className={`cluster-btn real-login-btn ${isShrunk ? 'btn-shrunk' : ''}`}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) ${isShrunk ? 'scale(0.85)' : 'scale(1)'}`,
            transition: 'transform 0.12s ease-out',
          }}
          onMouseEnter={handleProximityOrHover}
          onClick={handleRealClick}
        >
          🔒 {MISLEADING_LABELS[labelIndex]}
        </button>

        {/* Decoy 2 */}
        <button
          type="button"
          className="cluster-btn decoy-btn"
          onClick={() => handleDecoyClick('not_login')}
        >
          Not Login
        </button>

        {/* Decoy 3 */}
        <button
          type="button"
          className="cluster-btn decoy-btn"
          onClick={() => handleDecoyClick('maybe')}
        >
          Maybe Continue
        </button>

        {/* Decoy 4 */}
        <button
          type="button"
          className="cluster-btn decoy-btn"
          onClick={() => handleDecoyClick('submit_something')}
        >
          Submit Something
        </button>

        {/* Decoy 5 */}
        <button
          type="button"
          className="cluster-btn decoy-btn"
          onClick={() => handleDecoyClick('forgot')}
        >
          I Forgot Everything
        </button>
      </div>

      {dodgeCount > 0 && dodgeCount < 5 && (
        <small className="dodge-hint-text">
          ⚠️ Evasive reaction #{dodgeCount} of 5. Button repositioning in progress.
        </small>
      )}
      {dodgeCount >= 5 && (
        <small className="dodge-hint-text text-neon-green font-bold">
          ✓ Button exhausted. Click now before it recovers!
        </small>
      )}
    </div>
  );
};
