import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/sound';
import { CaptchaQuestion } from '../../types';

const QUESTIONS: CaptchaQuestion[] = [
  {
    id: 'mcq-deadlock',
    topic: 'OPERATING SYSTEMS & CONCURRENCY THEORY',
    question: 'A process runs concurrently with another process and both access a shared resource. Under which conditions can deadlock occur?',
    options: [
      { label: 'A', text: 'Mutual exclusion alone' },
      { label: 'B', text: 'Circular wait condition' },
      { label: 'C', text: 'Hold and wait condition' },
      { label: 'D', text: 'All of Coffman’s 4 conditions (Mutual exclusion, Hold & Wait, No Preemption, Circular wait)' },
    ],
    correctAnswer: 'D',
    explanation: 'Coffman conditions require all 4 simultaneous prerequisites for deadlock.',
  },
  {
    id: 'mcq-floyd',
    topic: 'ADVANCED GRAPH ALGORITHMS',
    question: 'What is the auxiliary space complexity of the standard Floyd-Warshall all-pairs shortest paths algorithm for a graph with V vertices?',
    options: [
      { label: 'A', text: 'O(V²)' },
      { label: 'B', text: 'O(V · E)' },
      { label: 'C', text: 'O(V³)' },
      { label: 'D', text: 'O(log V)' },
    ],
    correctAnswer: 'A',
    explanation: 'Floyd-Warshall maintains a 2D distance matrix of dimensions V x V.',
  },
  {
    id: 'mcq-byzantine',
    topic: 'DISTRIBUTED SYSTEMS FAULT TOLERANCE',
    question: 'In a Byzantine Fault Tolerant (BFT) synchronous consensus system with N nodes, what is the theoretical maximum number of arbitrary faulty/adversarial nodes F that can be tolerated?',
    options: [
      { label: 'A', text: 'F < N / 3' },
      { label: 'B', text: 'F < N / 2' },
      { label: 'C', text: 'F = 0 (Requires zero adversarial actors)' },
      { label: 'D', text: 'F ≤ √N' },
    ],
    correctAnswer: 'A',
    explanation: 'Lamport-Shostak-Pease proved consensus is impossible with 3F + 1 or fewer nodes if F are faulty.',
  },
  {
    id: 'mcq-pnp',
    topic: 'COMPUTATIONAL COMPLEXITY THEORY',
    question: 'If a deterministic polynomial-time algorithm is discovered for 3-SAT, which statement is mathematically inevitable?',
    options: [
      { label: 'A', text: 'P = NP and all NP problems can be solved in deterministic polynomial time' },
      { label: 'B', text: 'RSA encryption remains unbroken' },
      { label: 'C', text: 'The Travelling Salesman Problem remains strictly non-computable' },
      { label: 'D', text: 'Nothing happens, 3-SAT is in P anyway' },
    ],
    correctAnswer: 'A',
    explanation: '3-SAT is NP-complete. By Cook-Levin reduction, a polynomial solution collapses NP into P.',
  }
];

interface McqCaptchaProps {
  onSuccess: () => void;
  onFail: (msg: string) => void;
  failureMessage: string | null;
}

export const McqCaptcha: React.FC<McqCaptchaProps> = ({
  onSuccess,
  onFail,
  failureMessage,
}) => {
  const [qIndex, setQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timerSec, setTimerSec] = useState(25);

  const currentQ = QUESTIONS[qIndex];

  // Countdown timer for extra rage
  useEffect(() => {
    if (timerSec <= 0) {
      sounds.playBuzzer();
      onFail('TIME EXPIRED! A TRUE HUMAN CALCULATES ADVANCED ALGORITHMS IN UNDER 25 SECONDS.');
      setTimerSec(25);
      setQIndex(prev => (prev + 1) % QUESTIONS.length);
      setSelectedOption(null);
      return;
    }

    const interval = setInterval(() => {
      setTimerSec(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerSec, onFail]);

  const handleSelect = (label: string) => {
    sounds.playKeypress();
    setSelectedOption(label);
  };

  const handleVerify = () => {
    if (!selectedOption) {
      onFail('PLEASE SELECT AN ANSWER TO PROVE YOUR INTELLECTUAL HUMAN CONSCIOUSNESS.');
      return;
    }

    if (selectedOption === currentQ.correctAnswer) {
      sounds.playDing();
      onSuccess();
    } else {
      sounds.playBuzzer();
      onFail(
        `INCORRECT! Option (${selectedOption}) reveals synthetic reasoning. Correct was (${currentQ.correctAnswer}): ${currentQ.explanation}`
      );
      // Advance question
      setQIndex(prev => (prev + 1) % QUESTIONS.length);
      setSelectedOption(null);
      setTimerSec(25);
    }
  };

  return (
    <div className="mcq-captcha-card">
      <div className="mcq-header-box">
        <div className="mcq-topic-tag">🎓 {currentQ.topic}</div>
        <div className="mcq-timer-badge">
          ⏳ REASONING WINDOW: <b>{timerSec}s</b>
        </div>
      </div>

      <div className="mcq-subtitle-humor">
        *Why are you solving graduate-level computer science theory to click a button? Because we care about data integrity.
      </div>

      <h3 className="mcq-question-text">
        {currentQ.question}
      </h3>

      {failureMessage && (
        <div className="captcha-error-callout">
          <span className="error-icon">❌</span>
          <span className="error-text">{failureMessage}</span>
        </div>
      )}

      <div className="mcq-options-list">
        {currentQ.options.map(opt => {
          const isSelected = selectedOption === opt.label;
          return (
            <div
              key={opt.label}
              className={`mcq-option-row ${isSelected ? 'mcq-opt-selected' : ''}`}
              onClick={() => handleSelect(opt.label)}
            >
              <div className="mcq-label-badge">{opt.label}</div>
              <div className="mcq-option-text">{opt.text}</div>
            </div>
          );
        })}
      </div>

      <div className="mcq-footer-actions">
        <button
          className="mcq-skip-btn"
          onClick={() => {
            sounds.playBoing();
            setQIndex(prev => (prev + 1) % QUESTIONS.length);
            setSelectedOption(null);
            setTimerSec(25);
            onFail('QUESTION SKIPPED. INTELLECTUAL DEDUCTIONS APPLIED.');
          }}
        >
          ⏭️ GIVE ME AN EVEN HARDER QUESTION
        </button>

        <button
          className="mcq-submit-btn"
          onClick={handleVerify}
        >
          CONFIRM THEOREM & PROCEED
        </button>
      </div>
    </div>
  );
};
