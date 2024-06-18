import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { user } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    // console.log(searchQuery)
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-slate-300 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex">
            <img
              className="rounded-lg w-12 h-12 mr-1.5"
              src={Logo}
              alt="Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-slate-950">
              Homify
            </span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="border-2 border-slate-600 text-slate-200 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-gray-700 font-semibold focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-800"></FaSearch>
          </button>
        </form>

        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-800 hover:underline">
              Home
            </li>
          </Link>

          <Link to="/about-us">
            <li className="hidden sm:inline text-slate-800 hover:underline">
              About Us
            </li>
          </Link>

          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <img
                src={user.avatar}
                alt="Profile"
                className="rounded-full h-7 w-7 object-cover cursor-pointer border border-slate-950"
              />
              {isOpen && (
                <div
                  className="absolute right-0 w-48 bg-white rounded-md border-slate-600 shadow-lg py-0.5 border z-10"
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => setIsOpen(false)}
                >
                  <Link
                    to={"/profile"}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300 hover:shadow-md hover:border-transparent hover:rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to={"/create-listing"}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300 hover:shadow-md hover:border-transparent hover:rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Listing
                  </Link>
                  <Link
                    to={"/trip-list"}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300 hover:shadow-md hover:border-transparent hover:rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Trip List
                  </Link>
                  <Link
                    to={"/wish-list"}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300 hover:shadow-md hover:border-transparent hover:rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Wish List
                  </Link>
                  <Link
                    to={"/property-list"}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300 hover:shadow-md hover:border-transparent hover:rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Property List
                  </Link>
                  <Link
                    to={"/reservation-list"}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300 hover:shadow-md hover:border-transparent hover:rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Reservation List
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in">
              <li className="text-slate-800 hover:underline">Sign in</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
