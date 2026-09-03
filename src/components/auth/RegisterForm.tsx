import React, { useState } from 'react';
import { RegisteredAccount } from '../../types';
import { DrawingData } from '../../utils/shapeMatcher';
import { DrawingCanvas } from './DrawingCanvas';
import { sounds } from '../../utils/sound';
import { FileText, CheckCircle2 } from 'lucide-react';

interface RegisterFormProps {
  onRegisterSuccess: (account: RegisteredAccount) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onSwitchToLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [employability, setEmployability] = useState(42);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [secretDrawing, setSecretDrawing] = useState<DrawingData | null>(null);

  // Annoying UI quirks
  const [confirmOffset, setConfirmOffset] = useState({ x: 0, y: 0 });
  const [hasClickedConfirm, setHasClickedConfirm] = useState(false);
  const [submitBtnLabelIdx, setSubmitBtnLabelIdx] = useState(0);
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null);

  const SUBMIT_LABELS = [
    'CREATE PROBLEM & REGISTER',
    'SUBMIT IDENTITY TO VOID',
    'BECOME QUESTIONABLY EMPLOYED',
    'STORE CREDENTIALS SOMEWHERE',
  ];

  const handleConfirmFocus = () => {
    if (!hasClickedConfirm) {
      sounds.playBoing();
      setHasClickedConfirm(true);
      // Moves 25px away on first touch!
      setConfirmOffset({ x: 22, y: 8 });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playDing();

    if (!username.trim()) {
      alert('USERNAME ERROR: A username of at least 1 character is mandatory for tracking.');
      return;
    }

    if (!password) {
      alert('PASSWORD ERROR: You cannot enter an empty password into our potato database.');
      return;
    }

    if (password !== confirmPassword) {
      sounds.playBuzzer();
      alert('PASSWORD DISCORD: Passwords do not match. Please reconsider your life choices.');
      return;
    }

    if (!secretDrawing || secretDrawing.strokes.length === 0) {
      sounds.playBuzzer();
      alert('GEOMETRIC MANDATE: You MUST draw a Secret Security Shape before you can exist.');
      return;
    }

    if (!agreeTerms) {
      sounds.playBuzzer();
      alert('COMPLIANCE CRISIS: You must accept our 842-page Terms of Confusion.');
      return;
    }

    // Save account to localStorage
    const account: RegisteredAccount = {
      username: username.trim(),
      password: password,
      secretDrawing: secretDrawing,
      fullName: fullName.trim() || 'Undisclosed Entity',
      jobTitle: jobTitle.trim() || 'Junior CAPTCHA Over-thinker',
      employabilityScore: employability,
      createdAt: Date.now(),
    };

    localStorage.setItem('supergluedin_user_account', JSON.stringify(account));
    localStorage.setItem('linkedout_user_account', JSON.stringify(account));

    // Show misleading message as required by prompt!
    setRegistrationNotice('ACCOUNT PROBABLY CREATED. Your SupergluedIn credentials have been securely inconvenienced. Please proceed to authentication.');
    sounds.playDing();

    setTimeout(() => {
      onRegisterSuccess(account);
    }, 2000);
  };

  // Potato strength calculator
  const potatoScore = Math.min(100, Math.max(12, password.length * 9 + (/\d/.test(password) ? 25 : 0)));

  return (
    <div className="register-form-card">
      <div className="register-header">
        <div className="register-badge-pill">STEP 0: ONBOARDING DISASTER</div>
        <h2 className="register-title">CREATE YOUR CORPORATE PROFILE</h2>
        <p className="register-subtitle">
          “Enter your details now so that we may misunderstand them during login.”
        </p>
      </div>

      {registrationNotice ? (
        <div className="registration-success-banner">
          <CheckCircle2 size={32} color="#00ff00" />
          <div className="success-content">
            <h3>{registrationNotice}</h3>
            <p>Directing you to the authentication puzzle...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="register-form-body">
          {/* Username */}
          <div className="reg-field-group">
            <div className="label-row">
              <label className="reg-label">CHOSEN USERNAME:</label>
              {username.length > 0 && (
                <span className="availability-tag">
                  ✓ {username} is probably available.
                </span>
              )}
            </div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. abcdcup"
              className="cursed-input"
              autoComplete="off"
            />
          </div>

          {/* Password */}
          <div className="reg-field-group">
            <label className="reg-label">PASSWORD (ENTER NORMALLY FOR NOW):</label>
            <input
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setSubmitBtnLabelIdx(prev => (prev + 1) % SUBMIT_LABELS.length);
              }}
              placeholder="e.g. hello123"
              className="cursed-input"
            />
            <div className="potato-meter-strip">
              <span>PASSWORD STRENGTH: <b>{potatoScore} POTATOES</b> 🥔</span>
              <div className="potato-track">
                <div className="potato-bar" style={{ width: `${potatoScore}%` }} />
              </div>
            </div>
          </div>

          {/* Confirm Password with dodging movement */}
          <div
            className="reg-field-group confirm-group"
            style={{
              transform: `translate(${confirmOffset.x}px, ${confirmOffset.y}px)`,
              transition: 'transform 0.15s ease',
            }}
          >
            <label className="reg-label">CONFIRM PASSWORD (IF YOU DARE):</label>
            <input
              type="password"
              value={confirmPassword}
              onFocus={handleConfirmFocus}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm the exact same password..."
              className="cursed-input"
            />
            {hasClickedConfirm && (
              <small className="field-displaced-note">
                *The confirm box shifted slightly for ergonomic testing.
              </small>
            )}
          </div>

          {/* Secret Security Drawing Canvas Section */}
          <div className="reg-field-group drawing-section-group">
            <DrawingCanvas
              title="CREATE YOUR SECRET SECURITY DRAWING"
              subtitle="Because apparently passwords were too convenient."
              onDrawingChange={setSecretDrawing}
              mode="register"
            />
            <div className="canvas-instruction-callout">
              ✏️ <b>CRITICAL:</b> Draw something you will definitely remember (triangle, star, arrow, symbol). You will be required to reproduce it during authentication!
            </div>
          </div>

          {/* Full Name */}
          <div className="reg-field-group">
            <label className="reg-label">FULL LEGAL NAME (WILL BE AUDITED):</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. John Deceptive Doe"
              className="cursed-input"
            />
          </div>

          {/* Optional Professional Delusions */}
          <div className="reg-field-group">
            <label className="reg-label">PROFESSIONAL HEADLINE (OPTIONAL BRAG):</label>
            <input
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Chief Potato Officer / Senior CAPTCHA Whisperer"
              className="cursed-input"
            />
          </div>

          {/* How Employable Are You Slider */}
          <div className="reg-field-group slider-group">
            <div className="label-row">
              <label className="reg-label">HOW EMPLOYABLE DO YOU THINK YOU ARE?</label>
              <span className="slider-val-badge font-pixel">{employability}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={employability}
              onChange={e => setEmployability(Number(e.target.value))}
              className="cursed-slider"
            />
            <div className="slider-labels-row">
              <span>0% Unemployable</span>
              <span>50% Delusional</span>
              <span>100% God of Synergy</span>
            </div>
          </div>

          {/* Fake Terms Checkbox */}
          <div className="reg-terms-row">
            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => {
                  sounds.playKeypress();
                  setAgreeTerms(e.target.checked);
                }}
              />
              <span className="terms-text">
                I accept the 842-page Terms of Deliberate Agony and surrender all expectations of normal UI.
              </span>
            </label>
            <button
              type="button"
              className="view-terms-btn"
              onClick={() => setShowTermsModal(true)}
            >
              <FileText size={12} /> Read Terms
            </button>
          </div>

          {/* Submit Action */}
          <div className="reg-submit-row">
            <button type="submit" className="reg-submit-btn">
              🚀 {SUBMIT_LABELS[submitBtnLabelIdx]}
            </button>
          </div>

          <div className="switch-auth-link-row">
            <span>Already made an account and ready to suffer?</span>
            <button
              type="button"
              className="switch-link-btn"
              onClick={onSwitchToLogin}
            >
              Go to Annoying Sign In ➔
            </button>
          </div>
        </form>
      )}

      {/* Fake Terms Modal */}
      {showTermsModal && (
        <div className="terms-modal-overlay">
          <div className="terms-modal-card">
            <h3>TERMS & CONDITIONS OF SUFFERING (EXCERPT)</h3>
            <div className="terms-text-scroll">
              <p>Clause 1.1: The user acknowledges that letters are purely advisory.</p>
              <p>Clause 1.2: Buttons reserve the right to vacate their position when approached by pointing devices.</p>
              <p>Clause 1.3: The password entered here may be requested upside down, backwards, or translated into Esperanto.</p>
              <p>Clause 1.4: By creating an account, your credentials will be stored in localStorage and protected by our proprietary Potato Encryption Standard.</p>
            </div>
            <button
              type="button"
              className="terms-dismiss-btn"
              onClick={() => setShowTermsModal(false)}
            >
              I ACCEPT WITHOUT UNDERSTANDING
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
