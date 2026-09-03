import React from 'react';
import { useCaptcha } from '../../context/CaptchaContext';
import { RealCaptchaChallenge } from './RealCaptchaChallenge';
import { ShieldAlert, CheckCircle2, XCircle, X, RotateCcw } from 'lucide-react';

export const CaptchaModal: React.FC = () => {
  const {
    isOpen,
    actionTitle,
    totalChallenges,
    currentChallengeNumber,
    activeChallengeId,
    sessionStatus,
    analyzingMessage,
    score,
    percentage,
    passThresholdPercent,
    submitChallengeAnswer,
    retrySession,
    cancelCaptcha,
  } = useCaptcha();

  if (!isOpen) return null;

  // Calculate progress percent
  const progressPercent = Math.round(((currentChallengeNumber - 1) / totalChallenges) * 100);

  return (
    <div className="captcha-modal-overlay">
      <div className="captcha-modal-window real-captcha-window">
        {/* Top Header */}
        <div className="captcha-window-header">
          <div className="header-left">
            <ShieldAlert className="shield-icon-flashing" size={24} />
            <span className="header-main-title font-impact">
              HUMAN VERIFICATION REQUIRED
            </span>
          </div>
          <button
            className="captcha-close-x"
            onClick={cancelCaptcha}
            title="Dismiss verification"
          >
            <X size={18} />
          </button>
        </div>

        {/* Subheader Banner */}
        <div className="captcha-sub-banner">
          <div className="sub-tag">ACTION INTERRUPTED: <b>{actionTitle.toUpperCase()}</b></div>
          <div className="sub-motto">“Please verify that you are a human professional.”</div>
        </div>

        {/* Body Content based on sessionStatus */}
        <div className="captcha-body-scroll single-challenge-body-scroll">
          {sessionStatus === 'in_progress' && (
            <RealCaptchaChallenge
              key={`${activeChallengeId}-${currentChallengeNumber}`}
              challengeIndex={activeChallengeId}
              stepNumber={currentChallengeNumber}
              totalSteps={totalChallenges}
              onSubmitAnswer={submitChallengeAnswer}
            />
          )}

          {sessionStatus === 'analyzing' && (
            <div className="captcha-analyzing-screen">
              <div className="spinner-glitch-large">⏳</div>
              <h3 className="analyzing-heading">ANALYZING RESPONSE...</h3>
              <p className="analyzing-subtext">{analyzingMessage}</p>
              <div className="progress-mini-row">
                <span>Progress: {currentChallengeNumber} / {totalChallenges}</span>
              </div>
            </div>
          )}

          {sessionStatus === 'passed' && (
            <div className="captcha-result-card result-pass">
              <CheckCircle2 size={54} color="#00ff00" className="result-icon-bounce" />
              <h2>HUMANITY ACCEPTED.</h2>
              <p className="result-score-line">
                Verification Score: <b>{score} / {totalChallenges}</b> ({percentage}% — Required: {passThresholdPercent}%)
              </p>
              <p className="result-flavor-text">
                Your networking activity has been certified as biological. Resuming your requested action...
              </p>
              <div className="result-loading-dot">● ● ●</div>
            </div>
          )}

          {sessionStatus === 'failed' && (
            <div className="captcha-result-card result-fail">
              <XCircle size={54} color="#ff0000" className="result-icon-shake" />
              <h2>VERIFICATION FAILED.</h2>
              <p className="result-score-line">
                Verification Score: <b>{score} / {totalChallenges}</b> ({percentage}% — Required: {passThresholdPercent}%)
              </p>
              <p className="result-flavor-text">
                Security detected automated or suspicious tendencies. You did not achieve the required 75% accuracy threshold.
              </p>
              <button
                type="button"
                className="captcha-retry-btn"
                onClick={retrySession}
              >
                <RotateCcw size={18} />
                <span>RETRY VERIFICATION (NEW SESSION)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer: Real-time progress bar (always visible during session) */}
        <div className="captcha-window-footer">
          <div className="footer-progress-container">
            <div className="progress-label-row">
              <span className="font-pixel">PROGRESS: {Math.min(currentChallengeNumber, totalChallenges)} / {totalChallenges}</span>
              <span>Pass threshold: {passThresholdPercent}%</span>
            </div>
            <div className="footer-progress-track">
              <div
                className="footer-progress-fill"
                style={{ width: `${sessionStatus === 'passed' ? 100 : progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
