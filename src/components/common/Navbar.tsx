import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCaptcha } from '../../context/CaptchaContext';
import { usePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Flame,
  Search,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenSearch: () => void;
  onTriggerRageQuit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenSearch,
  onTriggerRageQuit,
}) => {
  const { user, logout, suspicionScore } = useAuth();
  const { requireCaptcha } = useCaptcha();
  const { triggerPopup } = usePopup();

  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [morePlusOpen, setMorePlusOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    sounds.playKeypress();
    // 25% chance of randomly shifting to a different tab or triggering a popup!
    if (Math.random() > 0.8) {
      triggerPopup({
        title: 'NAVIGATION DETOUR APPLIED',
        subtitle: 'ALGORITHMIC ROUTING OPTIMIZATION',
        body: 'We believed you would enjoy looking at this popup before reaching your intended destination.',
        type: 'confirm',
        closeType: 'moving-btn',
      });
    }
    onTabChange(tabId);
    setJobsDropdownOpen(false);
    setMoreDropdownOpen(false);
    setMorePlusOpen(false);
  };

  const handleLogoutClick = () => {
    sounds.playDing();
    requireCaptcha('Logout Humanity Confirmation', () => {
      logout();
      alert('You have successfully logged out. Please log back in to verify you did not log out accidentally.');
    });
  };

  return (
    <header className="navbar-chaos-root">
      <div className="navbar-inner-container">
        {/* Brand */}
        <div className="navbar-brand-section" onClick={() => handleTabClick('feed')}>
          <span className="brand-logo-emoji">🖇️🤡</span>
          <span className="brand-title">SUPERGLUEDIN</span>
        </div>

        {/* Quick Search Shortcut */}
        <div className="navbar-search-wrapper" onClick={onOpenSearch}>
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            readOnly
            placeholder="Search for synergies, ambiguous vehicles, or regret..."
            className="navbar-search-dummy"
          />
          <button className="navbar-search-btn-tiny" title="Tiny Search Button">
            🔍
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="navbar-links-row">
          <button
            className={`nav-item-btn ${currentTab === 'feed' ? 'nav-active' : ''}`}
            onClick={() => handleTabClick('feed')}
          >
            <Home size={18} />
            <span className="nav-label">HOME</span>
          </button>

          <button
            className={`nav-item-btn ${currentTab === 'network' ? 'nav-active' : ''}`}
            onClick={() => handleTabClick('network')}
          >
            <Users size={18} />
            <span className="nav-label">MY NETWORK</span>
            <span className="nav-badge-neon">412</span>
          </button>

          {/* Jobs with Nested Redundant Dropdown */}
          <div className="nav-dropdown-wrapper">
            <button
              className={`nav-item-btn ${currentTab === 'jobs' ? 'nav-active' : ''}`}
              onClick={() => setJobsDropdownOpen(prev => !prev)}
            >
              <Briefcase size={18} />
              <span className="nav-label">JOBS</span>
              <ChevronDown size={14} />
            </button>

            {jobsDropdownOpen && (
              <div className="nav-dropdown-menu">
                <div className="dropdown-item" onClick={() => handleTabClick('jobs')}>
                  💼 Find Jobs
                </div>
                <div className="dropdown-item" onClick={() => handleTabClick('jobs')}>
                  💼 Jobs
                </div>
                <div className="dropdown-item" onClick={() => handleTabClick('jobs')}>
                  🔍 Search Jobs
                </div>
                <div className="dropdown-item" onClick={() => handleTabClick('jobs')}>
                  🔁 Jobs Again
                </div>
                <div className="dropdown-item" onClick={() => handleTabClick('jobs')}>
                  ⚡ Permanent Internships
                </div>
              </div>
            )}
          </div>

          <button
            className={`nav-item-btn ${currentTab === 'messages' ? 'nav-active' : ''}`}
            onClick={() => handleTabClick('messages')}
          >
            <MessageSquare size={18} />
            <span className="nav-label">MESSAGES</span>
            <span className="nav-badge-pink">99+</span>
          </button>

          <button
            className={`nav-item-btn ${currentTab === 'notifications' ? 'nav-active' : ''}`}
            onClick={() => handleTabClick('notifications')}
          >
            <Bell size={18} />
            <span className="nav-label">NOTICES</span>
            <span className="nav-badge-flash">!</span>
          </button>

          <button
            className={`nav-item-btn ${currentTab === 'profile' ? 'nav-active' : ''}`}
            onClick={() => handleTabClick('profile')}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Me" className="navbar-avatar-thumbnail" />
            ) : (
              <User size={18} />
            )}
            <span className="nav-label">ME (YOU?)</span>
          </button>

          {/* Redundant 'MORE', 'MORE+', 'MORE???' */}
          <div className="nav-dropdown-wrapper">
            <button
              className="nav-item-btn"
              onClick={() => setMoreDropdownOpen(prev => !prev)}
            >
              <span className="nav-label">MORE</span>
              <ChevronDown size={12} />
            </button>

            {moreDropdownOpen && (
              <div className="nav-dropdown-menu">
                <div className="dropdown-item" onClick={() => handleTabClick('settings')}>
                  ⚙️ Settings
                </div>
                <div className="dropdown-item" onClick={() => setMorePlusOpen(true)}>
                  ➡️ MORE+
                </div>
              </div>
            )}
          </div>

          {morePlusOpen && (
            <div className="nav-dropdown-wrapper">
              <button
                className="nav-item-btn nav-special-glow"
                onClick={() => {
                  sounds.playDing();
                  alert('MORE??? HAS BEEN REACHED. THERE IS NO FURTHER DEPTH.');
                }}
              >
                <span className="nav-label">MORE???</span>
              </button>
            </div>
          )}

          {/* Suspicion Meter in Navbar */}
          <div className="navbar-suspicion-box" title="Calculated by autonomous machine learning paranoia">
            <span className="suspicion-label">SUSPICION:</span>
            <span className="suspicion-score">{suspicionScore}%</span>
          </div>

          {/* Rage Quit Button */}
          <button
            className="navbar-rage-quit-btn"
            onClick={onTriggerRageQuit}
            title="I can't take this website anymore"
          >
            <Flame size={16} />
            <span>RAGE QUIT!</span>
          </button>

          {/* Logout button */}
          {user && (
            <button
              className="navbar-logout-btn"
              onClick={handleLogoutClick}
              title="Logout (Requires CAPTCHA)"
            >
              <LogOut size={16} />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
