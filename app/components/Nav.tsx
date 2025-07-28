import { NavLink } from "react-router";

const Nav = () => {
  const activeStyle =
    "text-gray-900 mx-3 bg-gray-300 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-md transition-all duration-200 text-sm font-medium hover:shadow-md transform hover:-translate-y-0.5";
  const inactiveStyle =
    "text-gray-700 mx-3 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-md transition-all duration-200 text-sm font-medium hover:shadow-md transform hover:-translate-y-0.5";

  const activeHomeStyle =
    "text-gray-900 mx-3 bg-gray-300 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-md transition-all duration-200 text-sm font-medium hover:shadow-md transform hover:-translate-y-0.5";
  const inactiveHomeStyle =
    "text-gray-700 mx-3 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-md transition-all duration-200 text-sm font-medium hover:shadow-md transform hover:-translate-y-0.5";

  return (
    <>
      {/* Navigation */}
      <div className="w-full flex p-6 items-center">
        <img
          src="/UoG_colour.png"
          alt="Uni"
          className="w-32 h-10 mx-5 cursor-pointer"
          onClick={() => window.open("https://www.gla.ac.uk/", "_blank")}
        />
        {/* Home link on the left */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? activeHomeStyle : inactiveHomeStyle
          }
        >
          Home
        </NavLink>

        {/* Other navigation links on the right */}
        <div className="flex ml-auto">
          <NavLink
            to="/erlang-sandbox"
            className={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }
          >
            Erlang Sandbox
          </NavLink>
          <NavLink
            to="/documentation"
            className={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }
          >
            Documentation
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? activeStyle : inactiveStyle
            }
          >
            About
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Nav;
