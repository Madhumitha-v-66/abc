import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { toAtbash } from '../utils/atbash';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  suspicionScore: number;
  incrementSuspicion: (amount?: number) => void;
  login: (rawUsername: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
  rageCount: number;
  triggerRage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_EXPERIENCE = [
  {
    title: 'Senior Popup Dodger & Closer',
    company: 'Scam Ads Unlimited • Full-time',
    period: '2023 - Present',
    desc: 'Successfully identified and clicked 4,120 invisible 2px close buttons. Reduced company revenue by 100% through persistent refusal to buy fake RAM.',
  },
  {
    title: 'Lead Atbash Keyboard Translator',
    company: 'Inverted Communications Group',
    period: '2020 - 2023',
    desc: 'Translated "HELLO WORLD" to "SVOOL DLIOW" on a daily basis. Decreased team productivity by 82% while improving cryptographical paranoia.',
  },
];

const DEFAULT_SKILLS = [
  'Solving Coffman Deadlocks in 15s',
  'Tolerating Comic Sans MS',
  'Clicking Evasive Close Buttons',
  'Atbash Reverse Typing',
  'Selective Hearing During OKRs',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('supergluedin_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [suspicionScore, setSuspicionScore] = useState<number>(73);
  const [rageCount, setRageCount] = useState<number>(0);

  // Sync user changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('supergluedin_current_user', JSON.stringify(user));
    }
  }, [user]);

  const incrementSuspicion = (amount = 5) => {
    setSuspicionScore(prev => Math.min(100, prev + amount));
  };

  const triggerRage = () => {
    setRageCount(prev => prev + 1);
  };

  const login = (rawUsername: string) => {
    const atbashName = toAtbash(rawUsername || 'USER');

    // Check if we have an existing customized profile in storage
    let existingProfile: Partial<User> = {};
    try {
      const saved = localStorage.getItem('supergluedin_current_user');
      if (saved) {
        existingProfile = JSON.parse(saved);
      }
    } catch {
      // Ignore
    }

    const newUser: User = {
      id: existingProfile.id || 'user-' + Date.now(),
      name: existingProfile.name || atbashName,
      originalName: existingProfile.originalName || rawUsername || 'ANONYMOUS',
      headline: existingProfile.headline || 'Certified CAPTCHA Veteran | Professional Popup Survivor | 73% Emotionally Exhausted',
      avatar: existingProfile.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(rawUsername || 'chaos'),
      about: existingProfile.about || 'I am a results-driven professional specializing in entering passwords with emotional complexity, passing computer science CAPTCHAs while my computer is 73% sad, and attempting to navigate websites with clashing colors and redundant dropdown menus.',
      location: existingProfile.location || 'Relocated to international cyber space',
      skills: existingProfile.skills || DEFAULT_SKILLS,
      education: existingProfile.education || 'MIT (Massachusetts Institute of Tedium), B.S. in Ambiguous Logistics',
      experience: existingProfile.experience || DEFAULT_EXPERIENCE,
      connectionsCount: existingProfile.connectionsCount || 2,
      profileViews: existingProfile.profileViews || 9999,
      suspicionScore: existingProfile.suspicionScore || 84,
      isLoggedIn: true,
    };

    setUser(newUser);
    localStorage.setItem('supergluedin_current_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('supergluedin_current_user');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('supergluedin_current_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        suspicionScore,
        incrementSuspicion,
        login,
        logout,
        updateUser,
        rageCount,
        triggerRage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
