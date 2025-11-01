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
    <div className="my-3 md:my-5 p-5 md:p-8 bg-primary/10 rounded-xl border-2 border-primary [box-shadow:var(--shadow-md)] animate-float">
      <h1 className="font-['Handjet',monospace] text-6xl md:text-7xl lg:text-8xl font-black text-primary animate-pulse drop-shadow-lg">
        {randNumber}
      </h1>
    </div>
  );
};
