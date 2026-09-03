import React, { useState, useEffect } from 'react';
import { ShieldAlert, Eye } from 'lucide-react';

interface SuspicionMeterProps {
  failedAttempts: number;
}

export const SuspicionMeter: React.FC<SuspicionMeterProps> = ({ failedAttempts }) => {
  const [mouseActivity, setMouseActivity] = useState(0);
  const [sessionSecs, setSessionSecs] = useState(0);

  useEffect(() => {
    const handleMove = () => {
      setMouseActivity(prev => (prev + 1) % 100);
    };
    window.addEventListener('mousemove', handleMove);
    const timer = setInterval(() => setSessionSecs(prev => prev + 1), 1000);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(timer);
    };
  }, []);

  // Compute calculated absurdity
  const humanProbability = Math.max(7, Math.min(94, 78 - failedAttempts * 11 - (sessionSecs % 15)));
  
  const getTrustLevel = () => {
    if (failedAttempts === 0) return 'Highly Speculative';
    if (failedAttempts <= 2) return 'Questionable at Best';
    if (failedAttempts <= 4) return 'Mildly Criminal';
    return 'Categorically Synthetic / Alien';
  };

  const getSuspicionWarning = () => {
    if (sessionSecs > 30) return `YOUR SESSION HAS BEEN ACTIVE FOR ${sessionSecs}s. EXCESSIVE DELIBERATION DETECTED.`;
    if (failedAttempts > 2) return 'TOO MUCH CONFIDENCE DETECTED.';
    if (mouseActivity > 40) return 'MOUSE MOVEMENT ANALYSIS: IRREGULAR TRAJECTORIES.';
    return 'BIOMETRIC STABILITY: MARGINAL.';
  };

  return (
    <div className="suspicion-meter-card">
      <div className="meter-top-row">
        <div className="meter-label-wrap">
          <ShieldAlert size={16} className="meter-icon-pulse" />
          <span className="meter-title">CORPORATE SECURITY SURVEILLANCE</span>
        </div>
        <span className="meter-status-flag">
          <Eye size={12} /> LIVE AUDIT
        </span>
      </div>

      <div className="meter-stats-grid">
        <div className="meter-stat-box">
          <span className="stat-name">Human Probability:</span>
          <span className="stat-val font-pixel text-neon-green">{humanProbability}%</span>
        </div>

        <div className="meter-stat-box">
          <span className="stat-name">Corporate Trust:</span>
          <span className="stat-val text-yellow">{getTrustLevel()}</span>
        </div>

        <div className="meter-stat-box">
          <span className="stat-name">Failed Attempts:</span>
          <span className="stat-val text-neon-pink font-pixel">{failedAttempts}</span>
        </div>

        <div className="meter-stat-box">
          <span className="stat-name">Entropy Noise:</span>
          <span className="stat-val text-cyan">{mouseActivity}Hz</span>
        </div>
      </div>

      <div className="meter-warning-banner">
        ⚠️ <b>NOTICE:</b> {getSuspicionWarning()}
      </div>
    </div>
  );
};
