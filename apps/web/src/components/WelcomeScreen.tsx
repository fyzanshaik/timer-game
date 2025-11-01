import { useState, useEffect } from "react";
import { useHaptics } from "../hooks/useHaptics";

interface WelcomeScreenProps {
  onStart: () => void;
  userName?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, userName }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { vibrate } = useHaptics();

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    if (hasSeenWelcome) {
      setIsVisible(false);
      onStart();
    }
  }, [onStart]);

  const handleStart = () => {
    vibrate("success");
    const sound = new Audio("/game-start.mp3");
    sound.play().catch(() => {});
    sessionStorage.setItem("hasSeenWelcome", "true");
    setIsVisible(false);
    onStart();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-2xl mx-auto px-6 text-center animate-scale-in">
        <div className="mb-8 relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary via-accent to-secondary opacity-30 animate-pulse-glow"></div>
          <h1 className="relative font-['Handjet',monospace] text-6xl md:text-8xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
            Timer Game
          </h1>
        </div>

        <div className="mb-8 space-y-4">
          <p className="text-xl md:text-2xl text-foreground/90 font-semibold">
            Welcome{userName ? `, ${userName}` : ""}! 👋
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Test your timing skills! Stop the timer as close to the target time as possible. The closer you get, the
            higher your score!
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border-2 border-primary/20 rounded-full">
            <span className="text-2xl">⚡</span>
            <span className="text-foreground/80">Quick Reflexes</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border-2 border-accent/20 rounded-full">
            <span className="text-2xl">🎯</span>
            <span className="text-foreground/80">Perfect Timing</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border-2 border-secondary/20 rounded-full">
            <span className="text-2xl">🏆</span>
            <span className="text-foreground/80">High Scores</span>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="group relative px-12 py-5 text-xl font-bold text-primary-foreground rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center gap-3">
            <span>Start Playing</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </button>

        <div className="mt-8 flex justify-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce-delay-0"></div>
          <div className="w-3 h-3 rounded-full bg-accent animate-bounce-delay-1"></div>
          <div className="w-3 h-3 rounded-full bg-secondary animate-bounce-delay-2"></div>
        </div>
      </div>
    </div>
  );
};
