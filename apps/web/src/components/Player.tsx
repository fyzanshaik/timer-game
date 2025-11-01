import { useRef, useCallback } from "react";
import { useUserSession } from "../hooks/useUser";

interface PlayerProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  userName?: string;
}

export const Player: React.FC<PlayerProps> = ({ playerName, setPlayerName, userName }) => {
  const playerNameRef = useRef<HTMLInputElement | null>(null);
  const { setUserName } = useUserSession();

  const handleSetName = useCallback(() => {
    if (playerNameRef.current) {
      const sound = new Audio("/arcade-casino.wav");
      sound.play().catch(() => {});
      const currentInputValue = playerNameRef.current.value.trim().toLowerCase();
      const newName = currentInputValue || "unknown";
      setPlayerName(newName);
      setUserName(newName);
    }
  }, [setPlayerName, setUserName]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSetName();
    },
    [handleSetName]
  );

  return (
    <section className="text-center my-8 px-4">
      <div className="max-w-2xl mx-auto bg-card border-2 border-border rounded-xl p-8 [box-shadow:var(--shadow-lg)]">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Welcome, {userName || playerName}! 👋</h2>
        <p className="text-muted-foreground mb-6 text-base">
          Enter your name to track scores and compete on the leaderboard
        </p>
        <div className="flex justify-center items-center gap-0 max-w-md mx-auto">
          <input
            type="text"
            ref={playerNameRef}
            onKeyDown={handleKeyDown}
            defaultValue={playerName}
            placeholder="Your name here"
            className="flex-1 px-4 py-2.5 bg-input border-2 border-border text-foreground rounded-l-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring font-inherit placeholder:text-muted-foreground/50 transition-all"
          />
          <button
            onClick={handleSetName}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-r-md transition-all duration-200 border-2 border-primary hover:translate-x-0.5 hover:translate-y-0.5"
          >
            Set Name
          </button>
        </div>
      </div>
    </section>
  );
};
