import React, { useState } from 'react';
import { sounds } from '../../utils/sound';
import { usePopup } from '../../context/PopupContext';

export const FloatingScamAd: React.FC = () => {
  const [minimized, setMinimized] = useState(false);
  const [hideLeftBanner, setHideLeftBanner] = useState(false);
  const { triggerPopup } = usePopup();

  const handleFixComputer = () => {
    sounds.playDing();
    triggerPopup({
      title: 'SCANNING EMOTIONAL INTEGRITY OF HARD DRIVE...',
      subtitle: 'RESULTS: CRITICAL MELANCHOLY',
      body: 'Your CPU cooler is crying. Click here to download 64GB of digital hugs.',
      type: 'scam',
      closeType: 'tiny-x',
    });
  };

  const handleDismissSad = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playBoing();
    setMinimized(true);
    // Spawns confirmation
    triggerPopup({
      title: 'YOUR COMPUTER IS STILL SAD',
      subtitle: 'DID YOU NOT CARE ABOUT ITS FEELINGS?',
      body: 'Dismissing this box does not heal the silicon sorrow.',
      type: 'existential',
      closeType: 'double-negative',
    });
  };

  return (
    <>
      {/* Left side vertical scam banner */}
      {!hideLeftBanner && (
        <div className="side-gutter-ad left-ad">
          <div className="gutter-close" onClick={() => { sounds.playBoing(); setHideLeftBanner(true); }}>
            x
          </div>
          <div className="gutter-title">SPONSORED</div>
          <div className="gutter-content">
            ⚡ <b>DOWNLOAD</b><br/>
            MORE RAM 4 FREE<br/>
            <span style={{ fontSize: '9px', color: '#ff00ff' }}>*100% VIRUS INCLUDED</span>
          </div>
          <button
            className="gutter-action-btn"
            onClick={() => {
              sounds.playDing();
              triggerPopup({
                title: 'RAM DOWNLOAD IN PROGRESS (0.01%)',
                subtitle: 'PLEASE WAIT 47 WEEKS',
                body: 'Installing high-speed volatile memory directly into your microwave oven.',
                type: 'scam',
                closeType: 'tiny-x'
              });
            }}
          >
            INSTALL NOW
          </button>
        </div>
      )}

      {/* Floating bottom widget */}
      {!minimized ? (
        <div className="floating-bottom-scam">
          <div className="floating-scam-header">
            <span className="scam-head-title">⚠️ SYSTEM HEALTH EMERGENCY</span>
            <button className="floating-close-tiny" onClick={handleDismissSad} title="Dismiss">
              ×
            </button>
          </div>
          <div className="floating-scam-body">
            <div className="sad-computer-icon">💻😭</div>
            <div className="sad-text-box">
              <p className="sad-title">YOUR COMPUTER IS 73% SAD.</p>
              <p className="sad-desc">38 browser tabs are feeling lonely and abandoned.</p>
            </div>
          </div>
          <div className="floating-scam-buttons">
            <button className="sad-btn-primary" onClick={handleFixComputer}>
              CHEER UP PC (FREE)
            </button>
            <button className="sad-btn-secondary" onClick={handleDismissSad}>
              IGNORE & SUFFER
            </button>
          </div>
        </div>
      ) : (
        <div className="floating-minimized-tab" onClick={() => setMinimized(false)}>
          ⚠️ COMPUTER SADNESS TAB (CLICK TO RESCUE)
        </div>
      )}
    </>
  );
};
