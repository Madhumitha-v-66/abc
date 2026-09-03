import React, { useState, useMemo } from 'react';
import { sounds } from '../../utils/sound';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  value: string;
  onChange: (val: string) => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [eyeButtonPos, setEyeButtonPos] = useState({ x: 0, y: 0 });
  const [eyeSide, setEyeSide] = useState<'right' | 'left'>('right');

  // Moving show/hide button on hover or click
  const handleEyeHover = () => {
    sounds.playBoing();
    // 50% chance to jump slightly or switch side
    if (Math.random() > 0.6) {
      setEyeSide(prev => (prev === 'right' ? 'left' : 'right'));
    }
    setEyeButtonPos({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 20,
    });
  };

  const toggleShow = () => {
    sounds.playKeypress();
    setShowPassword(prev => !prev);
    handleEyeHover();
  };

  // Live bizarre password requirements
  const hasNumber = /\d/.test(value);
  const hasUppercase = /[A-Z]/.test(value);
  const hasEmotionalComplexity = /(sad|cry|pain|hope|rage|love|fear|banana|help|😭|😢|\:\()/i.test(value);
  const hasMinLength = value.length >= 6;

  // Strength in bananas
  const bananaScore = useMemo(() => {
    if (value.length === 0) return '0 BANANAS (EMPTY & VULNERABLE)';
    if (value.length < 4) return '14 BANANAS (HIGHLY DANGEROUS)';
    if (value.length < 8) return '73 BANANAS (PROBABLY SAFE*)';
    return '412 BANANAS (EXCESSIVELY COMPLEX)';
  }, [value]);

  return (
    <div className="password-rage-field">
      <label className="rage-input-label">
        PASSWORD (MUST BE MEMORIZED BACKWARDS):
      </label>

      <div className="password-input-relative-wrap">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter password with emotional nuance..."
          className="cursed-input password-input-main"
        />

        {/* Evasive / jumping show-hide toggle */}
        <button
          type="button"
          className={`eye-toggle-btn eye-${eyeSide}`}
          style={{
            transform: `translate(${eyeButtonPos.x}px, ${eyeButtonPos.y}px)`,
            transition: 'transform 0.1s ease',
          }}
          onMouseEnter={handleEyeHover}
          onClick={toggleShow}
          title="Show / Hide password"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="eye-label">{showPassword ? 'HIDE?' : 'PEEK?'}</span>
        </button>
      </div>

      {/* Ridiculous strength meter */}
      <div className="banana-strength-meter">
        <div className="banana-bar-header">
          <span>PASSWORD STRENGTH: <b>{bananaScore}</b></span>
          <span className="banana-indicator-badge">
            {value.length > 6 ? '🍌🍌🍌🍌' : '🍌'}
          </span>
        </div>
        <div className="banana-progress-track">
          <div
            className="banana-progress-fill"
            style={{ width: `${Math.min(100, value.length * 11 + (hasEmotionalComplexity ? 30 : 0))}%` }}
          />
        </div>
      </div>

      {/* Dynamic requirements checklist that unfolds */}
      {value.length > 0 && (
        <div className="password-requirements-box">
          <div className="req-title">⚠️ MANDATORY CREDENTIAL CRITERIA:</div>
          <ul className="req-list">
            <li className={hasNumber ? 'req-met' : 'req-unmet'}>
              {hasNumber ? '✅' : '❌'} Must contain at least one number (e.g. 7 or 42)
            </li>
            <li className={hasUppercase ? 'req-met' : 'req-unmet'}>
              {hasUppercase ? '✅' : '❌'} Must contain an uppercase letter representing authority
            </li>
            <li className={hasMinLength ? 'req-met' : 'req-unmet'}>
              {hasMinLength ? '✅' : '❌'} Must be at least 6 glyphs long
            </li>
            <li className={hasEmotionalComplexity ? 'req-met' : 'req-unmet'}>
              {hasEmotionalComplexity ? '✅' : '❌'} Must contain emotional complexity (e.g. "sad", "cry", "rage", "😭", ":(")
            </li>
            <li className="req-unmet">
              ❌ Must NOT contain any letters found on page 412 of the dictionary
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
