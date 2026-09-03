import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { sounds } from '../utils/sound';

export type SessionStatus = 'in_progress' | 'analyzing' | 'passed' | 'failed';

interface CaptchaContextType {
  isOpen: boolean;
  actionTitle: string;
  totalChallenges: number;
  currentChallengeNumber: number;
  activeChallengeId: number;
  sessionStatus: SessionStatus;
  analyzingMessage: string;
  score: number;
  percentage: number;
  passThresholdPercent: number;
  requireCaptcha: (actionTitle: string, onSuccess: () => void) => void;
  submitChallengeAnswer: (isCorrect: boolean) => void;
  retrySession: () => void;
  cancelCaptcha: () => void;
}

const CaptchaContext = createContext<CaptchaContextType | undefined>(undefined);

// Shuffle array helper
function createRandomSequence(length = 8, poolSize = 12): number[] {
  const pool = Array.from({ length: poolSize }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, length);
}

export const CaptchaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [totalChallenges, setTotalChallenges] = useState(8);
  const [currentChallengeNumber, setCurrentChallengeNumber] = useState(1);
  const [activeChallengeId, setActiveChallengeId] = useState(0);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('in_progress');
  const [analyzingMessage, setAnalyzingMessage] = useState('');
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const passThresholdPercent = 75;

  const sequenceRef = useRef<number[]>([]);
  const answersRef = useRef<boolean[]>([]);
  const pendingCallbackRef = useRef<(() => void) | null>(null);

  const startSession = useCallback((title: string, callback: () => void) => {
    sounds.playDing();
    setActionTitle(title);
    pendingCallbackRef.current = callback;

    const challengeCount = 8; // 8 challenges in session (6/8 = 75% required)
    const seq = createRandomSequence(challengeCount, 12);
    sequenceRef.current = seq;
    answersRef.current = [];

    setTotalChallenges(challengeCount);
    setCurrentChallengeNumber(1);
    setActiveChallengeId(seq[0]);
    setScore(0);
    setPercentage(0);
    setSessionStatus('in_progress');
    setIsOpen(true);
  }, []);

  const requireCaptcha = useCallback((title: string, onSuccess: () => void) => {
    startSession(title, onSuccess);
  }, [startSession]);

  const submitChallengeAnswer = useCallback((isCorrect: boolean) => {
    answersRef.current.push(isCorrect);
    const curr = answersRef.current.length;
    const total = sequenceRef.current.length;

    if (curr < total) {
      // Smooth, annoying transition to next challenge without revealing correctness
      setSessionStatus('analyzing');
      const messages = [
        'Analyzing mouse curvature...',
        'Consulting civic biometric model...',
        'Re-calibrating human suspicion...',
        'Auditing pupil dilation...',
        'Verifying biological impedance...',
        'Checking emotional stability...',
      ];
      setAnalyzingMessage(messages[curr % messages.length]);

      setTimeout(() => {
        setCurrentChallengeNumber(curr + 1);
        setActiveChallengeId(sequenceRef.current[curr]);
        setSessionStatus('in_progress');
      }, 300);
    } else {
      // Completed all challenges in the session!
      setSessionStatus('analyzing');
      setAnalyzingMessage('Synthesizing final humanity audit (Threshold: 75%)...');

      setTimeout(() => {
        const correctCount = answersRef.current.filter(Boolean).length;
        const passRatio = (correctCount / total) * 100;
        const roundedRatio = Math.round(passRatio);

        setScore(correctCount);
        setPercentage(roundedRatio);

        if (roundedRatio >= passThresholdPercent) {
          // PASS!
          setSessionStatus('passed');
          sounds.playDing();

          setTimeout(() => {
            setIsOpen(false);
            if (pendingCallbackRef.current) {
              const cb = pendingCallbackRef.current;
              pendingCallbackRef.current = null;
              cb();
            }
          }, 1400);
        } else {
          // FAIL!
          setSessionStatus('failed');
          sounds.playBuzzer();
        }
      }, 700);
    }
  }, [passThresholdPercent]);

  const retrySession = useCallback(() => {
    sounds.playDing();
    const challengeCount = 8;
    const seq = createRandomSequence(challengeCount, 12);
    sequenceRef.current = seq;
    answersRef.current = [];

    setTotalChallenges(challengeCount);
    setCurrentChallengeNumber(1);
    setActiveChallengeId(seq[0]);
    setScore(0);
    setPercentage(0);
    setSessionStatus('in_progress');
  }, []);

  const cancelCaptcha = useCallback(() => {
    sounds.playBuzzer();
    setIsOpen(false);
    pendingCallbackRef.current = null;
    answersRef.current = [];
  }, []);

  return (
    <CaptchaContext.Provider
      value={{
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
        requireCaptcha,
        submitChallengeAnswer,
        retrySession,
        cancelCaptcha,
      }}
    >
      {children}
    </CaptchaContext.Provider>
  );
};

export const useCaptcha = (): CaptchaContextType => {
  const ctx = useContext(CaptchaContext);
  if (!ctx) {
    throw new Error('useCaptcha must be used within a CaptchaProvider');
  }
  return ctx;
};
