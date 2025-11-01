import { useState, useRef, useEffect, useCallback } from "react";
import { TimerChallenge } from "./TimerChallenge";
import { useHaptics } from "../hooks/useHaptics";

interface Challenge {
  title: string;
  targetTime: number;
  highScore: number;
}

interface ChallengeCarouselProps {
  challenges: Challenge[];
  userId: number;
  userName: string;
}

export const ChallengeCarousel: React.FC<ChallengeCarouselProps> = ({ challenges, userId, userName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { vibrate } = useHaptics();

  const getDifficultyColor = (targetTime: number) => {
    if (targetTime <= 1) return "from-green-400 to-emerald-500";
    if (targetTime <= 5) return "from-blue-400 to-cyan-500";
    if (targetTime <= 10) return "from-purple-400 to-pink-500";
    if (targetTime <= 15) return "from-orange-400 to-red-500";
    return "from-red-500 to-rose-700";
  };

  const getDifficultyBadge = (targetTime: number) => {
    if (targetTime <= 1) return { text: "EASY", emoji: "⚡" };
    if (targetTime <= 5) return { text: "MEDIUM", emoji: "🎯" };
    if (targetTime <= 10) return { text: "HARD", emoji: "🔥" };
    if (targetTime <= 15) return { text: "EXPERT", emoji: "💎" };
    return { text: "MASTER", emoji: "👑" };
  };

  const handleNext = useCallback(() => {
    if (activeIndex < challenges.length - 1) {
      vibrate("light");
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, challenges.length, vibrate]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      vibrate("light");
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex, vibrate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" || target.closest("button")) {
      return;
    }
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 10) {
      setTranslateX(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(translateX) > 100) {
      if (translateX > 0 && activeIndex > 0) {
        handlePrev();
      } else if (translateX < 0 && activeIndex < challenges.length - 1) {
        handleNext();
      }
    }
    setTranslateX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" || target.closest("button")) {
      return;
    }
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 10) {
      setTranslateX(diff);
    }
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (isDragging) {
        setIsDragging(false);
        if (Math.abs(translateX) > 100) {
          if (translateX > 0 && activeIndex > 0) {
            handlePrev();
          } else if (translateX < 0 && activeIndex < challenges.length - 1) {
            handleNext();
          }
        }
        setTranslateX(0);
      }
    };
    window.addEventListener("mouseup", handleMouseUpGlobal);
    return () => window.removeEventListener("mouseup", handleMouseUpGlobal);
  }, [isDragging, translateX, activeIndex, challenges.length, handleNext, handlePrev]);

  const badge = getDifficultyBadge(challenges[activeIndex].targetTime);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4 px-4">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getDifficultyColor(challenges[activeIndex].targetTime)} text-white font-bold text-sm shadow-lg animate-pulse-subtle`}
        >
          <span className="text-lg">{badge.emoji}</span>
          <span>{badge.text}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        {challenges.map((_, index) => (
          <div
            key={index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? "w-10 bg-primary shadow-lg" : "w-2.5 bg-muted"
            }`}
          />
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden touch-pan-y px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% + ${translateX}px))`,
          }}
        >
          {challenges.map((challenge) => (
            <div key={challenge.title} className="w-full flex-shrink-0 px-2">
              <div className="h-full flex items-center justify-center">
                <div className="w-full max-w-md">
                  <TimerChallenge
                    title={challenge.title}
                    targetTime={challenge.targetTime}
                    highScore={challenge.highScore}
                    userId={userId}
                    userName={userName}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-4 px-4">
        <p className="text-sm text-muted-foreground font-medium">
          Challenge {activeIndex + 1} of {challenges.length}
        </p>
      </div>
    </div>
  );
};
