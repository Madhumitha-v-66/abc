import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';
import { Camera, X, Save, ShieldCheck, Sparkles } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { showToast } = usePopup();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [about, setAbout] = useState(user?.about || '');
  const [location, setLocation] = useState(user?.location || '');
  const [skillsStr, setSkillsStr] = useState(user?.skills?.join(', ') || '');
  const [education, setEducation] = useState(user?.education || '');

  // Experience Item
  const [expTitle, setExpTitle] = useState(user?.experience?.[0]?.title || '');
  const [expCompany, setExpCompany] = useState(user?.experience?.[0]?.company || '');
  const [expDesc, setExpDesc] = useState(user?.experience?.[0]?.desc || '');

  // Fake analysis message for photo
  const [photoAnalysis, setPhotoAnalysis] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  // Handle local image upload via FileReader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playKeypress();
    setPhotoAnalysis('ANALYZING PIXEL VIBES: Extracting corporate posture and emotional compliance...');

    const reader = new FileReader();
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      setAvatar(dataUrl);
      sounds.playDing();
      setPhotoAnalysis(
        '✓ PIXEL AUDIT COMPLETE: Photo evaluated at 89% corporate, 11% suspected biological lifeform.'
      );
    };
    reader.readAsDataURL(file);
  };

  // Calculate dynamic fake professionalism score
  const professionalismScore = Math.min(
    99,
    Math.max(
      24,
      Math.round(
        (name.length * 2 +
          headline.length * 0.5 +
          about.length * 0.2 +
          skillsStr.split(',').length * 8) *
          0.8
      )
    )
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playDing();

    const parsedSkills = skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedExperience = [
      {
        title: expTitle || 'Senior Ambiguity Consultant',
        company: expCompany || 'Unverified Synergy Ltd',
        period: user.experience?.[0]?.period || '2023 - Present',
        desc: expDesc || 'Spearheaded confusing cross-functional confusion initiatives.',
      },
      ...(user.experience?.slice(1) || []),
    ];

    updateUser({
      name: name.trim() || user.name,
      headline: headline.trim() || user.headline,
      avatar: avatar || user.avatar,
      about: about.trim() || user.about,
      location: location.trim() || user.location,
      skills: parsedSkills.length > 0 ? parsedSkills : user.skills,
      education: education.trim() || user.education,
      experience: updatedExperience,
    });

    showToast('✨ Corporate profile successfully perturbed and persisted!', 'info');
    onClose();
  };

  return (
    <div className="profile-edit-modal-overlay">
      <div className="profile-edit-card">
        {/* Header */}
        <div className="edit-modal-header">
          <div className="header-left">
            <span className="font-pixel text-yellow">EDIT PROFESSIONAL PERSONA</span>
            <small className="header-sub-text">“Alter your identity to bewilder algorithmic recruiters.”</small>
          </div>
          <button type="button" className="edit-close-x" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Professionalism Bar */}
        <div className="professionalism-meter-strip">
          <div className="meter-label-row">
            <span>
              <Sparkles size={14} className="inline-icon" /> ARTIFICIAL PROFESSIONALISM INDEX: <b>{professionalismScore}%</b>
            </span>
            <small>{professionalismScore > 70 ? 'HIGH CORPORATE DENSITY' : 'NEEDS MORE BUZZWORDS'}</small>
          </div>
          <div className="meter-track">
            <div className="meter-fill" style={{ width: `${professionalismScore}%` }} />
          </div>
        </div>

        <form onSubmit={handleSave} className="edit-modal-scroll-body">
          {/* Section: Profile Picture Upload */}
          <div className="edit-section-card">
            <h4 className="edit-sec-title">1. BIOMETRIC AVATAR / PROFILE PICTURE</h4>
            <div className="avatar-uploader-row">
              <div className="avatar-preview-box">
                <img src={avatar} alt="Avatar preview" className="avatar-preview-img" />
              </div>
              <div className="avatar-controls-col">
                <button
                  type="button"
                  className="upload-file-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={16} />
                  <span>UPLOAD NEW PROFILE PICTURE</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                />
                <small className="file-format-hint">
                  Supports JPG, PNG, GIF, SVG directly from your computer. No backend required.
                </small>
                {photoAnalysis && (
                  <div className="photo-analysis-badge">
                    <ShieldCheck size={14} color="#00ff00" />
                    <span>{photoAnalysis}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Basic Identity */}
          <div className="edit-section-card">
            <h4 className="edit-sec-title">2. PROFESSIONAL NOMENCLATURE</h4>
            <div className="edit-field-group">
              <label>FULL DISPLAY NAME:</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Archibald V. Turing III"
                className="edit-input-field"
                required
              />
            </div>

            <div className="edit-field-group">
              <label>PROFESSIONAL HEADLINE (MUST SOUND DRAMATIC):</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="e.g. Lead Locomotive Identifier @ MIT | 73% Sad"
                className="edit-input-field"
                required
              />
            </div>

            <div className="edit-field-group">
              <label>CYBER LOCATION:</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Remote (Offshore Oil Rig) or International Void"
                className="edit-input-field"
              />
            </div>
          </div>

          {/* Section: Bio / About */}
          <div className="edit-section-card">
            <h4 className="edit-sec-title">3. ABOUT / LIFE TRAJECTORY (THE NARRATIVE)</h4>
            <div className="edit-field-group">
              <label>SELF-ASSESSMENT PARAGRAPH:</label>
              <textarea
                value={about}
                onChange={e => setAbout(e.target.value)}
                rows={4}
                className="edit-textarea-field"
                placeholder="Describe your struggle against automated keyboards and moving buttons..."
              />
            </div>
          </div>

          {/* Section: Skills */}
          <div className="edit-section-card">
            <h4 className="edit-sec-title">4. SKILLS & CHAOTIC ENDORSEMENTS</h4>
            <div className="edit-field-group">
              <label>COMMA-SEPARATED SKILLS:</label>
              <input
                type="text"
                value={skillsStr}
                onChange={e => setSkillsStr(e.target.value)}
                placeholder="e.g. Solving Deadlocks, Tolerating Popups, Atbash Typing"
                className="edit-input-field"
              />
              <small className="field-micro-hint">
                Separate multiple skills with commas. The algorithm judges your syntax.
              </small>
            </div>
          </div>

          {/* Section: Experience */}
          <div className="edit-section-card">
            <h4 className="edit-sec-title">5. PRIMARY EMPLOYMENT ORDEAL</h4>
            <div className="edit-field-group">
              <label>JOB TITLE:</label>
              <input
                type="text"
                value={expTitle}
                onChange={e => setExpTitle(e.target.value)}
                placeholder="e.g. Senior Popup Dodger & Closer"
                className="edit-input-field"
              />
            </div>
            <div className="edit-field-group">
              <label>COMPANY / ORGANIZATION:</label>
              <input
                type="text"
                value={expCompany}
                onChange={e => setExpCompany(e.target.value)}
                placeholder="e.g. Scam Ads Unlimited • Full-time"
                className="edit-input-field"
              />
            </div>
            <div className="edit-field-group">
              <label>DESCRIPTION OF DELIVERABLES:</label>
              <textarea
                value={expDesc}
                onChange={e => setExpDesc(e.target.value)}
                rows={3}
                className="edit-textarea-field"
                placeholder="What buttons did you chase? What popups were neutralized?"
              />
            </div>
          </div>

          {/* Section: Education */}
          <div className="edit-section-card">
            <h4 className="edit-sec-title">6. ACADEMIC ILLUSION</h4>
            <div className="edit-field-group">
              <label>HIGHEST DEGREE / INSTITUTION:</label>
              <input
                type="text"
                value={education}
                onChange={e => setEducation(e.target.value)}
                placeholder="e.g. B.S. in Reverse Psychology & Keyboard Scrambling"
                className="edit-input-field"
              />
            </div>
          </div>

          {/* Save Action Footer */}
          <div className="edit-modal-footer">
            <button type="button" className="edit-cancel-btn" onClick={onClose}>
              ABANDON CHANGES
            </button>
            <button type="submit" className="edit-save-btn">
              <Save size={18} />
              <span>SAVE & PERSIST TO SUPERGLUEDIN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
