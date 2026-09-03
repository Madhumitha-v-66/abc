import { useEffect, useRef } from 'react';

/**
 * useReversedScroll:
 * Rarely and temporarily inverts the mouse wheel scroll direction for ~3.5 seconds.
 * Strictly avoids interfering with input fields and leaves no warnings.
 */
export function useReversedScroll() {
  const isReversedRef = useRef(false);

  useEffect(() => {
    // Check periodically whether to trigger a temporary 3.5s reversal window
    const interval = setInterval(() => {
      // 30% chance every 50 seconds
      if (Math.random() < 0.3 && !isReversedRef.current) {
        isReversedRef.current = true;

        // Automatically revert back to normal after 3.5 seconds
        setTimeout(() => {
          isReversedRef.current = false;
        }, 3500);
      }
    }, 50000);

    const handleWheel = (e: WheelEvent) => {
      if (!isReversedRef.current) return;

      const target = e.target as HTMLElement | null;
      // Do not interfere if user is typing or interacting with form controls
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Invert scroll direction
      e.preventDefault();
      window.scrollBy({
        top: -e.deltaY,
        left: -e.deltaX,
        behavior: 'auto',
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      clearInterval(interval);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
}
