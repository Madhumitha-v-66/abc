import React, { useState } from 'react';
import { sounds } from '../../utils/sound';

interface QuestionDef {
  title: string;
  options: string[];
}

const QUESTIONS: QuestionDef[] = [
  {
    title: 'Which of these fonts looks most employable?',
    options: ['Comic Sans MS (Honest)', 'Papyrus (Ancient Dignity)', 'Wingdings (Encrypted)', 'Impact (Aggressive Synergy)']
  },
  {
    title: 'Prove you are not three interns in a trench coat:',
    options: ['I am 1 intern', 'I am 3 interns (wearing beige)', 'I am the trench coat', 'Undecided / Hybrid']
  },
  {
    title: 'Select the most professional geometric rectangle:',
    options: ['Wide Rectangle with 0px radius', 'Square pretending to be a rectangle', 'Tilted Golden Ratio', 'Parallelogram with ambition']
  },
  {
    title: 'What is your expected salary in CAPTCHA points?',
    options: ['73 Bananas / hour', '412 Blurry Crosswalks', '14 Coffman Deadlocks', 'Unpaid Passion']
  }
];

export const FakeSecurityQuestion: React.FC = () => {
  const [qIndex] = useState(() => Math.floor(Math.random() * QUESTIONS.length));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const q = QUESTIONS[qIndex];

  const handleSelect = (idx: number) => {
    sounds.playKeypress();
    setSelectedIdx(idx);
  };

  return (
    <div className="fake-security-q-card">
      <div className="q-badge">CONFIDENTIAL SECURITY QUESTIONNAIRE</div>
      <h4 className="q-title">{q.title}</h4>
      <div className="q-options-grid">
        {q.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            className={`q-opt-btn ${selectedIdx === i ? 'q-opt-selected' : ''}`}
            onClick={() => handleSelect(i)}
          >
            <span className="q-marker">{selectedIdx === i ? '●' : '○'}</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
