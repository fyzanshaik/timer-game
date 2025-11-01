import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { TimerChallenge } from "../components/TimerChallenge";
import { useCheckUser, useUserSession } from "../hooks/useUser";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { getUserName } = useUserSession();
  const [playerName, setPlayerName] = useState(getUserName());
  const { data: userData } = useCheckUser(playerName);
  const serverCheck = true;

  const userScores = userData?.scores?.[0];
  const userId = userData?.id || 1;

  const timerChallengeArray = [
    { title: "Quick Reflex", targetTime: 1, highScore: userScores?.timer1Score ?? 0 },
    { title: "Speed Test", targetTime: 5, highScore: userScores?.timer5Score ?? 0 },
    { title: "Endurance", targetTime: 10, highScore: userScores?.timer10Score ?? 0 },
    { title: "Focus Mode", targetTime: 15, highScore: userScores?.timer15Score ?? 0 },
    { title: "Ultimate Challenge", targetTime: 30, highScore: userScores?.timer30Score ?? 0 },
  ];

  return (
    <>
      {serverCheck ? (
        <div className="min-h-screen px-4 py-8">
          <Header />
          <Player playerName={playerName} setPlayerName={setPlayerName} userName={userData?.username} />

          <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {timerChallengeArray.map(({ title, targetTime, highScore }) => (
              <TimerChallenge
                key={title}
                title={title}
                targetTime={targetTime}
                userId={userId}
                highScore={highScore}
                userName={userData?.username || "Guest"}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mb-8"></div>
          <h1 className="font-['Handjet',monospace] text-2xl font-bold text-foreground">
            Checking server status... Please wait ⏳
          </h1>
        </div>
      )}
    </>
  );
}
