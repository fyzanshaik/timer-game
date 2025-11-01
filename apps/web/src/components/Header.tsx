export const Header = () => {
  return (
    <header className="text-center py-10 mb-8">
      <h1 className="font-['Handjet',monospace] text-5xl md:text-7xl font-black uppercase text-primary tracking-wider mb-4">
        The <em className="not-italic text-accent">Almost</em> Final Countdown
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mt-4 font-medium px-4">
        Stop the timer once you estimate that time is (almost) up
      </p>
    </header>
  );
};
