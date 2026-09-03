import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCaptcha } from '../../context/CaptchaContext';
import { usePopup } from '../../context/PopupContext';
import { RegisteredAccount } from '../../types';
import { DrawingData, compareDrawings } from '../../utils/shapeMatcher';
import { toAtbash } from '../../utils/atbash';
import { sounds } from '../../utils/sound';
import { InvertedKeyboard } from './InvertedKeyboard';
import { RegisterForm } from '../auth/RegisterForm';
import { DrawingCanvas } from '../auth/DrawingCanvas';
import { SuspicionMeter } from '../auth/SuspicionMeter';
import { FakeSecurityQuestion } from '../auth/FakeSecurityQuestion';
import { EvasiveLoginButton } from '../auth/EvasiveLoginButton';
import { CheckCircle2, Lock, Eye, EyeOff, AlertTriangle, ShieldCheck } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { requireCaptcha } = useCaptcha();
  const { showToast } = usePopup();

  // Tab State: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [storedAccount, setStoredAccount] = useState<RegisteredAccount | null>(null);

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginDrawing, setLoginDrawing] = useState<DrawingData | null>(null);
  const [activeField, setActiveField] = useState<'username' | 'password'>('username');
  const [physicalKeyboardWarning, setPhysicalKeyboardWarning] = useState<string | null>(null);

  // Failure and attempt tracking
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatusText, setVerifyStatusText] = useState('');
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  // Audit Diagnostic State
  const [diagnosticAudit, setDiagnosticAudit] = useState<{
    show: boolean;
    usernameValid: boolean;
    usernameClue?: string;
    passwordValid: boolean;
    passwordClue?: string;
    drawingValid: boolean;
    drawingConfidence: number;
    drawingClue?: string;
    checkboxesValid: boolean;
    allCredentialsValid: boolean;
  } | null>(null);

  // Mandatory Checkboxes
  const [cb1, setCb1] = useState(true);
  const [cb2, setCb2] = useState(false);
  const [cb3, setCb3] = useState(false);
  const [cb4, setCb4] = useState(true);

  // Load account from localStorage (support both supergluedin and fallback linkedout)
  useEffect(() => {
    const saved = localStorage.getItem('supergluedin_user_account') || localStorage.getItem('linkedout_user_account');
    if (saved) {
      try {
        const parsed: RegisteredAccount = JSON.parse(saved);
        setStoredAccount(parsed);
        setActiveTab('login');
      } catch {
        // Ignore
      }
    }
  }, []);

  const handleRegisterSuccess = (account: RegisteredAccount) => {
    setStoredAccount(account);
    setActiveTab('login');
    setUsername('');
    setPassword('');
    setLoginDrawing(null);
    setLoginAttempts(0);
    setDiagnosticAudit(null);
    showToast('📝 SupergluedIn credentials registered! Now solve the login puzzle.', 'info');
  };

  // Block physical keyboard input with amusing warning
  const handlePhysicalKeyAttempt = (actionType: 'key' | 'paste' | 'drop' = 'key') => {
    sounds.playBuzzer();
    if (actionType === 'paste') {
      setPhysicalKeyboardWarning('PASTE DETECTED: Automated credential transmission forbidden by SupergluedIn.');
    } else if (actionType === 'drop') {
      setPhysicalKeyboardWarning('DRAG & DROP DETECTED: Physical gravity cannot assist your login.');
    } else {
      setPhysicalKeyboardWarning('PHYSICAL KEYBOARD DETECTED. REAL KEYBOARD ACCESS DENIED. Please stop trying to use the easy method.');
    }

    setTimeout(() => {
      setPhysicalKeyboardWarning(null);
    }, 4000);
  };

  const toggleCheckbox = (num: number) => {
    sounds.playKeypress();
    if (num === 1) setCb1(prev => !prev);
    if (num === 2) setCb2(prev => !prev);
    if (num === 3) setCb3(prev => !prev);
    if (num === 4) setCb4(prev => !prev);
  };

  // On-Screen Keyboard clicks type into whichever field is currently active
  const handleOnScreenKeyPress = (char: string) => {
    if (activeField === 'username') {
      setUsername(prev => prev + char);
    } else {
      setPassword(prev => prev + char);
    }
  };

  const handleOnScreenBackspace = () => {
    if (activeField === 'username') {
      setUsername(prev => prev.slice(0, -1));
    } else {
      setPassword(prev => prev.slice(0, -1));
    }
  };

  const handleOnScreenClear = () => {
    if (activeField === 'username') {
      setUsername('');
    } else {
      setPassword('');
    }
  };

  // Execute authentication attempt when evasive button is clicked
  const executeLoginEvaluation = () => {
    if (!storedAccount) {
      sounds.playBuzzer();
      alert('NO ACCOUNT FOUND: You must CREATE AN ACCOUNT on SupergluedIn first before you can log in.');
      setActiveTab('register');
      return;
    }

    // Step 1: Progress delay
    setIsVerifying(true);
    setVerifyStatusText('VERIFYING CREDENTIALS IN CYBER VOID...');
    sounds.playDing();

    setTimeout(() => {
      setVerifyStatusText('CONSULTING SUPERGLUEDIN CIVIC COMPLIANCE...');
    }, 350);

    setTimeout(() => {
      setVerifyStatusText('CHECKING VIBES & GEOMETRIC ENTROPY...');
    }, 700);

    setTimeout(() => {
      setIsVerifying(false);
      evaluateAllAuthenticationConditions();
    }, 1000);
  };

  const evaluateAllAuthenticationConditions = () => {
    if (!storedAccount) return;

    const currentAttempt = loginAttempts + 1;
    setLoginAttempts(currentAttempt);

    // =========================================================================
    // 1. Inverted Username via Atbash Cipher
    // =========================================================================
    const effectiveTransformedUsername = toAtbash(username.trim());
    const usernameValid =
      effectiveTransformedUsername.toLowerCase() === storedAccount.username.trim().toLowerCase();

    let usernameClue: string | undefined;
    if (!usernameValid) {
      if (currentAttempt === 1) {
        usernameClue = 'USERNAME INVALID. (Did you follow the inverted instruction?)';
      } else if (currentAttempt === 2) {
        usernameClue = 'The letters look confident, but the alphabet is inverted.';
      } else if (currentAttempt === 3) {
        usernameClue = 'Hint: The alphabet has two ends. Think from the other end (A is Z, B is Y).';
      } else {
        usernameClue = `Hint: To enter "${storedAccount.username}", type "${toAtbash(storedAccount.username)}" on the virtual keyboard.`;
      }
    }

    // =========================================================================
    // 2. Backwards Password
    // =========================================================================
    const expectedReversedPassword = storedAccount.password.split('').reverse().join('');
    const passwordValid = password === expectedReversedPassword;

    let passwordClue: string | undefined;
    if (!passwordValid) {
      if (currentAttempt === 1) {
        passwordClue = 'PASSWORD INCORRECT.';
      } else if (currentAttempt === 2) {
        passwordClue = 'Your password appears to be facing the wrong direction.';
      } else if (currentAttempt === 3) {
        passwordClue = 'Security recommends entering credentials backwards (right to left).';
      } else {
        passwordClue = `Hint: Enter your password backwards: "${expectedReversedPassword}".`;
      }
    }

    // =========================================================================
    // 3. Secret Security Drawing
    // =========================================================================
    const drawingComparison = compareDrawings(storedAccount.secretDrawing, loginDrawing, 30);
    const drawingValid = drawingComparison.isMatch;

    let drawingClue: string | undefined;
    if (!drawingValid) {
      if (currentAttempt === 1) {
        drawingClue = 'Secret verification shape failed.';
      } else if (currentAttempt === 2) {
        drawingClue = 'Your shape appears unfamiliar to our geometric registry.';
      } else {
        drawingClue = 'Hint: Draw the approximate shape you created during registration on the SECRET THINGY canvas.';
      }
    }

    // =========================================================================
    // 4. Mandatory Checkboxes
    // =========================================================================
    const checkboxesValid = cb1 && cb2 && cb3 && cb4;

    const allCredentialsValid = usernameValid && passwordValid && drawingValid && checkboxesValid;

    // Detailed debug logging
    console.log('--- SUPERGLUEDIN LOGIN AUDIT ---', {
      usernameValid,
      passwordValid,
      drawingValid,
      checkboxesValid,
      allCredentialsValid,
      registeredUser: storedAccount.username,
      enteredUser: username,
      transformedUser: effectiveTransformedUsername,
      expectedReversedPass: expectedReversedPassword,
      drawingConfidence: drawingComparison.confidence,
    });

    setDiagnosticAudit({
      show: true,
      usernameValid,
      usernameClue,
      passwordValid,
      passwordClue,
      drawingValid,
      drawingConfidence: drawingComparison.confidence,
      drawingClue,
      checkboxesValid,
      allCredentialsValid,
    });

    // =========================================================================
    // If all login credentials pass -> Trigger the real CAPTCHA modal!
    // =========================================================================
    if (allCredentialsValid) {
      sounds.playDing();
      requireCaptcha('Final Gateway Human Clearance', () => {
        sounds.playDing();
        setLoginSuccessMessage('IDENTITY RELUCTANTLY ACCEPTED.');
        showToast('🎉 All SupergluedIn credentials and CAPTCHAs verified!', 'info');

        setTimeout(() => {
          login(storedAccount.username);
        }, 1200);
      });
    } else {
      sounds.playBuzzer();
    }
  };

  return (
    <div className="login-page-container">
      {/* Main Authentication Card */}
      <div className="login-card-wrapper auth-overhaul-card">
        {/* Top Brand Banner */}
        <div className="login-header-section">
          <div className="login-logo-title">
            <span className="logo-icon">🖇️🤡</span>
            <span className="logo-main-text">SUPERGLUEDIN</span>
          </div>
          <p className="login-tagline">
            “Connecting 0 professionals with infinite credential inconvenience since 1997.”
          </p>

          {/* Tab Switcher */}
          <div className="auth-tab-switch-row">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'register' ? 'tab-active' : ''}`}
              onClick={() => { sounds.playKeypress(); setActiveTab('register'); }}
            >
              1. CREATE ACCOUNT (START HERE)
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'login' ? 'tab-active' : ''}`}
              onClick={() => { sounds.playKeypress(); setActiveTab('login'); }}
            >
              2. SIGN IN (PUZZLE MODE)
            </button>
          </div>
        </div>

        {/* REGISTRATION TAB */}
        {activeTab === 'register' ? (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setActiveTab('login')}
          />
        ) : (
          /* SIGN IN TAB */
          <div className="auth-login-split-layout">
            {/* Left Column: Username, Password, Checkboxes, Evasive Button */}
            <div className="login-left-column">
              {/* Suspicion Meter */}
              <SuspicionMeter failedAttempts={loginAttempts} />

              {/* Progress Loading Overlay */}
              {isVerifying && (
                <div className="verifying-loading-strip">
                  <span className="spinner-glitch">⏳</span>
                  <b>{verifyStatusText}</b>
                </div>
              )}

              {/* Success Sequence Screen */}
              {loginSuccessMessage && (
                <div className="login-success-celebration">
                  <CheckCircle2 size={44} color="#00ff00" />
                  <h2>{loginSuccessMessage}</h2>
                  <p>
                    Congratulations. You have successfully proven you remember credentials in a format nobody asked for.
                  </p>
                  <small>Entering SupergluedIn corporate feeds...</small>
                </div>
              )}

              {/* Comprehensive Diagnostic Failure Box */}
              {diagnosticAudit && diagnosticAudit.show && !diagnosticAudit.allCredentialsValid && !isVerifying && (
                <div className="login-failure-box">
                  <div className="failure-head">
                    <AlertTriangle size={18} />
                    <span>AUTHENTICATION AUDIT FAILED (ATTEMPT #{loginAttempts})</span>
                  </div>

                  <div className="diagnostic-summary-grid">
                    {/* Checkbox status */}
                    <div className={`diag-item ${diagnosticAudit.checkboxesValid ? 'diag-pass' : 'diag-fail'}`}>
                      {diagnosticAudit.checkboxesValid ? '✓' : '✗'} Required Checkboxes:{' '}
                      <b>{diagnosticAudit.checkboxesValid ? '4/4 Satisfied' : 'Incomplete'}</b>
                    </div>

                    {/* Username status */}
                    <div className={`diag-item ${diagnosticAudit.usernameValid ? 'diag-pass' : 'diag-fail'}`}>
                      {diagnosticAudit.usernameValid ? '✓' : '✗'} Inverted Username:{' '}
                      <b>{diagnosticAudit.usernameValid ? 'Accepted' : 'Incorrect'}</b>
                      {diagnosticAudit.usernameClue && (
                        <div className="diag-clue">{diagnosticAudit.usernameClue}</div>
                      )}
                    </div>

                    {/* Password status */}
                    <div className={`diag-item ${diagnosticAudit.passwordValid ? 'diag-pass' : 'diag-fail'}`}>
                      {diagnosticAudit.passwordValid ? '✓' : '✗'} Password Orientation:{' '}
                      <b>{diagnosticAudit.passwordValid ? 'Reversed Match' : 'Direction Error'}</b>
                      {diagnosticAudit.passwordClue && (
                        <div className="diag-clue">{diagnosticAudit.passwordClue}</div>
                      )}
                    </div>

                    {/* Drawing status */}
                    <div className={`diag-item ${diagnosticAudit.drawingValid ? 'diag-pass' : 'diag-fail'}`}>
                      {diagnosticAudit.drawingValid ? '✓' : '✗'} Secret Shape Geometry:{' '}
                      <b>{diagnosticAudit.drawingValid ? `Verified (${diagnosticAudit.drawingConfidence}%)` : 'Discrepancy'}</b>
                      {diagnosticAudit.drawingClue && (
                        <div className="diag-clue">{diagnosticAudit.drawingClue}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Inverted text instruction */}
              <div className="inverted-instruction-banner">
                ⚠️ IMPORTANT LOGIN INSTRUCTION: USERNAME MUST BE ENTERED IN INVERTED FORM.
              </div>

              {/* Physical keyboard lockout alert */}
              {physicalKeyboardWarning && (
                <div className="physical-keyboard-warning-box">
                  <span className="warning-blinking-icon">🚫</span>
                  <b>{physicalKeyboardWarning}</b>
                </div>
              )}

              {/* Username Field */}
              <div className={`form-group ${activeField === 'username' ? 'field-active-focused' : ''}`}>
                <div className="label-with-focus-tag">
                  <label className="rage-input-label">
                    ENTER REGISTERED USERNAME:
                  </label>
                  {activeField === 'username' && (
                    <span className="typing-target-badge">◄ ACTIVE TARGET</span>
                  )}
                </div>
                <input
                  type="text"
                  value={username}
                  readOnly
                  onClick={() => setActiveField('username')}
                  onFocus={() => setActiveField('username')}
                  onKeyDown={e => { e.preventDefault(); handlePhysicalKeyAttempt(); }}
                  onPaste={e => { e.preventDefault(); handlePhysicalKeyAttempt('paste'); }}
                  onDrop={e => { e.preventDefault(); handlePhysicalKeyAttempt('drop'); }}
                  placeholder="Click here then use on-screen keyboard..."
                  className="cursed-input username-input"
                  autoComplete="off"
                />
              </div>

              {/* Password Field */}
              <div className={`form-group password-wrap ${activeField === 'password' ? 'field-active-focused' : ''}`}>
                <div className="label-with-focus-tag">
                  <label className="rage-input-label">
                    PASSWORD:
                  </label>
                  {activeField === 'password' && (
                    <span className="typing-target-badge">◄ ACTIVE TARGET</span>
                  )}
                </div>
                <div className="password-input-relative-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    readOnly
                    onClick={() => setActiveField('password')}
                    onFocus={() => setActiveField('password')}
                    onKeyDown={e => { e.preventDefault(); handlePhysicalKeyAttempt(); }}
                    onPaste={e => { e.preventDefault(); handlePhysicalKeyAttempt('paste'); }}
                    onDrop={e => { e.preventDefault(); handlePhysicalKeyAttempt('drop'); }}
                    placeholder="Click here then use on-screen keyboard..."
                    className="cursed-input"
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* On-Screen Keyboard */}
              <div className="onscreen-keyboard-section">
                <div className="section-micro-header">
                  <span>⌨️ CORPORATE INPUT ASSISTANCE SYSTEM</span>
                  <small>(Proprietary Typing Surface™)</small>
                </div>
                <InvertedKeyboard
                  onKeyPress={handleOnScreenKeyPress}
                  onBackspace={handleOnScreenBackspace}
                  onClear={handleOnScreenClear}
                  activeTargetName={activeField}
                />
              </div>

              {/* Fake Security Questionnaire */}
              <FakeSecurityQuestion />

              {/* Mandatory Checkboxes */}
              <div className="annoying-checkboxes-box">
                <div className="checkboxes-title">MANDATORY PRE-AUTHENTICATION ACKNOWLEDGMENTS:</div>
                <label className="annoying-cb-label">
                  <input type="checkbox" checked={cb1} onChange={() => toggleCheckbox(1)} />
                  <span>I confirm I remember creating this SupergluedIn account.</span>
                </label>
                <label className="annoying-cb-label">
                  <input type="checkbox" checked={cb2} onChange={() => toggleCheckbox(2)} />
                  <span>I am currently sitting professionally in my chair.</span>
                </label>
                <label className="annoying-cb-label">
                  <input type="checkbox" checked={cb3} onChange={() => toggleCheckbox(3)} />
                  <span>I accept that the Login button may relocate when approached.</span>
                </label>
                <label className="annoying-cb-label">
                  <input type="checkbox" checked={cb4} onChange={() => toggleCheckbox(4)} />
                  <span>I understand that security does not understand me.</span>
                </label>
              </div>

              {/* Evasive Login Button + Decoys Cluster */}
              <div className="login-evasive-cluster-section">
                <EvasiveLoginButton
                  onRealSubmit={executeLoginEvaluation}
                  disabled={isVerifying}
                />
              </div>

              <div className="no-account-nudge">
                <span>Forgot what you registered?</span>
                <button
                  type="button"
                  className="nudge-btn"
                  onClick={() => setActiveTab('register')}
                >
                  Create a new problem (Register again) ➔
                </button>
              </div>
            </div>

            {/* Right Column: SECRET THINGY™ Drawing Code Panel */}
            <div className="login-right-column">
              <div className="secret-thingy-panel">
                <div className="secret-thingy-border-decor">
                  <div className="secret-thingy-header">
                    <Lock size={20} className="lock-icon-blink" />
                    <span className="thingy-title">SECRET THINGY™</span>
                  </div>

                  <p className="thingy-desc">
                    Your account requires a confidential shape.<br />
                    <b>Do NOT type anything here.</b>
                  </p>

                  <div className="thingy-canvas-container">
                    <DrawingCanvas
                      title="DRAW YOUR SECRET"
                      subtitle="Please reproduce whatever you drew during registration."
                      onDrawingChange={setLoginDrawing}
                      mode="login"
                    />
                  </div>

                  <div className="thingy-footer-disclaimer">
                    <ShieldCheck size={14} color="#00ff00" />
                    <span>Geometric tolerance engine active. Redraw approximately your registered shape.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
