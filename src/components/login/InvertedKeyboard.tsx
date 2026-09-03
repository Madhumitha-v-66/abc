import React, { useState, useCallback } from 'react';
import { sounds } from '../../utils/sound';

interface InvertedKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  activeTargetName?: string;
}

const BASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const InvertedKeyboard: React.FC<InvertedKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
  activeTargetName = 'USERNAME',
}) => {
  const [letters, setLetters] = useState<string[]>(() => shuffleArray(BASE_LETTERS));
  const [numbers, setNumbers] = useState<string[]>(() => shuffleArray(NUMBERS));
  const [isCaps, setIsCaps] = useState<boolean>(true);
  const [keyRotations, setKeyRotations] = useState<Record<string, number>>({});
  const [rearrangeCount, setRearrangeCount] = useState<number>(0);

  // Rearranges letter & number positions across the entire grid
  const scramblePositions = useCallback(() => {
    sounds.playBoing();
    const newLetters = shuffleArray(BASE_LETTERS);
    const newNumbers = shuffleArray(NUMBERS);
    setLetters(newLetters);
    setNumbers(newNumbers);

    // Random slight rotations (-4deg to +4deg)
    const rots: Record<string, number> = {};
    for (const char of [...newLetters, ...newNumbers]) {
      rots[char] = (Math.random() - 0.5) * 8;
    }
    setKeyRotations(rots);
    setRearrangeCount(prev => prev + 1);
  }, []);

  const handleKeyClick = (char: string) => {
    sounds.playKeypress();
    const finalChar = isCaps ? char.toUpperCase() : char.toLowerCase();
    onKeyPress(finalChar);

    // IMMEDIATELY REARRANGE POSITIONS AFTER EVERY CLICK!
    scramblePositions();
  };

  return (
    <div className="inverted-keyboard-wrapper">
      <div className="keyboard-active-target-banner">
        <span>⌨️ INPUT ASSISTANCE SYSTEM • CURRENT FOCUS: <b>[{activeTargetName.toUpperCase()}]</b></span>
        <span className="rearrange-badge font-pixel">SHUFFLE #{rearrangeCount}</span>
      </div>

      <div className="keyboard-keys-container">
        {/* Numbers Row (Scrambled) */}
        <div className="keyboard-row numbers-row">
          {numbers.map(num => (
            <button
              key={num}
              type="button"
              className="keyboard-key key-digit"
              style={{
                transform: `rotate(${keyRotations[num] || 0}deg)`,
                transition: 'transform 0.08s ease',
              }}
              onClick={() => handleKeyClick(num)}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Letters Grid (Scrambles every click!) */}
        <div className="keyboard-letters-scramble-grid">
          {letters.map(char => (
            <button
              key={char}
              type="button"
              className="keyboard-key key-letter-scramble"
              style={{
                transform: `rotate(${keyRotations[char] || 0}deg)`,
                transition: 'transform 0.08s ease',
              }}
              onClick={() => handleKeyClick(char)}
            >
              {isCaps ? char.toUpperCase() : char.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Action / Control Row */}
        <div className="keyboard-row special-row">
          <button
            type="button"
            className="keyboard-key key-func key-caps"
            onClick={() => { sounds.playKeypress(); setIsCaps(prev => !prev); scramblePositions(); }}
          >
            CAPS: {isCaps ? 'ON' : 'off'}
          </button>
          <button
            type="button"
            className="keyboard-key key-func key-space"
            onClick={() => { sounds.playKeypress(); onKeyPress(' '); scramblePositions(); }}
          >
            [ SPACE ]
          </button>
          <button
            type="button"
            className="keyboard-key key-func key-backspace"
            onClick={() => { sounds.playKeypress(); onBackspace(); scramblePositions(); }}
          >
            ⌫ BACKSPACE
          </button>
          <button
            type="button"
            className="keyboard-key key-func key-clear"
            onClick={() => { sounds.playBuzzer(); onClear(); scramblePositions(); }}
          >
            💥 CLEAR
          </button>
          <button
            type="button"
            className="keyboard-key key-func key-shuffle"
            onClick={scramblePositions}
          >
            🔀 RESCRAMBLE
          </button>
        </div>
      </div>

      <div className="keyboard-footer-legend">
        <span>*NOTICE: Keys rearrange visual positions after every single input for optimal alertness.</span>
      </div>
    </div>
  );
};
