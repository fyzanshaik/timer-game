import { useEffect, useRef, useState, useCallback } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  isSwiping: boolean;
  direction: "left" | "right" | "up" | "down" | null;
}

export const useSwipe = (handlers: SwipeHandlers, threshold = 50) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
  });

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    setSwipeState({ isSwiping: true, direction: null });
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) {
      setSwipeState({ isSwiping: false, direction: null });
      return;
    }

    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = touchStart.current.y - touchEnd.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) < threshold) {
      setSwipeState({ isSwiping: false, direction: null });
      return;
    }

    if (absDeltaX > absDeltaY) {
      if (deltaX > 0) {
        handlers.onSwipeLeft?.();
        setSwipeState({ isSwiping: false, direction: "left" });
      } else {
        handlers.onSwipeRight?.();
        setSwipeState({ isSwiping: false, direction: "right" });
      }
    } else {
      if (deltaY > 0) {
        handlers.onSwipeUp?.();
        setSwipeState({ isSwiping: false, direction: "up" });
      } else {
        handlers.onSwipeDown?.();
        setSwipeState({ isSwiping: false, direction: "down" });
      }
    }
  }, [handlers, threshold]);

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("touchstart", onTouchStart);
    element.addEventListener("touchmove", onTouchMove);
    element.addEventListener("touchend", onTouchEnd);

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  return { ref, swipeState };
};
