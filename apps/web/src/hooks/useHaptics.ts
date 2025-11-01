import { useCallback } from "react";

type HapticPattern = "light" | "medium" | "heavy" | "success" | "error" | "warning";

export const useHaptics = () => {
  const vibrate = useCallback((pattern: HapticPattern) => {
    if (!("vibrate" in navigator)) return;

    const patterns: Record<HapticPattern, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 50,
      success: [10, 50, 10, 50, 10],
      error: [100, 50, 100],
      warning: [50, 30, 50],
    };

    navigator.vibrate(patterns[pattern]);
  }, []);

  return { vibrate };
};
