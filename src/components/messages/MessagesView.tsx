import React, { useState } from 'react';
import { useCaptcha } from '../../context/CaptchaContext';
import { usePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';
import { Send, User, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'recruiter' | 'user';
  text: string;
  time: string;
}

export const MessagesView: React.FC = () => {
  const { requireCaptcha } = useCaptcha();
  const { showToast } = usePopup();

  const [activeThread, setActiveThread] = useState('t1');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    t1: [
      {
        id: 'm1',
        sender: 'recruiter',
        text: 'Hello! I noticed your profile and was deeply impressed by your ability to survive 10-image CAPTCHAs. Are you open to an exciting 80-hour/week startup role?',
        time: '10:14 AM',
      },
      {
        id: 'm2',
        sender: 'recruiter',
        text: 'Compensation is 73 Bananas per quarter, vested over 14 centuries. Can we schedule a quick 45-minute sync right now?',
        time: '10:15 AM',
      },
    ],
    t2: [
      {
        id: 'm3',
        sender: 'recruiter',
        text: 'URGENT: Your computer is reported to be 73% sad. As a lead recruiter at Hardware Hugs Inc, we want to know if you can fix it.',
        time: 'Yesterday',
      }
    ]
  });

  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sounds.playDing();
    // MANDATORY CAPTCHA TO SEND A MESSAGE!
    requireCaptcha(`Send Message: "${inputText.slice(0, 10)}..."`, () => {
      const newMsg: ChatMessage = {
        id: 'm-' + Date.now(),
        sender: 'user',
        text: inputText,
        time: 'Just now',
      };
      setMessages(prev => ({
        ...prev,
        [activeThread]: [...(prev[activeThread] || []), newMsg],
      }));
      setInputText('');
      showToast('📨 Message transmitted through the Atbash relay network.', 'info');
    });
  };

  return (
    <div className="messages-view-container">
      <div className="messages-panel-shell">
        {/* Left conversations list */}
        <div className="messages-left-threads">
          <div className="threads-header">
            <h3>💬 INBOX (99+ UNANSWERED)</h3>
          </div>
          <div
            className={`thread-item ${activeThread === 't1' ? 'thread-active' : ''}`}
            onClick={() => { sounds.playKeypress(); setActiveThread('t1'); }}
          >
            <div className="thread-avatar">👔</div>
            <div className="thread-meta">
              <span className="thread-name">Brad from DisruptCorp</span>
              <span className="thread-snippet">Are you open to 73 bananas...</span>
            </div>
          </div>
          <div
            className={`thread-item ${activeThread === 't2' ? 'thread-active' : ''}`}
            onClick={() => { sounds.playKeypress(); setActiveThread('t2'); }}
          >
            <div className="thread-avatar">💻</div>
            <div className="thread-meta">
              <span className="thread-name">Sad Computer Support</span>
              <span className="thread-snippet">URGENT: Your computer is...</span>
            </div>
          </div>
        </div>

        {/* Right conversation window */}
        <div className="messages-right-chat">
          <div className="chat-top-bar">
            <User size={18} />
            <span>Chatting with <b>{activeThread === 't1' ? 'Brad from DisruptCorp' : 'Sad Computer Support'}</b></span>
            <span className="chat-badge-safe">ENCRYPTED* (*maybe)</span>
          </div>

          <div className="chat-message-stream">
            {(messages[activeThread] || []).map(m => (
              <div
                key={m.id}
                className={`chat-bubble-row ${m.sender === 'user' ? 'bubble-user-right' : 'bubble-other-left'}`}
              >
                <div className="chat-bubble-content">
                  <p>{m.text}</p>
                  <small className="chat-time-tag">{m.time}</small>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="chat-send-form">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type your response..."
              className="chat-input-field"
            />
            <button type="submit" className="chat-send-btn">
              <Send size={16} /> SEND
            </button>
          </form>
          <div className="chat-micro-alert">
            <AlertCircle size={12} />
            <span>Notice: Autonomous spam filters will inspect your emotional nuance.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
