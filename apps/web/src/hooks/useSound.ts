import { useCallback } from "react";

type SoundEffect = "button" | "success" | "failure" | "start" | "stop" | "coin";

export const useSound = () => {
  const play = useCallback((effect: SoundEffect) => {
    const soundMap: Record<SoundEffect, string> = {
      button: "/arcade-casino.wav",
      success: "/game-bonus.wav",
      failure: "/space-shooter.wav",
      start: "/game-start.mp3",
      stop: "/space-shooter.wav",
      coin: "/winning-coin.wav",
    };

    const sound = new Audio(soundMap[effect]);
    sound.volume = 0.5;
    sound.play().catch(() => {});
  }, []);

  return { play };
};
