import React, { useState } from 'react';
import { sounds } from '../../utils/sound';

interface CursedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon-pink' | 'toxic-green' | 'bright-yellow' | 'clashing-red' | 'microscopic' | 'gigantic';
  evasive?: boolean;
  confusingHoverText?: string;
  children: React.ReactNode;
}

export const CursedButton: React.FC<CursedButtonProps> = ({
  variant = 'neon-pink',
  evasive = false,
  confusingHoverText,
  children,
  onClick,
  className = '',
  ...props
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoverText, setHoverText] = useState<string | null>(null);

  const handleMouseEnter = () => {
    if (evasive) {
      sounds.playBoing();
      // Jump 30px to 60px in random direction
      const angle = Math.random() * Math.PI * 2;
      const dist = 35 + Math.random() * 45;
      setOffset({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      });
    }

    if (confusingHoverText) {
      setHoverText(confusingHoverText);
    }
  };

  const handleMouseLeave = () => {
    if (confusingHoverText) {
      setHoverText(null);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sounds.playKeypress();
    // Reset offset so it doesn't stay permanently displaced
    setOffset({ x: 0, y: 0 });
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.15s ease',
        ...props.style,
      }}
      className={`cursed-btn cursed-btn-${variant} ${className}`}
    >
      {hoverText || children}
    </button>
  );
};
