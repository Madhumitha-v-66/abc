import React, { useState } from 'react';
import { Connection } from '../../types';
import { useCaptcha } from '../../context/CaptchaContext';
import { usePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';
import { UserPlus, Clock } from 'lucide-react';

const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn-1',
    name: 'Elon Tusk',
    headline: 'Chief Meme Engineer @ X-Treme Synergies | Buying Twitter again for fun',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    mutualConnections: -3,
    status: 'none',
  },
  {
    id: 'conn-2',
    name: 'Karen from Compliance',
    headline: 'VP of Mandatory Checkbox Approvals | Asking if you read line 842',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    mutualConnections: 14,
    status: 'none',
  },
  {
    id: 'conn-3',
    name: 'Dr. Atbash Invertor',
    headline: 'Founder @ Z-to-A Systems | Solving problems backwards',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    mutualConnections: 0,
    status: 'emotionally_pending',
  },
  {
    id: 'conn-4',
    name: 'Captcha Bot 9000',
    headline: 'Certified Real Living Biological Human with 2 Eyes and 1 Mouth',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=humanbot',
    mutualConnections: 9999,
    status: 'none',
  },
  {
    id: 'conn-5',
    name: 'Chad Synergy-Maxx',
    headline: 'Disrupting breakfast via unoptimized WebSockets',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    mutualConnections: 1,
    status: 'none',
  },
  {
    id: 'conn-6',
    name: 'Sad Computer #404',
    headline: 'Hardware Entity | 73% Sad | In need of emotional defragmentation',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sadpc',
    mutualConnections: 0,
    status: 'none',
  }
];

export const NetworkView: React.FC = () => {
  const { requireCaptcha } = useCaptcha();
  const { showToast } = usePopup();
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);

  const handleConnect = (conn: Connection) => {
    sounds.playDing();
    requireCaptcha(`Send Connection Request to ${conn.name}`, () => {
      setConnections(prev =>
        prev.map(c =>
          c.id === conn.id
            ? { ...c, status: Math.random() > 0.5 ? 'emotionally_pending' : 'pending' }
            : c
        )
      );
      showToast(`🤝 Connection request sent! Status: Emotionally Pending.`, 'info');
    });
  };

  const handleWithdraw = (conn: Connection) => {
    sounds.playBoing();
    requireCaptcha(`Withdraw Invitation to ${conn.name}`, () => {
      setConnections(prev =>
        prev.map(c => (c.id === conn.id ? { ...c, status: 'none' } : c))
      );
      showToast('Invitation withdrawn. Disappointment logged.', 'warning');
    });
  };

  return (
    <div className="network-view-container">
      <div className="network-header-box">
        <h2 className="network-title">MY NETWORK (OR LACK THEREOF)</h2>
        <p className="network-subtitle">
          “Connect with strangers who will endorse your non-existent skills in exchange for validation.”
        </p>
        <div className="network-stat-banner">
          <span>PENDING INVITATIONS: <b>412 UNNOTICED</b></span>
          <span>•</span>
          <span>MUTUAL DESPAIR: <b>HIGH</b></span>
        </div>
      </div>

      <div className="network-grid">
        {connections.map(conn => (
          <div key={conn.id} className="connection-card">
            <div className="conn-bg-pattern" />
            <img
              src={conn.avatar}
              alt={conn.name}
              className="conn-avatar-img"
            />
            <div className="conn-info">
              <h3 className="conn-name">{conn.name}</h3>
              <p className="conn-headline">{conn.headline}</p>
              <div className="conn-mutual-tag">
                {conn.mutualConnections < 0
                  ? `⚠️ ${conn.mutualConnections} mutual connections (Negative synergy)`
                  : `👥 ${conn.mutualConnections} mutual contacts`}
              </div>
            </div>

            <div className="conn-actions-footer">
              {conn.status === 'none' && (
                <button
                  className="conn-connect-btn"
                  onClick={() => handleConnect(conn)}
                >
                  <UserPlus size={16} />
                  <span>CONNECT</span>
                </button>
              )}

              {conn.status === 'pending' && (
                <button
                  className="conn-pending-btn"
                  onClick={() => handleWithdraw(conn)}
                >
                  <Clock size={16} />
                  <span>PENDING (WITHDRAW?)</span>
                </button>
              )}

              {conn.status === 'emotionally_pending' && (
                <div className="conn-status-pill emotional-pill">
                  💔 EMOTIONALLY PENDING
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
