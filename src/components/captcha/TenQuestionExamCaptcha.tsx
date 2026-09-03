import React, { useState } from 'react';
import { sounds } from '../../utils/sound';
import { RotateCcw } from 'lucide-react';

interface TenQuestionExamProps {
  onSuccess: () => void;
  onFail?: (msg: string) => void;
}

// Q1 & Q2 Image options (rendered cleanly with emojis & descriptions)
const TRAFFIC_LIGHT_ITEMS = [
  { id: 1, label: 'Standard 3-color traffic light (Green on)', isTraffic: true, emoji: '🚦' },
  { id: 2, label: 'Street lamp emitting yellow light', isTraffic: false, emoji: '🏮' },
  { id: 3, label: 'Pedestrian countdown signal', isTraffic: true, emoji: '🚸' },
  { id: 4, label: 'Glow stick at a rave', isTraffic: false, emoji: '🪄' },
  { id: 5, label: 'Highway overhead signal gantry', isTraffic: true, emoji: '🚥' },
  { id: 6, label: 'Lighthouse on stormy cliff', isTraffic: false, emoji: '🚨' },
];

const BICYCLE_ITEMS = [
  { id: 1, label: 'Standard road bicycle with drop bars', isBike: true, emoji: '🚲' },
  { id: 2, label: 'Motorcycle with 1000cc combustion engine', isBike: false, emoji: '🏍️' },
  { id: 3, label: 'Mountain bike with knobby tires', isBike: true, emoji: '🚵' },
  { id: 4, label: 'Vintage high-wheel Penny-farthing', isBike: true, emoji: '🚴' },
  { id: 5, label: 'Electric kick scooter with battery', isBike: false, emoji: '🛴' },
  { id: 6, label: 'Shopping cart with broken wheel', isBike: false, emoji: '🛒' },
];

export const TenQuestionExamCaptcha: React.FC<TenQuestionExamProps> = ({
  onSuccess,
}) => {
  // Answers state
  const [selectedQ1, setSelectedQ1] = useState<number[]>([]);
  const [selectedQ2, setSelectedQ2] = useState<number[]>([]);
  const [selectedQ3, setSelectedQ3] = useState<string | null>(null);
  const [selectedQ4, setSelectedQ4] = useState<string | null>(null);
  const [selectedQ5, setSelectedQ5] = useState<string | null>(null);
  const [selectedQ6, setSelectedQ6] = useState<string | null>(null);
  const [selectedQ7, setSelectedQ7] = useState<string | null>(null);
  const [selectedQ8, setSelectedQ8] = useState<string | null>(null);
  const [selectedQ9, setSelectedQ9] = useState<string | null>(null);
  const [selectedQ10, setSelectedQ10] = useState<string | null>(null);

  // Failure modal state
  const [failureNotice, setFailureNotice] = useState<{
    correctCount: number;
    quote: string;
    show: boolean;
  } | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Calculate completion count (0 to 10)
  const calculateCompletion = () => {
    let count = 0;
    if (selectedQ1.length > 0) count++;
    if (selectedQ2.length > 0) count++;
    if (selectedQ3 !== null) count++;
    if (selectedQ4 !== null) count++;
    if (selectedQ5 !== null) count++;
    if (selectedQ6 !== null) count++;
    if (selectedQ7 !== null) count++;
    if (selectedQ8 !== null) count++;
    if (selectedQ9 !== null) count++;
    if (selectedQ10 !== null) count++;
    return count;
  };

  const completedCount = calculateCompletion();

  // Evaluation logic
  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playDing();
    setAttempts(prev => prev + 1);

    // Q1: items 1, 3, 5 are traffic lights
    const q1Correct = selectedQ1.includes(1) && selectedQ1.includes(3) && selectedQ1.includes(5) && !selectedQ1.includes(2) && !selectedQ1.includes(4) && !selectedQ1.includes(6);
    // Q2: items 1, 3, 4 are bicycles
    const q2Correct = selectedQ2.includes(1) && selectedQ2.includes(3) && selectedQ2.includes(4) && !selectedQ2.includes(2) && !selectedQ2.includes(5) && !selectedQ2.includes(6);
    // Q3 (Logic): Material implication (P => Q) is equivalent to (!P or Q) -> option B
    const q3Correct = selectedQ3 === 'B';
    // Q4 (Calculus): ∫_0^∞ x^2 e^(-x) dx = Gamma(3) = 2! = 2 -> option C
    const q4Correct = selectedQ4 === 'C';
    // Q5 (Laplace Transform): L{e^(at) sin(ωt)} = ω / ((s - a)^2 + ω^2) -> option A
    const q5Correct = selectedQ5 === 'A';
    // Q6 (Electrical Eng): Resonant angular frequency of series RLC ω_0 = 1 / sqrt(LC) -> option B
    const q6Correct = selectedQ6 === 'B';
    // Q7 (Computer Science): Worst-case time complexity of searching in a self-balancing AVL tree is O(log n) -> option A
    const q7Correct = selectedQ7 === 'A';
    // Q8 (Physics): Lorentz force law F = q(E + v x B) -> option D
    const q8Correct = selectedQ8 === 'D';
    // Q9 (Chemistry/Thermo): Condition for thermodynamic spontaneity at constant T & P is ΔG < 0 -> option A
    const q9Correct = selectedQ9 === 'A';
    // Q10 (PhD Level): Which problem was proven NP-Complete in the landmark Cook-Levin theorem? 3-SAT / Boolean Satisfiability -> option C
    const q10Correct = selectedQ10 === 'C';

    const results = [
      q1Correct, q2Correct, q3Correct, q4Correct, q5Correct,
      q6Correct, q7Correct, q8Correct, q9Correct, q10Correct
    ];

    const correctCount = results.filter(Boolean).length;

    if (correctCount === 10) {
      sounds.playDing();
      onSuccess();
    } else {
      sounds.playBuzzer();
      const quotes = [
        'Unfortunately, 9/10 is not 10/10. Academic standards cannot be compromised.',
        'Congratulations. You were almost a human.',
        'Your engineering knowledge is insufficient for employment at this time.',
        'CAPTCHA believes you are suspiciously confident yet mathematically vulnerable.',
        'You solved numerous questions and still lost. Please reconsider your career choices.',
      ];
      setFailureNotice({
        correctCount,
        quote: quotes[Math.min(attempts, quotes.length - 1)],
        show: true,
      });
    }
  };

  const toggleSelectQ1 = (id: number) => {
    sounds.playKeypress();
    setSelectedQ1(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectQ2 = (id: number) => {
    sounds.playKeypress();
    setSelectedQ2(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="ten-question-exam-scroll-root">
      {/* Top Banner */}
      <div className="exam-header-banner">
        <div className="exam-badge-flash">🚨 MANDATORY CITIZENSHIP EXAMINATION</div>
        <h2 className="exam-main-title">CAPTCHA SECURITY EXAMINATION</h2>
        <p className="exam-subtitle">
          “10 QUESTIONS REQUIRED • ALL 10 MUST BE CONCURRENTLY ACCURATE • PARTIAL CREDIT IS A BOURGEOIS ILLUSION”
        </p>

        {/* Progress Tracker */}
        <div className="exam-completion-tracker">
          <div className="tracker-label">
            <span>CAPTCHA COMPLETION:</span>
            <span className="font-pixel text-yellow">[{completedCount}/10 ANSWERED]</span>
          </div>
          <div className="tracker-bar-track">
            <div
              className="tracker-bar-fill"
              style={{ width: `${(completedCount / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="exam-threat-meters">
          <span>HUMAN CONFIDENCE: <b>17%</b></span>
          <span>•</span>
          <span>ACADEMIC THREAT LEVEL: <b className="text-neon-pink">EXTREME</b></span>
        </div>
      </div>

      {/* Failure Callout Modal / Banner */}
      {failureNotice && failureNotice.show && (
        <div className="exam-failure-modal-overlay">
          <div className="exam-failure-card">
            <div className="failure-banner-top">❌ CAPTCHA FAILED</div>
            <div className="failure-card-body">
              <h3>{failureNotice.correctCount}/10 CORRECT.</h3>
              <p className="failure-quote-text">“{failureNotice.quote}”</p>
              <div className="failure-reset-alert">
                THE SECURITY DEPARTMENT HAS NOTED YOUR INTELLECTUAL DEFICIENCY.
              </div>
              <button
                type="button"
                className="failure-retry-btn"
                onClick={() => setFailureNotice(null)}
              >
                <RotateCcw size={16} /> RETURN TO EXAM & RECTIFY DEFECTS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The 10 Questions Wall */}
      <form onSubmit={handleExamSubmit} className="exam-questions-wall">
        {/* =========================================================================
            QUESTION 1: Image Matching (Traffic Lights) - Difficulty: EASY
            ========================================================================= */}
        <div className="exam-panel panel-q1">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 1 / 10</span>
            <span className="diff-pill diff-easy">DIFFICULTY: RECONNAISSANCE</span>
          </div>
          <h3 className="panel-title">SELECT ALL IMAGES CONTAINING A TRAFFIC LIGHT:</h3>
          <p className="panel-hint">(Optical illumination for automotive guidance only)</p>

          <div className="image-grid-6">
            {TRAFFIC_LIGHT_ITEMS.map(item => {
              const isSelected = selectedQ1.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`grid-card-choice ${isSelected ? 'card-picked' : ''}`}
                  onClick={() => toggleSelectQ1(item.id)}
                >
                  <span className="choice-check">{isSelected ? '☑' : '☐'}</span>
                  <div className="choice-emoji">{item.emoji}</div>
                  <span className="choice-desc">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            QUESTION 2: Image Matching (Bicycles) - Difficulty: MODERATE
            ========================================================================= */}
        <div className="exam-panel panel-q2">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 2 / 10</span>
            <span className="diff-pill diff-mod">DIFFICULTY: MECHANICAL BIOLOGY</span>
          </div>
          <h3 className="panel-title">SELECT ALL IMAGES CONTAINING A BICYCLE:</h3>
          <p className="panel-hint">(Human-powered two-wheeled velocity vectors)</p>

          <div className="image-grid-6">
            {BICYCLE_ITEMS.map(item => {
              const isSelected = selectedQ2.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`grid-card-choice ${isSelected ? 'card-picked' : ''}`}
                  onClick={() => toggleSelectQ2(item.id)}
                >
                  <span className="choice-check">{isSelected ? '☑' : '☐'}</span>
                  <div className="choice-emoji">{item.emoji}</div>
                  <span className="choice-desc">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            QUESTION 3: Formal Logic - Difficulty: LOGICAL
            ========================================================================= */}
        <div className="exam-panel panel-q3">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 3 / 10</span>
            <span className="diff-pill diff-logic">DIFFICULTY: PROPOSITIONAL RIGOR</span>
          </div>
          <h3 className="panel-title">BOOLEAN LOGIC: Which proposition is logically equivalent to (P → Q)?</h3>
          <div className="mcq-options-stack">
            {[
              { id: 'A', text: '¬P ∧ Q' },
              { id: 'B', text: '¬P ∨ Q' },
              { id: 'C', text: 'P ∧ ¬Q' },
              { id: 'D', text: '¬(P ∨ Q)' },
            ].map(opt => (
              <label key={opt.id} className={`mcq-exam-label ${selectedQ3 === opt.id ? 'exam-opt-active' : ''}`}>
                <input
                  type="radio"
                  name="q3"
                  checked={selectedQ3 === opt.id}
                  onChange={() => { sounds.playKeypress(); setSelectedQ3(opt.id); }}
                />
                <span className="opt-letter">[{opt.id}]</span>
                <span className="opt-body">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            QUESTION 4: Mathematics (Calculus) - Difficulty: CALCULUS
            ========================================================================= */}
        <div className="exam-panel panel-q4">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 4 / 10</span>
            <span className="diff-pill diff-math">DIFFICULTY: DEFINITE INTEGRATION</span>
          </div>
          <h3 className="panel-title">CALCULUS: Evaluate the improper integral:</h3>
          <div className="math-equation-display">
            ∫₀^∞ x² · e⁻ˣ dx
          </div>
          <div className="mcq-options-stack">
            {[
              { id: 'A', text: '1 / 2' },
              { id: 'B', text: '1' },
              { id: 'C', text: '2 (via Γ(3) = 2!)' },
              { id: 'D', text: 'π² / 6' },
            ].map(opt => (
              <label key={opt.id} className={`mcq-exam-label ${selectedQ4 === opt.id ? 'exam-opt-active' : ''}`}>
                <input
                  type="radio"
                  name="q4"
                  checked={selectedQ4 === opt.id}
                  onChange={() => { sounds.playKeypress(); setSelectedQ4(opt.id); }}
                />
                <span className="opt-letter">[{opt.id}]</span>
                <span className="opt-body">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            QUESTION 5: Advanced Math (Laplace Transforms) - Difficulty: ADVANCED MATH
            ========================================================================= */}
        <div className="exam-panel panel-q5">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 5 / 10</span>
            <span className="diff-pill diff-math">DIFFICULTY: OPERATIONAL CALCULUS</span>
          </div>
          <h3 className="panel-title">LAPLACE TRANSFORM: Determine ℒ&#123;e^(at) · sin(ωt)&#125; for s &gt; a:</h3>
          <div className="mcq-options-stack">
            {[
              { id: 'A', text: 'ω / [ (s - a)² + ω² ]' },
              { id: 'B', text: '(s - a) / [ (s - a)² + ω² ]' },
              { id: 'C', text: 'ω / (s² + ω²)' },
              { id: 'D', text: 'a / [ (s - ω)² + a² ]' },
            ].map(opt => (
              <label key={opt.id} className={`mcq-exam-label ${selectedQ5 === opt.id ? 'exam-opt-active' : ''}`}>
                <input
                  type="radio"
                  name="q5"
                  checked={selectedQ5 === opt.id}
                  onChange={() => { sounds.playKeypress(); setSelectedQ5(opt.id); }}
                />
                <span className="opt-letter">[{opt.id}]</span>
                <span className="opt-body">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            QUESTION 6: Electrical Engineering - Difficulty: ELECTRICAL ENG
            ========================================================================= */}
        <div className="exam-panel panel-q6">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 6 / 10</span>
            <span className="diff-pill diff-ee">DIFFICULTY: RLC NETWORK SYNTHESIS</span>
          </div>
          <h3 className="panel-title">ELECTRICAL ENG: For a series RLC circuit, what is the undamped resonant angular frequency ω₀?</h3>
          <div className="mcq-options-stack">
            {[
              { id: 'A', text: 'ω₀ = R / (2L)' },
              { id: 'B', text: 'ω₀ = 1 / √(L · C)' },
              { id: 'C', text: 'ω₀ = √(L / C)' },
              { id: 'D', text: 'ω₀ = 2π · √(L · C)' },
            ].map(opt => (
              <label key={opt.id} className={`mcq-exam-label ${selectedQ6 === opt.id ? 'exam-opt-active' : ''}`}>
                <input
                  type="radio"
                  name="q6"
                  checked={selectedQ6 === opt.id}
                  onChange={() => { sounds.playKeypress(); setSelectedQ6(opt.id); }}
                />
                <span className="opt-letter">[{opt.id}]</span>
                <span className="opt-body">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            QUESTION 7: Computer Science - Difficulty: COMPUTER SCIENCE
            ========================================================================= */}
        <div className="exam-panel panel-q7">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 7 / 10</span>
            <span className="diff-pill diff-cs">DIFFICULTY: DATA STRUCTURES</span>
          </div>
          <h3 className="panel-title">COMPUTER SCIENCE: What is the worst-case time complexity of searching for a key in a balanced AVL Tree with N elements?</h3>
          <div className="mcq-options-stack">
            {[
              { id: 'A', text: 'O(log N)' },
              { id: 'B', text: 'O(N)' },
              { id: 'C', text: 'O(N log N)' },
              { id: 'D', text: 'O(1)' },
            ].map(opt => (
              <label key={opt.id} className={`mcq-exam-label ${selectedQ7 === opt.id ? 'exam-opt-active' : ''}`}>
                <input
                  type="radio"
                  name="q7"
                  checked={selectedQ7 === opt.id}
                  onChange={() => { sounds.playKeypress(); setSelectedQ7(opt.id); }}
                />
                <span className="opt-letter">[{opt.id}]</span>
                <span className="opt-body">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            QUESTION 8: Physics - Difficulty: PHYSICS
            ========================================================================= */}
        <div className="exam-panel panel-q8">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 8 / 10</span>
            <span className="diff-pill diff-phys">DIFFICULTY: CLASSICAL ELECTRODYNAMICS</span>
          </div>
          <h3 className="panel-title">PHYSICS: Which equation precisely describes the total electromagnetic Lorentz Force on a particle with charge q?</h3>
          <div className="mcq-options-stack">
            {[
              { id: 'A', text: 'F = m · a + q · B' },
              { id: 'B', text: 'F = q · (v · E)' },
              { id: 'C', text: 'F = (q / ε₀) · (E × B)' },
              { id: 'D', text: 'F = q · (E + v × B)' },
            ].map(opt => (
              <label key={opt.id} className={`mcq-exam-label ${selectedQ8 === opt.id ? 'exam-opt-active' : ''}`}>
                <input
                  type="radio"
                  name="q8"
                  checked={selectedQ8 === opt.id}
                  onChange={() => { sounds.playKeypress(); setSelectedQ8(opt.id); }}
                />
                <span className="opt-letter">[{opt.id}]</span>
                <span className="opt-body">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            QUESTION 9: Chemistry / Thermodynamics - Difficulty: THERMODYNAMICS
            ========================================================================= */}
        <div className="exam-panel panel-q9">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 9 / 10</span>
            <span className="diff-pill diff-chem">DIFFICULTY: CHEMICAL THERMODYNAMICS</span>
          </div>
          <h3 className="panel-title">THERMODYNAMICS: Under constant temperature and pressure, what is the thermodynamic criterion for a spontaneous reaction?</h3>
          <div className="mcq-options-stack">
            {[
              { id: 'A', text: 'ΔG < 0 (Gibbs Free Energy decrease)' },
              { id: 'B', text: 'ΔH > 0 strictly' },
              { id: 'C', text: 'ΔS_system < 0' },
              { id: 'D', text: 'ΔG = 0 (Equilibrium perpetual)' },
            ].map(opt => (
              <label key={opt.id} className={`mcq-exam-label ${selectedQ9 === opt.id ? 'exam-opt-active' : ''}`}>
                <input
                  type="radio"
                  name="q9"
                  checked={selectedQ9 === opt.id}
                  onChange={() => { sounds.playKeypress(); setSelectedQ9(opt.id); }}
                />
                <span className="opt-letter">[{opt.id}]</span>
                <span className="opt-body">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* =========================================================================
            QUESTION 10: General Engineering / PhD Level - Difficulty: WHY
            ========================================================================= */}
        <div className="exam-panel panel-q10">
          <div className="panel-header-strip">
            <span className="q-tag">QUESTION 10 / 10</span>
            <span className="diff-pill diff-why">DIFFICULTY: WHY / PhD / WHO APPROVED THIS?</span>
          </div>
          <h3 className="panel-title">COMPUTATIONAL COMPLEXITY: Which computational decision problem was famously proven to be NP-Complete by Stephen Cook and Leonid Levin (1971)?</h3>
          <div className="mcq-options-stack">
            {[
              { id: 'A', text: 'Primality Testing (AKS)' },
              { id: 'B', text: 'Shortest Path (Dijkstra)' },
              { id: 'C', text: 'Boolean Satisfiability (SAT / 3-SAT)' },
              { id: 'D', text: 'Minimum Spanning Tree (Kruskal)' },
            ].map(opt => (
              <label key={opt.id} className={`mcq-exam-label ${selectedQ10 === opt.id ? 'exam-opt-active' : ''}`}>
                <input
                  type="radio"
                  name="q10"
                  checked={selectedQ10 === opt.id}
                  onChange={() => { sounds.playKeypress(); setSelectedQ10(opt.id); }}
                />
                <span className="opt-letter">[{opt.id}]</span>
                <span className="opt-body">{opt.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Big Final Exam Submission Bar */}
        <div className="exam-submit-footer-bar">
          <button type="submit" className="exam-final-submit-btn">
            🎓 SUBMIT ALL 10 CONCURRENT ANSWERS & EVALUATE HUMANITY
          </button>
          <small className="exam-final-disclaimer">
            *By submitting, you certify under penalty of perjury that you did not use a calculator, a slide rule, or common sense.
          </small>
        </div>
      </form>
    </div>
  );
};
