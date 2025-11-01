import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";
import { useUpdateScore } from "../hooks/useScore";
import { ParticleEffect } from "./ParticleEffect";
import { useHaptics } from "../hooks/useHaptics";
import type { TimerScoreKey } from "@timer-game/types";

export interface ResultModalHandle {
  open: () => void;
}

interface ResultModalProps {
  targetTime: number;
  remainingTime: number;
  handleReset: () => void;
  userId: number;
  setUserHighScore: (score: number) => void;
  userHighScore: number;
  userName: string;
}

export const ResultModal = forwardRef<ResultModalHandle, ResultModalProps>(function ResultModal(
  { targetTime, remainingTime, handleReset, userId, setUserHighScore, userHighScore, userName },
  ref
) {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const { mutate: updateScore } = useUpdateScore();
  const { vibrate } = useHaptics();
  const [showParticles, setShowParticles] = useState(false);
  const [particleType, setParticleType] = useState<"success" | "failure" | "celebration">("success");

  const userLost = remainingTime <= 0;
  const formattedTime = (remainingTime / 1000).toFixed(2);
  const formattedTime8base = (remainingTime / 1000).toFixed(5);

  const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100);

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current?.showModal();
      handleScoreUpdate();
    },
  }));

  const handleScoreUpdate = () => {
    if (userLost) {
      setParticleType("failure");
      setShowParticles(true);
      vibrate("error");
      new Audio("/space-shooter.wav").play().catch(() => {});
    } else if (score > userHighScore) {
      setParticleType("celebration");
      setShowParticles(true);
      vibrate("success");
      setUserHighScore(score);
      new Audio("/game-bonus.wav").play().catch(() => {});
      updateScore({
        userId,
        userName,
        timerName: `timer${targetTime}Score` as TimerScoreKey,
        newScore: score,
      });
    } else {
      setParticleType("success");
      setShowParticles(true);
      vibrate("light");
      new Audio("/space-shooter.wav").play().catch(() => {});
    }

    setTimeout(() => setShowParticles(false), 3000);
  };

  return createPortal(
    <>
      <ParticleEffect trigger={showParticles} type={particleType} onComplete={() => setShowParticles(false)} />
      <dialog ref={dialog} onClose={handleReset}>
        <div className="bg-popover text-popover-foreground rounded-xl p-8 max-w-md w-full border-2 border-border [box-shadow:var(--shadow-2xl)] animate-scale-in">
          {userLost && (
            <h2 className="font-['Handjet',monospace] text-5xl font-black uppercase text-destructive mb-5 text-center animate-shake">
              💥 Time's Up!
            </h2>
          )}
          {!userLost && score > userHighScore && (
            <h2 className="font-['Handjet',monospace] text-5xl font-black uppercase text-accent mb-5 text-center animate-celebration">
              🎉 New Record!
            </h2>
          )}
          {!userLost && score <= userHighScore && (
            <h2 className="font-['Handjet',monospace] text-5xl font-black uppercase text-primary mb-5 text-center">
              ⭐ Score: {score}
            </h2>
          )}
          <div className="bg-accent/10 border-2 border-accent rounded-lg p-5 mb-5 space-y-2">
            <p className="text-base text-foreground">
              Target: <strong className="text-primary font-bold">{targetTime}s</strong>
            </p>
            <p className="text-base text-foreground">
              Remaining: <strong className="text-primary font-bold">{formattedTime}s</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Precision: <strong className="text-foreground">{formattedTime8base}s</strong>
            </p>
          </div>
          {!userLost && score > userHighScore && (
            <div className="bg-accent/20 border-2 border-accent rounded-lg p-4 mb-5">
              <p className="text-base text-accent-foreground font-bold text-center">🎯 You beat your previous best!</p>
            </div>
          )}
          <form method="dialog" onSubmit={handleReset} className="text-right mt-5">
            <button
              type="submit"
              onClick={() => vibrate("light")}
              className="touch-target px-7 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all duration-200 border-2 border-primary [box-shadow:var(--shadow-md)] hover:translate-x-0.5 hover:translate-y-0.5 button-press hover:scale-105"
            >
              Close
            </button>
          </form>
        </div>
      </dialog>
    </>,
    document.getElementById("modal") as HTMLElement
  );
});
