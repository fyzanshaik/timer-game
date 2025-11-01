import { forwardRef, useImperativeHandle, useRef } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useHaptics } from "../hooks/useHaptics";
import type { TimerScoreKey } from "@timer-game/types";

interface LeaderboardProps {
  timerKey: TimerScoreKey;
}

export interface LeaderboardHandle {
  fetchAndOpen: () => void;
}

export const Leaderboard = forwardRef<LeaderboardHandle, LeaderboardProps>(({ timerKey }, ref) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const { data: leaderboardData, isLoading, refetch } = useLeaderboard(timerKey);
  const { vibrate } = useHaptics();

  useImperativeHandle(ref, () => ({
    async fetchAndOpen() {
      await refetch();
      dialogRef.current?.showModal();
    },
  }));

  const timerName = timerKey.replace("Score", "").replace("timer", "Timer ");

  return (
    <dialog ref={dialogRef}>
      <div className="bg-popover text-popover-foreground rounded-xl p-4 md:p-7 max-w-2xl w-full border-2 border-border [box-shadow:var(--shadow-2xl)] animate-scale-in mobile-safe-bottom mobile-safe-top">
        <h2 className="font-['Handjet',monospace] text-3xl md:text-4xl font-black uppercase text-primary text-center mb-4 md:mb-6">
          🏆 {timerName} Leaderboard
        </h2>
        {isLoading ? (
          <div className="flex flex-col gap-3 py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg">
                <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto mb-5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-accent/20 border-b-2 border-border">
                  <th className="px-5 py-3 text-left text-foreground font-bold text-base">Rank</th>
                  <th className="px-5 py-3 text-left text-foreground font-bold text-base">Player</th>
                  <th className="px-5 py-3 text-right text-foreground font-bold text-base">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData?.map((entry: any, index: number) => (
                  <tr key={index} className="border-b border-border hover:bg-accent/10 transition-colors group">
                    <td className="px-5 py-3 text-primary font-bold text-base">
                      {index === 0 && "🥇"}
                      {index === 1 && "🥈"}
                      {index === 2 && "🥉"}
                      {index > 2 && `#${index + 1}`}
                    </td>
                    <td className="px-5 py-3 text-foreground font-medium group-hover:text-primary transition-colors">
                      {entry.user.username}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-lg text-accent">{entry[timerKey]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form method="dialog" className="text-right mt-4">
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
  );
});
