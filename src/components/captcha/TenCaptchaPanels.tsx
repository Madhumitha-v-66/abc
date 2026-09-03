import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/sound';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface TenCaptchaPanelsProps {
  onStatusChange: (captchasValid: boolean, correctCount: number, details: Record<string, boolean>) => void;
}

// Q1 (Traffic lights) items
const TRAFFIC_ITEMS = [
  { id: 1, label: '3-Lens Highway Traffic Signal (Green Active)', isCorrect: true, emoji: '🚦' },
  { id: 2, label: 'Traditional Paper Lantern', isCorrect: false, emoji: '🏮' },
  { id: 3, label: 'Illuminated Pedestrian Crosswalk Beacon', isCorrect: true, emoji: '🚸' },
  { id: 4, label: 'Glow Stick in Nightclub', isCorrect: false, emoji: '🪄' },
  { id: 5, label: 'Overhead Gantry Lane Control Signal', isCorrect: true, emoji: '🚥' },
  { id: 6, label: 'Maritime Fog Lighthouse', isCorrect: false, emoji: '🚨' },
];

// Q2 (Bicycles) items
const BIKE_ITEMS = [
  { id: 1, label: 'Dual-Gear Road Racing Bicycle', isCorrect: true, emoji: '🚲' },
  { id: 2, label: 'Heavyweight Combustion Motorcycle (1200cc)', isCorrect: false, emoji: '🏍️' },
  { id: 3, label: 'All-Terrain Knobby Tire Mountain Bicycle', isCorrect: true, emoji: '🚵' },
  { id: 4, label: 'Victorian Era Penny-Farthing Bicycle', isCorrect: true, emoji: '🚴' },
  { id: 5, label: 'Lithium-Powered Kick Scooter', isCorrect: false, emoji: '🛴' },
  { id: 6, label: 'Supermarket Wire Grocery Cart', isCorrect: false, emoji: '🛒' },
];

export const TenCaptchaPanels: React.FC<TenCaptchaPanelsProps> = ({ onStatusChange }) => {
  // Independent states for all 10 CAPTCHAs
  const [q1Selected, setQ1Selected] = useState<number[]>([]);
  const [q2Selected, setQ2Selected] = useState<number[]>([]);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [q4Answer, setQ4Answer] = useState<string | null>(null);
  const [q5Answer, setQ5Answer] = useState<string | null>(null);
  const [q6Answer, setQ6Answer] = useState<string | null>(null);
  const [q7Answer, setQ7Answer] = useState<string | null>(null);
  const [q8Answer, setQ8Answer] = useState<string | null>(null);
  const [q9Answer, setQ9Answer] = useState<string | null>(null);
  const [q10Answer, setQ10Answer] = useState<string | null>(null);

  // Evaluate correctness of each CAPTCHA independently
  const isQ1Correct =
    q1Selected.includes(1) &&
    q1Selected.includes(3) &&
    q1Selected.includes(5) &&
    !q1Selected.includes(2) &&
    !q1Selected.includes(4) &&
    !q1Selected.includes(6);

  const isQ2Correct =
    q2Selected.includes(1) &&
    q2Selected.includes(3) &&
    q2Selected.includes(4) &&
    !q2Selected.includes(2) &&
    !q2Selected.includes(5) &&
    !q2Selected.includes(6);

  // Q3: Boolean material implication: (P => Q) <=> (~P or Q) [Option B]
  const isQ3Correct = q3Answer === 'B';
  // Q4: Calculus: integral_0^inf x^2 e^(-x) dx = Gamma(3) = 2! = 2 [Option C]
  const isQ4Correct = q4Answer === 'C';
  // Q5: Differential Equations: dy/dx + y = e^x => y(x) = (1/2)e^x + C e^(-x) [Option A]
  const isQ5Correct = q5Answer === 'A';
  // Q6: Laplace: L{e^(at) sin(wt)} = w / ((s-a)^2 + w^2) [Option A]
  const isQ6Correct = q6Answer === 'A';
  // Q7: Linear Algebra: det([2 1; 1 2]) = 4 - 1 = 3 [Option D]
  const isQ7Correct = q7Answer === 'D';
  // Q8: Electrical Eng: series RLC resonant freq w_0 = 1 / sqrt(LC) [Option B]
  const isQ8Correct = q8Answer === 'B';
  // Q9: Probability: 3 heads in 5 fair coin flips: C(5,3)/32 = 10/32 = 5/16 [Option C]
  const isQ9Correct = q9Answer === 'C';
  // Q10: Cook-Levin 1971 NP-Complete: Boolean Satisfiability (3-SAT) [Option C]
  const isQ10Correct = q10Answer === 'C';

  const details: Record<string, boolean> = {
    'CAPTCHA #01': isQ1Correct,
    'CAPTCHA #02': isQ2Correct,
    'CAPTCHA #03': isQ3Correct,
    'CAPTCHA #04': isQ4Correct,
    'CAPTCHA #05': isQ5Correct,
    'CAPTCHA #06': isQ6Correct,
    'CAPTCHA #07': isQ7Correct,
    'CAPTCHA #08': isQ8Correct,
    'CAPTCHA #09': isQ9Correct,
    'CAPTCHA #10': isQ10Correct,
  };

  const correctCount = Object.values(details).filter(Boolean).length;
  const allCaptchasValid = correctCount === 10;

  // Inform parent of state changes
  useEffect(() => {
    onStatusChange(allCaptchasValid, correctCount, details);
  }, [allCaptchasValid, correctCount]);

  const toggleQ1 = (id: number) => {
    sounds.playKeypress();
    setQ1Selected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const toggleQ2 = (id: number) => {
    sounds.playKeypress();
    setQ2Selected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const getProgressVibe = () => {
    if (correctCount === 0) return 'HUMAN PROBABILITY: STATISTICALLY ZERO';
    if (correctCount <= 2) return 'PRELIMINARY GUESSWORK DETECTED';
    if (correctCount <= 4) return 'CAPTCHA 3/10 VERIFIED - SYSTEM GROWING IRRITATED';
    if (correctCount <= 6) return 'ACADEMIC COMPETENCE QUESTIONABLE';
    if (correctCount <= 8) return 'CAPTCHA 7/10 ACCEPTED RELUCTANTLY';
    if (correctCount === 9) return '9/10. THE SYSTEM IS BECOMING SUSPICIOUS.';
    return '10/10 CONCURRENTLY ACCURATE. AUDIT PASSED UNDER PROTEST.';
  };

  const renderPanelBadge = (isCorrect: boolean, isAnswered: boolean) => {
    if (isCorrect) {
      return (
        <span className="panel-status-tag tag-verified">
          <CheckCircle2 size={12} /> VERIFIED
        </span>
      );
    }
    if (isAnswered) {
      return (
        <span className="panel-status-tag tag-incorrect">
          <AlertCircle size={12} /> INCORRECT
        </span>
      );
    }
    return (
      <span className="panel-status-tag tag-pending">
        <Clock size={12} /> PENDING
      </span>
    );
  };

  return (
    <div className="ten-captchas-section-container">
      {/* Header Banner */}
      <div className="ten-captchas-header-banner">
        <div className="badge-flashing-danger">⚡ MANDATORY 10-STAGE CITIZENSHIP EXAMINATION</div>
        <h3 className="ten-captchas-title">CONCURRENT CAPTCHA VERIFICATION WALL</h3>
        <p className="ten-captchas-desc">
          “10 QUESTIONS REQUIRED • ALL 10 MUST BE CONCURRENTLY ACCURATE • DO NOT REFRESH”
        </p>

        {/* Global Progress Bar */}
        <div className="captcha-wall-tracker-card">
          <div className="tracker-text-row">
            <span className="tracker-title">CAPTCHA COMPLETION STATUS:</span>
            <span className="tracker-score font-pixel text-yellow">[{correctCount} / 10 VERIFIED]</span>
          </div>
          <div className="tracker-track">
            <div
              className="tracker-fill"
              style={{ width: `${(correctCount / 10) * 100}%` }}
            />
          </div>
          <div className="tracker-vibe-msg font-pixel text-cyan">
            » {getProgressVibe()} «
          </div>
        </div>
      </div>

      {/* Grid of 10 CAPTCHA Panels */}
      <div className="captchas-panels-stack">
        {/* =========================================================================
            CAPTCHA #01: Image Matching (Traffic Lights)
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ1Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #01</span>
            <span className="captcha-category-pill">IMAGE MATCHING</span>
            {renderPanelBadge(isQ1Correct, q1Selected.length > 0)}
          </div>
          <h4 className="captcha-q-title">SELECT ALL IMAGES CONTAINING A TRAFFIC LIGHT:</h4>
          <small className="captcha-q-instruction">(Guidance: Automotive signal apparatus only)</small>

          <div className="captcha-image-grid-6">
            {TRAFFIC_ITEMS.map(item => {
              const isSelected = q1Selected.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`captcha-card-opt ${isSelected ? 'opt-selected' : ''}`}
                  onClick={() => toggleQ1(item.id)}
                >
                  <span className="opt-check-symbol">{isSelected ? '☑' : '☐'}</span>
                  <div className="opt-emoji">{item.emoji}</div>
                  <span className="opt-text">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            CAPTCHA #02: Image Matching (Bicycles)
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ2Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #02</span>
            <span className="captcha-category-pill">IMAGE MATCHING</span>
            {renderPanelBadge(isQ2Correct, q2Selected.length > 0)}
          </div>
          <h4 className="captcha-q-title">SELECT ALL IMAGES CONTAINING A BICYCLE:</h4>
          <small className="captcha-q-instruction">(Guidance: Pure human-powered two-wheelers)</small>

          <div className="captcha-image-grid-6">
            {BIKE_ITEMS.map(item => {
              const isSelected = q2Selected.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`captcha-card-opt ${isSelected ? 'opt-selected' : ''}`}
                  onClick={() => toggleQ2(item.id)}
                >
                  <span className="opt-check-symbol">{isSelected ? '☑' : '☐'}</span>
                  <div className="opt-emoji">{item.emoji}</div>
                  <span className="opt-text">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            CAPTCHA #03: Digital Electronics & Boolean Logic
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ3Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #03</span>
            <span className="captcha-category-pill">DIGITAL ELECTRONICS / LOGIC</span>
            {renderPanelBadge(isQ3Correct, q3Answer !== null)}
          </div>
          <h4 className="captcha-q-title">BOOLEAN LOGIC: Which proposition is logically equivalent to (P → Q)?</h4>
          <div className="captcha-mcq-row-stack">
            {[
              { id: 'A', text: '¬P ∧ Q' },
              { id: 'B', text: '¬P ∨ Q' },
              { id: 'C', text: 'P ∧ ¬Q' },
              { id: 'D', text: '¬(P ∨ Q)' },
            ].map(opt => (
              <label key={opt.id} className={`captcha-radio-choice ${q3Answer === opt.id ? 'choice-active' : ''}`}>
                <input
                  type="radio"
                  name="q3_captcha"
                  checked={q3Answer === opt.id}
                  onChange={() => { sounds.playKeypress(); setQ3Answer(opt.id); }}
                />
                <span className="choice-marker">[{opt.id}]</span>
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CAPTCHA #04: Complex Integration
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ4Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #04</span>
            <span className="captcha-category-pill">COMPLEX INTEGRATION</span>
            {renderPanelBadge(isQ4Correct, q4Answer !== null)}
          </div>
          <h4 className="captcha-q-title">CALCULUS: Evaluate the improper definite integral:</h4>
          <div className="latex-equation-box">
            ∫₀^∞ x² · e⁻ˣ dx
          </div>
          <div className="captcha-mcq-row-stack">
            {[
              { id: 'A', text: '1 / 2' },
              { id: 'B', text: '1' },
              { id: 'C', text: '2  (via Γ(3) = 2!)' },
              { id: 'D', text: 'e² - 1' },
            ].map(opt => (
              <label key={opt.id} className={`captcha-radio-choice ${q4Answer === opt.id ? 'choice-active' : ''}`}>
                <input
                  type="radio"
                  name="q4_captcha"
                  checked={q4Answer === opt.id}
                  onChange={() => { sounds.playKeypress(); setQ4Answer(opt.id); }}
                />
                <span className="choice-marker">[{opt.id}]</span>
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CAPTCHA #05: Differential Equations
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ5Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #05</span>
            <span className="captcha-category-pill">DIFFERENTIAL EQUATIONS</span>
            {renderPanelBadge(isQ5Correct, q5Answer !== null)}
          </div>
          <h4 className="captcha-q-title">DIFFERENTIAL EQUATIONS: Find the general solution to dy/dx + y = e^x:</h4>
          <div className="captcha-mcq-row-stack">
            {[
              { id: 'A', text: 'y(x) = (1/2)e^x + C · e^(-x)' },
              { id: 'B', text: 'y(x) = e^x + C · e^x' },
              { id: 'C', text: 'y(x) = x · e^x + C' },
              { id: 'D', text: 'y(x) = (1/2)e^(-x) + C' },
            ].map(opt => (
              <label key={opt.id} className={`captcha-radio-choice ${q5Answer === opt.id ? 'choice-active' : ''}`}>
                <input
                  type="radio"
                  name="q5_captcha"
                  checked={q5Answer === opt.id}
                  onChange={() => { sounds.playKeypress(); setQ5Answer(opt.id); }}
                />
                <span className="choice-marker">[{opt.id}]</span>
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CAPTCHA #06: Laplace Transforms
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ6Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #06</span>
            <span className="captcha-category-pill">LAPLACE TRANSFORMS</span>
            {renderPanelBadge(isQ6Correct, q6Answer !== null)}
          </div>
          <h4 className="captcha-q-title">TRANSFORMS: Determine ℒ&#123;e^(at) · sin(ωt)&#125; for s &gt; a:</h4>
          <div className="captcha-mcq-row-stack">
            {[
              { id: 'A', text: 'ω / [ (s - a)² + ω² ]' },
              { id: 'B', text: '(s - a) / [ (s - a)² + ω² ]' },
              { id: 'C', text: 'ω / (s² + ω²)' },
              { id: 'D', text: 'a / [ (s - ω)² + a² ]' },
            ].map(opt => (
              <label key={opt.id} className={`captcha-radio-choice ${q6Answer === opt.id ? 'choice-active' : ''}`}>
                <input
                  type="radio"
                  name="q6_captcha"
                  checked={q6Answer === opt.id}
                  onChange={() => { sounds.playKeypress(); setQ6Answer(opt.id); }}
                />
                <span className="choice-marker">[{opt.id}]</span>
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CAPTCHA #07: Matrices & Linear Algebra
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ7Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #07</span>
            <span className="captcha-category-pill">MATRICES & LINEAR ALGEBRA</span>
            {renderPanelBadge(isQ7Correct, q7Answer !== null)}
          </div>
          <h4 className="captcha-q-title">LINEAR ALGEBRA: Compute the determinant of matrix M = [[2, 1], [1, 2]]:</h4>
          <div className="latex-equation-box">
            det [[2, 1], [1, 2]] = (2·2) - (1·1) = ?
          </div>
          <div className="captcha-mcq-row-stack">
            {[
              { id: 'A', text: '0 (Singular matrix)' },
              { id: 'B', text: '1' },
              { id: 'C', text: '5' },
              { id: 'D', text: '3' },
            ].map(opt => (
              <label key={opt.id} className={`captcha-radio-choice ${q7Answer === opt.id ? 'choice-active' : ''}`}>
                <input
                  type="radio"
                  name="q7_captcha"
                  checked={q7Answer === opt.id}
                  onChange={() => { sounds.playKeypress(); setQ7Answer(opt.id); }}
                />
                <span className="choice-marker">[{opt.id}]</span>
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CAPTCHA #08: Electrical Engineering (RLC Circuits)
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ8Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #08</span>
            <span className="captcha-category-pill">ELECTRICAL ENGINEERING</span>
            {renderPanelBadge(isQ8Correct, q8Answer !== null)}
          </div>
          <h4 className="captcha-q-title">CIRCUITS: For a series RLC circuit, what is the resonant angular frequency ω₀?</h4>
          <div className="captcha-mcq-row-stack">
            {[
              { id: 'A', text: 'ω₀ = R / (2L)' },
              { id: 'B', text: 'ω₀ = 1 / √(L · C)' },
              { id: 'C', text: 'ω₀ = √(L / C)' },
              { id: 'D', text: 'ω₀ = 2π / √(L · C)' },
            ].map(opt => (
              <label key={opt.id} className={`captcha-radio-choice ${q8Answer === opt.id ? 'choice-active' : ''}`}>
                <input
                  type="radio"
                  name="q8_captcha"
                  checked={q8Answer === opt.id}
                  onChange={() => { sounds.playKeypress(); setQ8Answer(opt.id); }}
                />
                <span className="choice-marker">[{opt.id}]</span>
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CAPTCHA #09: Probability & Combinatorics
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ9Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #09</span>
            <span className="captcha-category-pill">PROBABILITY / COMBINATORICS</span>
            {renderPanelBadge(isQ9Correct, q9Answer !== null)}
          </div>
          <h4 className="captcha-q-title">PROBABILITY: A fair coin is tossed 5 times. What is the probability of obtaining EXACTLY 3 heads?</h4>
          <div className="captcha-mcq-row-stack">
            {[
              { id: 'A', text: '1 / 2 (50%)' },
              { id: 'B', text: '3 / 5 (60%)' },
              { id: 'C', text: '5 / 16 (31.25% via C(5,3)/32)' },
              { id: 'D', text: '1 / 8 (12.5%)' },
            ].map(opt => (
              <label key={opt.id} className={`captcha-radio-choice ${q9Answer === opt.id ? 'choice-active' : ''}`}>
                <input
                  type="radio"
                  name="q9_captcha"
                  checked={q9Answer === opt.id}
                  onChange={() => { sounds.playKeypress(); setQ9Answer(opt.id); }}
                />
                <span className="choice-marker">[{opt.id}]</span>
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            CAPTCHA #10: Computer Science & Theory
            ========================================================================= */}
        <div className={`captcha-box-card ${isQ10Correct ? 'card-verified' : ''}`}>
          <div className="card-top-row">
            <span className="captcha-number-badge">CAPTCHA #10</span>
            <span className="captcha-category-pill diff-why-badge">THEORETICAL COMPUTER SCIENCE</span>
            {renderPanelBadge(isQ10Correct, q10Answer !== null)}
          </div>
          <h4 className="captcha-q-title">NP-COMPLETENESS: Which fundamental decision problem was proven NP-Complete in the Cook-Levin Theorem (1971)?</h4>
          <div className="captcha-mcq-row-stack">
            {[
              { id: 'A', text: 'Primality Testing (AKS Algorithm)' },
              { id: 'B', text: 'All-Pairs Shortest Path (Floyd-Warshall)' },
              { id: 'C', text: 'Boolean Satisfiability (SAT / 3-SAT)' },
              { id: 'D', text: 'Minimum Spanning Tree (Kruskal)' },
            ].map(opt => (
              <label key={opt.id} className={`captcha-radio-choice ${q10Answer === opt.id ? 'choice-active' : ''}`}>
                <input
                  type="radio"
                  name="q10_captcha"
                  checked={q10Answer === opt.id}
                  onChange={() => { sounds.playKeypress(); setQ10Answer(opt.id); }}
                />
                <span className="choice-marker">[{opt.id}]</span>
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
