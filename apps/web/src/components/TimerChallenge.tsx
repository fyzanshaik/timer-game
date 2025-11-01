import { useRef, useState, useCallback, useEffect } from "react";
import { ResultModal } from "./ResultModal";
import { Leaderboard, LeaderboardHandle } from "./Leaderboard";
import { RandomTimer } from "./RandomTimer";
import { useHaptics } from "../hooks/useHaptics";
import type { TimerScoreKey } from "@timer-game/types";

interface TimerChallengeProps {
  title: string;
  targetTime: number;
  highScore: number;
  userId: number;
  userName: string;
}

export const TimerChallenge: React.FC<TimerChallengeProps> = ({ title, targetTime, highScore, userId, userName }) => {
  const [remainingTime, setRemainingTime] = useState<number>(targetTime * 1000);
  const [userHighscore, setUserHighscore] = useState<number>(highScore);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dialog = useRef<{ open: () => void }>(null);
  const leaderDialog = useRef<LeaderboardHandle>(null);
  const { vibrate } = useHaptics();

  const timerIsActive = remainingTime > 0 && remainingTime < targetTime * 1000;

  useEffect(() => {
    if (remainingTime <= 0 && timerRef.current) {
      clearInterval(timerRef.current);
      dialog.current?.open();
    }
  }, [remainingTime]);

  useEffect(() => {
    return () => clearInterval(timerRef.current!);
  }, []);

  const handleStart = useCallback(() => {
    new Audio("/arcade-casino.wav").play().catch(() => {});
    vibrate("medium");
    setIsFullScreen(true);
    if (!timerIsActive) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prevRemainingTime) => Math.max(prevRemainingTime - 10, 0));
      }, 10);
    }
  }, [timerIsActive, vibrate]);

  const handleStop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      vibrate("heavy");
      setIsFullScreen(false);
      dialog.current?.open();
    }
  }, [vibrate]);

  const handleReset = useCallback(() => {
    setRemainingTime(targetTime * 1000);
    setIsFullScreen(false);
    setPulseAnimation(false);
  }, [targetTime]);

  const openLeaderboard = () => {
    new Audio("/winning-coin.wav").play().catch(() => {});
    vibrate("light");
    leaderDialog.current?.fetchAndOpen();
  };

  useEffect(() => {
    if (timerIsActive) {
      const pulseInterval = setInterval(() => {
        setPulseAnimation((prev) => !prev);
      }, 1000);
      return () => clearInterval(pulseInterval);
    } else {
      setPulseAnimation(false);
    }
  }, [timerIsActive]);

  const timerKey = `timer${targetTime}Score` as TimerScoreKey;

  return (
    <>
      <ResultModal
        ref={dialog}
        userId={userId}
        targetTime={targetTime}
        userName={userName}
        remainingTime={remainingTime}
        handleReset={handleReset}
        setUserHighScore={setUserHighscore}
        userHighScore={userHighscore}
      />
      <Leaderboard ref={leaderDialog} timerKey={timerKey} />

      {isFullScreen && (
        <div className="fixed inset-0 z-40 bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center animate-fade-in mobile-full-height">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative w-full max-w-2xl px-6 flex flex-col items-center justify-center gap-8">
            <h2 className="font-['Handjet',monospace] text-4xl md:text-6xl font-black uppercase text-primary animate-pulse-subtle">
              {title}
            </h2>
            <RandomTimer targetTime={targetTime} />
            <div
              className={`text-2xl md:text-3xl font-bold transition-all ${pulseAnimation ? "scale-110 text-destructive" : "scale-100 text-destructive/80"}`}
            >
              🔴 Timer Running...
            </div>
            <button
              onClick={handleStop}
              className="touch-target px-16 py-6 text-2xl font-black rounded-2xl bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-destructive-foreground border-4 border-destructive shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 animate-glow-pulse"
            >
              ⏹️ STOP
            </button>
          </div>
        </div>
      )}

      <section
        className={`group flex flex-col items-center justify-between p-5 md:p-6 bg-card border-2 border-border rounded-xl [box-shadow:var(--shadow-lg)] hover:[box-shadow:var(--shadow-xl)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 min-h-[420px] md:min-h-[400px] ${isFullScreen ? "opacity-0" : "opacity-100"}`}
      >
        <div className="text-center w-full">
          <h2 className="font-['Handjet',monospace] text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-2 md:mb-3 text-primary leading-tight">
            {title}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2 md:mb-2">
            <div className="px-3 py-1 md:px-4 md:py-1.5 bg-accent/30 border-2 border-accent rounded-lg">
              <p className="text-xs md:text-sm text-accent-foreground">
                <strong className="font-bold">
                  Highscore: {userHighscore > highScore ? userHighscore : highScore}
                </strong>
              </p>
            </div>
            <div className="inline-flex items-center justify-center border-2 border-primary rounded-lg px-4 py-1 md:px-6 md:py-2 text-xl md:text-2xl font-bold bg-primary/10 text-primary">
              ⏱️ {targetTime}s
            </div>
          </div>
        </div>

        {timerIsActive && !isFullScreen && <RandomTimer targetTime={targetTime} />}

        <div className="my-2 md:my-3">
          <p
            className={`font-bold text-sm md:text-base transition-all ${timerIsActive ? "text-destructive animate-pulse scale-110" : "text-muted-foreground"}`}
          >
            {timerIsActive ? "🔴 Running..." : "⏸️ Ready"}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 md:gap-3">
          <button
            onClick={timerIsActive ? handleStop : handleStart}
            className={`touch-target w-full px-6 py-3.5 md:px-6 md:py-4 font-bold text-base md:text-lg rounded-lg transition-all duration-200 border-2 button-press ${
              timerIsActive
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive [box-shadow:var(--shadow-md)] hover:translate-x-0.5 hover:translate-y-0.5"
                : "bg-primary hover:bg-primary/90 text-primary-foreground border-primary [box-shadow:var(--shadow-md)] hover:translate-x-0.5 hover:translate-y-0.5 hover:scale-105"
            }`}
          >
            {timerIsActive ? "⏹️ Stop Timer" : "▶️ Start Timer"}
          </button>
          <button
            onClick={openLeaderboard}
            className="touch-target w-full px-6 py-3.5 md:px-6 md:py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base md:text-lg rounded-lg transition-all duration-200 border-2 border-accent [box-shadow:var(--shadow-md)] hover:translate-x-0.5 hover:translate-y-0.5 button-press hover:scale-105"
          >
            🏆 Leaderboard
          </button>
        </div>
      </section>
    </>
  );
};
