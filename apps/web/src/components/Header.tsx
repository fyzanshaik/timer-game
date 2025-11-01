export const Header = () => {
  return (
    <header className="text-center py-2 md:py-10 mb-1 md:mb-8 px-4">
      <h1 className="font-['Handjet',monospace] text-2xl md:text-5xl lg:text-7xl font-black uppercase text-primary tracking-wide md:tracking-wider mb-0.5 md:mb-4 animate-gradient-x bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
        The <em className="not-italic text-accent">Almost</em> Final Countdown
      </h1>
      <p className="text-xs md:text-lg lg:text-xl text-muted-foreground mt-0.5 md:mt-4 font-medium">
        Stop the timer once you estimate that time is (almost) up
      </p>
    </header>
  );
};
