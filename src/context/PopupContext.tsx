import React, { createContext, useContext, useState, useEffect } from 'react';
import { sounds } from '../utils/sound';

export interface ActivePopup {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  type: 'confirm' | 'scam' | 'newsletter' | 'discount' | 'existential';
  closeType: 'tiny-x' | 'hidden-text' | 'moving-btn' | 'double-negative';
  level: number;
}

interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  position: 'top-left' | 'bottom-right' | 'center-left';
}

interface PopupContextType {
  popups: ActivePopup[];
  toasts: ToastItem[];
  closePopup: (id: string) => void;
  triggerPopup: (custom?: Partial<ActivePopup>) => void;
  showToast: (message: string, type?: 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

const RAGE_POPUPS: Omit<ActivePopup, 'id' | 'level'>[] = [
  {
    title: 'WAIT! PLEASE DO NOT PROCEED!',
    subtitle: 'SPECIAL OPPORTUNITY EXPIRING IN 00:04 SECONDS',
    body: 'You have been pre-selected to receive 14 complimentary endorsements from people you have never met. Do you accept this overwhelming social proof?',
    type: 'confirm',
    closeType: 'tiny-x',
  },
  {
    title: 'ARE YOU REALLY SURE?',
    subtitle: 'CRITICAL LIFE DECISION WARNING',
    body: 'Closing this notification may decrease your professional synergy index by up to 34.2%. Are you confident in your current synergy level?',
    type: 'confirm',
    closeType: 'moving-btn',
  },
  {
    title: 'YOU COULD SAVE ₹12 ON SUPERGLUEDIN PREMIUM!',
    subtitle: 'LIMITED TIME COFFEE-CUP PRICING',
    body: 'For just ₹9,999/month (billed annually, non-refundable, forever), unlock the ability to see who looked at your blurry thumbnail for 0.4 seconds!',
    type: 'discount',
    closeType: 'double-negative',
  },
  {
    title: 'YOUR COMPUTER IS 73% SAD :(',
    subtitle: 'ANTIVIRUS DIAGNOSTIC SUMMARY',
    body: 'We scanned your browser cache and detected 412 unfulfilled career aspirations. Click here to defragment your soul.',
    type: 'scam',
    closeType: 'hidden-text',
  },
  {
    title: 'ONE LAST THING BEFORE YOU READ THIS POST...',
    subtitle: 'MANDATORY THOUGHT LEADERSHIP NEWSLETTER',
    body: 'Subscribe to "B2B Synergy Syllables" delivered directly to your spam folder twice an hour!',
    type: 'newsletter',
    closeType: 'tiny-x',
  },
  {
    title: 'FINAL CONFIRMATION OF YOUR CONFIRMATION',
    subtitle: 'VERIFICATION STEP 4 OF 9',
    body: 'Did you or did you not intend to refuse the offer to reconsider your cancellation?',
    type: 'existential',
    closeType: 'double-negative',
  }
];

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [popups, setPopups] = useState<ActivePopup[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Show immediate popup on initial mount as required by specification!
  useEffect(() => {
    const timer1 = setTimeout(() => {
      triggerPopup({
        title: 'WELCOME TO SUPERGLUEDIN™!',
        subtitle: 'SECURITY & PRIVACY GUARANTEE*',
        body: '*We guarantee that we have no idea where your data goes. By continuing, you agree to our 842-page Terms of Confusion.',
        type: 'scam',
        closeType: 'tiny-x',
      });
      sounds.playDing();
    }, 800);

    const timer2 = setTimeout(() => {
      showToast('⚠️ Notice: Your profile views have expired for the quarter.', 'warning');
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Periodic random popups (every 30s)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4 && popups.length < 3) {
        triggerPopup();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [popups.length]);

  const triggerPopup = (custom?: Partial<ActivePopup>) => {
    sounds.playDing();
    const template = RAGE_POPUPS[Math.floor(Math.random() * RAGE_POPUPS.length)];
    const newPopup: ActivePopup = {
      id: 'popup-' + Date.now() + '-' + Math.random(),
      title: custom?.title || template.title,
      subtitle: custom?.subtitle || template.subtitle,
      body: custom?.body || template.body,
      type: custom?.type || template.type,
      closeType: custom?.closeType || template.closeType,
      level: (custom?.level || 0) + 1,
    };
    setPopups(prev => [...prev, newPopup]);
  };

  const closePopup = (id: string) => {
    sounds.playBoing();
    setPopups(prev => {
      const target = prev.find(p => p.id === id);
      const remaining = prev.filter(p => p.id !== id);

      // If user closed a popup and its level is 1, 55% chance to spawn a follow-up ("ARE YOU SURE?")
      if (target && target.level === 1 && Math.random() > 0.45) {
        setTimeout(() => {
          triggerPopup({
            title: 'WAIT! ARE YOU REALLY SURE?',
            subtitle: 'DID YOU MEAN TO DISMISS THIS ESSENTIAL OPPORTUNITY?',
            body: 'Pressing close may cause irreversible psychological tranquility. Are you certain you do not want to reconsider?',
            type: 'confirm',
            closeType: 'moving-btn',
            level: 2,
          });
        }, 300);
      }
      return remaining;
    });
  };

  const showToast = (message: string, type: 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random();
    const positions: ToastItem['position'][] = ['top-left', 'bottom-right', 'center-left'];
    const position = positions[Math.floor(Math.random() * positions.length)];
    setToasts(prev => [...prev, { id, message, type, position }]);

    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <PopupContext.Provider
      value={{
        popups,
        toasts,
        closePopup,
        triggerPopup,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};
