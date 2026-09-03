import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/sound';
import { usePopup } from '../../context/PopupContext';

export const TopBannerAd: React.FC = () => {
  const [closed, setClosed] = useState(false);
  const [visitorCount, setVisitorCount] = useState(3);
  const { triggerPopup } = usePopup();

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuates between 2 and 4 viewers
      setVisitorCount(2 + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = () => {
    sounds.playDing();
    triggerPopup({
      title: 'PRIZE CLAIM CONFIRMATION REQUIRED!',
      subtitle: 'YOU ARE THE 1,000,000TH VISITOR',
      body: 'To claim your ₹4,72,819 prize, please deposit ₹15,000 in non-refundable processing fees to our untraceable account.',
      type: 'scam',
      closeType: 'double-negative',
    });
  };

  const handleClose = () => {
    sounds.playBoing();
    // 60% chance to immediately pop up "WAIT DON'T LEAVE"
    triggerPopup({
      title: 'WAIT! DID YOU ACCIDENTALLY CLOSE THE REWARD?',
      subtitle: '₹4,72,819 IS NOW IN JEOPARDY',
      body: 'You rejected ₹4,72,819. Are you sure you are this financially irresponsible?',
      type: 'confirm',
      closeType: 'moving-btn',
    });
    setClosed(true);
  };

  if (closed) return null;

  return (
    <div className="top-banner-scam">
      <div className="top-banner-marquee">
        <span className="scam-alert-badge">🔥 URGENT SCAM ALERT 🔥</span>
        <span className="scam-text">
          CONGRATULATIONS!!! YOU WON ₹4,72,819!!! 💰 CLAIM NOW! ⚠️ ONLY {visitorCount} PEOPLE ARE LOOKING AT THIS RIGHT NOW! ⏳ EXPIRING IN 00:03 SECONDS!
        </span>
      </div>
      <div className="top-banner-actions">
        <button className="top-banner-claim-btn" onClick={handleClaim}>
          CLAIM PRIZE NOW!
        </button>
        <button
          className="top-banner-close-btn"
          onClick={handleClose}
          title="Close (Why would you close this?)"
        >
          ✖
        </button>
      </div>
    </div>
  );
};
