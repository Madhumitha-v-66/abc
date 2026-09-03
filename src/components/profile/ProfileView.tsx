import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCaptcha } from '../../context/CaptchaContext';
import { usePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';
import { EditProfileModal } from './EditProfileModal';
import { ShieldAlert, UserPlus, MessageSquare, Plus, Edit3 } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, suspicionScore } = useAuth();
  const { requireCaptcha } = useCaptcha();
  const { showToast, triggerPopup } = usePopup();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleConnect = () => {
    sounds.playDing();
    requireCaptcha('Connect with Yourself / Your Clone', () => {
      showToast('⚠️ You have requested to connect with yourself. Paradox recorded.', 'info');
    });
  };

  const handleMessage = () => {
    sounds.playDing();
    requireCaptcha('Send Self-Reflective Message', () => {
      showToast('Message sent to your subconscious.', 'info');
    });
  };

  const handleFollow = () => {
    sounds.playDing();
    requireCaptcha('Follow Ego Trajectory', () => {
      showToast('You are now following your own footsteps.', 'info');
    });
  };

  return (
    <div className="profile-chaotic-container">
      {/* Top Banner with horrific clashing gradient */}
      <div className="profile-banner-clashing">
        <div className="banner-noise-text">CERTIFIED HUMAN PROFILE (UNDER AUDIT)</div>
      </div>

      {/* Main Profile Header with misaligned scattered details */}
      <div className="profile-card-main">
        <div className="profile-avatar-row">
          <div className="profile-avatar-wrapper-tilted">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=profile'}
              alt="Avatar"
              className="profile-avatar-img"
            />
            <span className="avatar-status-badge">73% SAD</span>
          </div>

          <div className="profile-action-buttons-scattered">
            <button
              className="prof-btn prof-edit"
              onClick={() => {
                sounds.playDing();
                setIsEditModalOpen(true);
              }}
            >
              <Edit3 size={16} /> EDIT PROFILE
            </button>

            <button className="prof-btn prof-connect" onClick={handleConnect}>
              <UserPlus size={16} /> CONNECT
            </button>
            <button className="prof-btn prof-msg" onClick={handleMessage}>
              <MessageSquare size={16} /> MESSAGE
            </button>
            <button className="prof-btn prof-follow" onClick={handleFollow}>
              <Plus size={16} /> FOLLOW
            </button>
            <button
              className="prof-btn prof-more"
              onClick={() => {
                sounds.playBoing();
                triggerPopup({
                  title: 'MORE PROFILE SECRETS',
                  subtitle: 'INFORMATION REDACTED BY THE ALGORITHM',
                  body: 'Your profile is so confusing that SupergluedIn recruiters cannot determine your species.',
                  type: 'existential',
                  closeType: 'tiny-x',
                });
              }}
            >
              MORE...
            </button>
          </div>
        </div>

        <div className="profile-info-block">
          <h1 className="profile-display-name">
            {user?.name || 'ZIHSRBZ'}{' '}
            {user?.originalName && (
              <small className="original-name-tag">(Original: {user.originalName})</small>
            )}
          </h1>
          <p className="profile-tagline-text">
            {user?.headline || 'Senior Ambiguous Locomotive Classifier | Certified 10-Image Specialist'}
          </p>

          <div className="profile-meta-scrambled">
            <span>📍 {user?.location || 'Relocated to international cyber space'}</span>
            <span>•</span>
            <span className="text-neon-pink">🔗 {user?.connectionsCount ?? 2} Connections</span>
            <span>•</span>
            <span className="text-neon-green">👁️ {user?.profileViews ?? 9999} Fake Profile Views</span>
            {user?.education && (
              <>
                <span>•</span>
                <span className="text-yellow">🎓 {user.education}</span>
              </>
            )}
          </div>

          <div className="profile-paranoia-box">
            <ShieldAlert size={18} color="#ff00ff" />
            <span>ALGORITHM SUSPICION RATING: <b>{suspicionScore}%</b> — You are considered 27% biological.</span>
          </div>
        </div>
      </div>

      {/* Scattered Layout: About Section on the Right, Experience on Left, Skills upside down */}
      <div className="profile-scattered-grid">
        {/* Experience Section */}
        <div className="profile-section-card exp-card">
          <h3 className="section-title">💼 EMPLOYMENT HISTORY (REVERSE CHRONOLOGICAL CHAOS)</h3>
          {(user?.experience && user.experience.length > 0 ? user.experience : [
            {
              title: 'Senior Popup Dodger & Closer',
              company: 'Scam Ads Unlimited • Full-time',
              period: '2023 - Present',
              desc: 'Successfully identified and clicked 4,120 invisible 2px close buttons. Reduced company revenue by 100% through persistent refusal to buy fake RAM.',
            },
            {
              title: 'Lead Atbash Keyboard Translator',
              company: 'Inverted Communications Group',
              period: '2020 - 2023',
              desc: 'Translated "HELLO WORLD" to "SVOOL DLIOW" on a daily basis. Decreased team productivity by 82% while improving cryptographical paranoia.',
            },
          ]).map((exp, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-header">
                <h4>{exp.title}</h4>
                <span className="time-badge">{exp.period}</span>
              </div>
              <p className="company-tag">{exp.company}</p>
              <p className="timeline-desc">{exp.desc}</p>
            </div>
          ))}
        </div>

        {/* Scattered "About" Box in an awkward position */}
        <div className="profile-section-card about-card">
          <h3 className="section-title">📝 ABOUT (WHY IS THIS OVER HERE?)</h3>
          <p className="about-text-content">
            {user?.about ||
              'I am a results-driven professional specializing in entering passwords with emotional complexity, passing computer science CAPTCHAs while my computer is 73% sad, and attempting to navigate websites with clashing colors and redundant dropdown menus.'}
          </p>
          <div className="about-quote">
            “If the button runs away from your cursor, run faster.”
          </div>
        </div>

        {/* Endorsements / Skills */}
        <div className="profile-section-card skills-card">
          <h3 className="section-title">⭐ SKILLS & CHAOTIC ENDORSEMENTS</h3>
          <div className="skills-cloud">
            {(user?.skills && user.skills.length > 0 ? user.skills : [
              'Distinguishing Toasters from Scooters',
              'Solving Coffman Deadlocks in 15s',
              'Tolerating Comic Sans MS',
              'Clicking Evasive Close Buttons',
            ]).map((skill, idx) => (
              <div key={idx} className="skill-pill">
                <span>{skill}</span>
                <span className="skill-count">{400 + idx * 12}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};
