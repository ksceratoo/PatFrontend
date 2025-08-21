import { NavLink } from "react-router";
import { useState } from "react";

const Nav = () => {
  const [open, setOpen] = useState(false);

  const baseLink =
    "px-3 py-2 text-sm font-medium rounded-md  transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5";
  const activeLink =
    "text-gray-900 bg-gray-200 border-gray-300 hover:border-gray-400";
  const inactiveLink =
    "text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400";

  const linkClass = (isActive: boolean) =>
    `${baseLink} ${isActive ? activeLink : inactiveLink}`;

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/documentation", label: "Concepts" },
    { to: "/communication-errors", label: "Example Communication Errors" },
    { to: "/pat-sandbox", label: "Pat Sandbox" },

    // { to: "/erlang-sandbox", label: "Erlang Sandbox" },

    { to: "/about", label: "About" },
  ];

  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-3 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/UoG_colour.png"
              alt="University of Glasgow"
              className="w-28 h-8 sm:w-32 sm:h-10 cursor-pointer shrink-0"
              onClick={() => window.open("https://www.gla.ac.uk/", "_blank")}
            />
            <img
              src="/stardust-white.svg"
              alt="StarDust Logo"
              className="hidden md:block w-28 p-1.5 h-10 cursor-pointer bg-gray-800 rounded-md shrink-0"
              onClick={() =>
                window.open(
                  "https://epsrc-stardust.github.io/index.html",
                  "_blank"
                )
              }
            />
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => linkClass(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5h14a1 1 0 100-2H3a1 1 0 100 2zm14 4H3a1 1 0 100 2h14a1 1 0 100-2zm0 6H3a1 1 0 100 2h14a1 1 0 100-2z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden pb-3">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => linkClass(isActive)}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
