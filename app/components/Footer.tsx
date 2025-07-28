const Footer = () => {
  return (
    <div className="w-full flex p-6 items-center justify-between">
      <img
        src="/UoG_colour.png"
        alt="Uni"
        className="w-32 h-10 mx-5 cursor-pointer"
        onClick={() => window.open("https://www.gla.ac.uk/", "_blank")}
      />
      <div className="flex">
        <a href="https://www.gla.ac.uk/privacy/" className="mx-5 px-2">
          Privacy
        </a>
        <a href="https://www.gla.ac.uk/accessibility/" className="mx-5 px-2">
          Accessibility
        </a>
        <a href="https://www.gla.ac.uk/terms/" className="mx-5 px-2">
          Terms
        </a>
        <a href="https://x.com/UofGlasgow" className="mx-5 px-2">
          Twitter(X)
        </a>
      </div>
    </div>
  );
};

export default Footer;
