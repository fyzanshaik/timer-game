import { useRef, useCallback, useState } from "react";
import { useUserSession } from "../hooks/useUser";
import { useHaptics } from "../hooks/useHaptics";

interface PlayerProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  userName?: string;
}

export const Player: React.FC<PlayerProps> = ({ playerName, setPlayerName, userName }) => {
  const playerNameRef = useRef<HTMLInputElement | null>(null);
  const { setUserName } = useUserSession();
  const { vibrate } = useHaptics();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSetName = useCallback(() => {
    if (playerNameRef.current) {
      const sound = new Audio("/arcade-casino.wav");
      sound.play().catch(() => {});
      vibrate("medium");
      const currentInputValue = playerNameRef.current.value.trim().toLowerCase();
      const newName = currentInputValue || "unknown";
      setPlayerName(newName);
      setUserName(newName);
      setIsExpanded(false);
    }
  }, [setPlayerName, setUserName, vibrate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSetName();
    },
    [handleSetName]
  );

  return (
    <section className="text-center my-2 md:my-8 px-4">
      {isExpanded ? (
        <div className="max-w-2xl mx-auto bg-card border-2 border-border rounded-xl p-3 md:p-8 [box-shadow:var(--shadow-lg)] transition-all animate-scale-in">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 md:mb-3">
            Welcome, {userName || playerName}! 👋
          </h2>
          <p className="text-muted-foreground mb-3 md:mb-6 text-xs md:text-base">
            Enter your name to track scores and compete on the leaderboard
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-2 sm:gap-0 max-w-md mx-auto">
            <input
              type="text"
              ref={playerNameRef}
              onKeyDown={handleKeyDown}
              defaultValue={playerName}
              placeholder="Your name here"
              className="touch-target flex-1 px-3 py-2.5 md:px-4 md:py-2.5 bg-input border-2 border-border text-foreground rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring font-inherit placeholder:text-muted-foreground/50 transition-all text-sm md:text-base"
              autoFocus
            />
            <button
              onClick={handleSetName}
              className="touch-target px-5 py-2.5 md:px-6 md:py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-md sm:rounded-r-md sm:rounded-l-none transition-all duration-200 border-2 border-primary hover:translate-x-0.5 hover:translate-y-0.5 button-press hover:scale-105 text-sm md:text-base"
            >
              Set Name
            </button>
          </div>
          <button
            onClick={() => {
              vibrate("light");
              setIsExpanded(false);
            }}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            vibrate("light");
            setIsExpanded(true);
          }}
          className="mx-auto flex items-center gap-2 px-4 py-2 bg-card/50 hover:bg-card border border-border rounded-full transition-all hover:scale-105 button-press [box-shadow:var(--shadow-sm)]"
        >
          <span className="text-sm md:text-base font-medium text-foreground">👤 {userName || playerName}</span>
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      )}
    </section>
  );
};
