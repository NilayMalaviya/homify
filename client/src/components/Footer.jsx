import { Link } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useSelector } from "react-redux";

export default function Footer() {
  const user = useSelector((state) => state.user); // Assuming you have user state in Redux

  return (
    <footer className="bg-white dark:bg-slate-300 mt-5">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <Link
            to="/"
            className="flex items-center"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src={Logo}
              className="h-12 mr-3 rounded-lg"
              alt="Homify Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-slate-950">
              Homify
            </span>
          </Link>
        </div>

        <div className="mt-6 sm:mt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-slate-950 font-medium">
            <h3 className="text-lg font-bold mb-3">Homify</h3>
            <ul>
              <li className="mb-2">
                <Link
                  to="/"
                  className="hover:underline"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/about-us"
                  className="hover:underline"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:underline"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-slate-950 font-medium">
            <h3 className="text-lg font-bold mb-3">Lists</h3>
            <ul>
              <li className="mb-2">
                <Link
                  to="/wish-list"
                  className="hover:underline"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Wish List
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/trip-list"
                  className="hover:underline"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Trip List
                </Link>
              </li>
              <li>
                <Link
                  to="/property-list"
                  className="hover:underline"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Property List
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-slate-950 font-medium">
            <h3 className="text-lg font-bold mb-3">Reservations</h3>
            <ul>
              <li className="mb-2">
                <Link
                  to="/reservation-list"
                  className="hover:underline"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Reservation List
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />

      <div className="text-sm text-gray-900 text-center pb-4">
        © {new Date().getFullYear()}{" "}
        <Link to="/" className="hover:underline">
          Homify™
        </Link>
        . All Rights Reserved.
      </div>
    </footer>
  );
}
