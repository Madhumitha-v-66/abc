import React, { useState } from 'react';
import { NotificationItem } from '../../types';
import { useCaptcha } from '../../context/CaptchaContext';
import { sounds } from '../../utils/sound';
import { Bell, Check, Trash2 } from 'lucide-react';

const INITIAL_NOTICES: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Someone viewed your profile.',
    description: 'We won’t tell you who it was, but it might have been an autonomous web scraper from Russia.',
    timeAgo: '1m ago',
    read: false,
    type: 'urgent',
  },
  {
    id: 'n2',
    title: 'Your profile view has expired.',
    description: 'The person who looked at your profile has forgotten your name and closed their browser.',
    timeAgo: '14m ago',
    read: false,
    type: 'alarming',
  },
  {
    id: 'n3',
    title: 'Nothing happened.',
    description: 'We just wanted to generate a push notification so our engagement metrics appear active to investors.',
    timeAgo: '1h ago',
    read: true,
    type: 'useless',
  },
  {
    id: 'n4',
    title: 'Your connection request is emotionally pending.',
    description: 'Karen from Compliance saw your invitation, sighed loudly, and went to make instant coffee.',
    timeAgo: '3h ago',
    read: false,
    type: 'alarming',
  },
  {
    id: 'n5',
    title: 'CONGRATULATIONS!!! YOU ARE VISITOR #1,000,000!',
    description: 'Claim your ₹4,72,819 before someone else notices this is a fake notification!',
    timeAgo: '5h ago',
    read: false,
    type: 'scam',
  },
  {
    id: 'n6',
    title: 'Your computer remains 73% sad.',
    description: 'Diagnostic report indicates severe lack of memes and excessive CAPTCHA friction.',
    timeAgo: 'Yesterday',
    read: true,
    type: 'alarming',
  }
];

export const NotificationsView: React.FC = () => {
  const { requireCaptcha } = useCaptcha();
  const [notices, setNotices] = useState<NotificationItem[]>(INITIAL_NOTICES);

  const handleMarkAllRead = () => {
    sounds.playDing();
    requireCaptcha('Acknowledge All Useless Notifications', () => {
      setNotices(prev => prev.map(n => ({ ...n, read: true })));
    });
  };

  const handleClearNotices = () => {
    sounds.playBoing();
    requireCaptcha('Purge Existential Notification Queue', () => {
      setNotices([]);
    });
  };

  return (
    <div className="notifications-view-container">
      <div className="notifications-header-box">
        <div className="notif-title-wrap">
          <Bell size={24} className="notif-bell-icon" />
          <h2>NOTIFICATIONS (MANDATORY ENGAGEMENT)</h2>
        </div>
        <div className="notif-actions-wrap">
          <button className="notif-btn-action" onClick={handleMarkAllRead}>
            <Check size={14} /> MARK ALL READ
          </button>
          <button className="notif-btn-action notif-btn-danger" onClick={handleClearNotices}>
            <Trash2 size={14} /> CLEAR ALL
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {notices.map(notice => (
          <div
            key={notice.id}
            className={`notification-item-card ${!notice.read ? 'notif-unread' : ''}`}
            onClick={() => sounds.playKeypress()}
          >
            <div className="notif-type-icon">
              {notice.type === 'scam' && '💰'}
              {notice.type === 'urgent' && '🚨'}
              {notice.type === 'alarming' && '⚠️'}
              {notice.type === 'useless' && '💤'}
            </div>
            <div className="notif-content-area">
              <h4 className="notif-item-title">{notice.title}</h4>
              <p className="notif-item-desc">{notice.description}</p>
              <span className="notif-item-time">{notice.timeAgo}</span>
            </div>
            {!notice.read && (
              <span className="notif-unread-dot" title="Unread notification" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
