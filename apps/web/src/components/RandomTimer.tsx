import { useEffect, useState } from "react";

interface RandomTimerProps {
  targetTime: number;
}

export const RandomTimer: React.FC<RandomTimerProps> = ({ targetTime }) => {
  const [randNumber, setRandomNumber] = useState<string>("0");

  useEffect(() => {
    const interval = setInterval(() => {
      let newRandomNumber: number;

      do {
        newRandomNumber = Math.random() * targetTime;
      } while (newRandomNumber === 1);

      if (newRandomNumber === 1) {
        setRandomNumber(newRandomNumber.toFixed(2));
      } else {
        setRandomNumber(Math.round(newRandomNumber).toString());
      }
    }, 100);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="my-5 p-8 bg-accent/20 rounded-xl border-2 border-accent [box-shadow:var(--shadow-md)]">
      <h1 className="font-['Handjet',monospace] text-7xl md:text-8xl font-black text-accent animate-pulse">
        {randNumber}
      </h1>
    </div>
  );
};
