import { useRef, useState, useCallback, useEffect } from "react";
import { ResultModal } from "./ResultModal";
import { Leaderboard, LeaderboardHandle } from "./Leaderboard";
import { RandomTimer } from "./RandomTimer";
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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dialog = useRef<{ open: () => void }>(null);
  const leaderDialog = useRef<LeaderboardHandle>(null);

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
    if (!timerIsActive) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prevRemainingTime) => Math.max(prevRemainingTime - 10, 0));
      }, 10);
    }
  }, [timerIsActive]);

  const handleStop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      dialog.current?.open();
    }
  }, []);

  const handleReset = useCallback(() => {
    setRemainingTime(targetTime * 1000);
  }, [targetTime]);

  const openLeaderboard = () => {
    new Audio("/winning-coin.wav").play().catch(() => {});
    leaderDialog.current?.fetchAndOpen();
  };

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
      <section className="group flex flex-col items-center justify-between p-6 bg-card border-2 border-border rounded-xl [box-shadow:var(--shadow-lg)] hover:[box-shadow:var(--shadow-xl)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 min-h-[400px]">
        <div className="text-center w-full">
          <h2 className="font-['Handjet',monospace] text-3xl md:text-4xl font-bold uppercase tracking-wide mb-3 text-primary">
            {title}
          </h2>
          <div className="inline-block mb-2 px-4 py-1.5 bg-accent/30 border-2 border-accent rounded-lg">
            <p className="text-sm text-accent-foreground">
              <strong className="font-bold">Highscore: {userHighscore > highScore ? userHighscore : highScore}</strong>
            </p>
          </div>
          <div className="inline-flex items-center justify-center border-2 border-primary rounded-lg px-6 py-2 my-2 text-2xl font-bold bg-primary/10 text-primary">
            ⏱️ {targetTime}s
          </div>
        </div>

        {timerIsActive && <RandomTimer targetTime={targetTime} />}

        <div className="my-3">
          <p
            className={`font-bold text-base transition-all ${timerIsActive ? "text-destructive animate-pulse scale-110" : "text-muted-foreground"}`}
          >
            {timerIsActive ? "🔴 Running..." : "⏸️ Ready"}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <button
            onClick={timerIsActive ? handleStop : handleStart}
            className={`w-full px-6 py-3 font-bold rounded-lg transition-all duration-200 border-2 ${
              timerIsActive
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive [box-shadow:var(--shadow-md)] hover:translate-x-0.5 hover:translate-y-0.5"
                : "bg-primary hover:bg-primary/90 text-primary-foreground border-primary [box-shadow:var(--shadow-md)] hover:translate-x-0.5 hover:translate-y-0.5"
            }`}
          >
            {timerIsActive ? "⏹️ Stop Timer" : "▶️ Start Timer"}
          </button>
          <button
            onClick={openLeaderboard}
            className="w-full px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg transition-all duration-200 border-2 border-accent [box-shadow:var(--shadow-md)] hover:translate-x-0.5 hover:translate-y-0.5"
          >
            🏆 Leaderboard
          </button>
        </div>
      </section>
    </>
  );
};
