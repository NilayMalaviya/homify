import { Link } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useSelector } from "react-redux";

export default function Footer() {
  const { user } = useSelector((state) => state.user);

  return (
    <footer className="bg-white dark:bg-slate-300 mt-5">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex gap-x-96">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
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

          <h2 className="text-lg font-semibold text-slate-950 uppercase ml-96 pl-10">
            Useful links
          </h2>
        </div>


        <div className="flex justify-end">
          <div className="mr-9 grid grid-cols-3 gap-4 p-3">
            <div>
              <ul className="text-slate-950 font-medium">
                <li className="mb-4">
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="hover:underline">
                    About us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <ul className="text-slate-950 font-medium">
                <li className="mb-1.5">
                  <Link to="/profile" className="hover:underline ">
                    Profile
                  </Link>
                </li>
                <li className="mb-1.5">
                  <Link to="/wish-list" className="hover:underline">
                    Wish List
                  </Link>
                </li>
                <li>
                  <Link to="/trip-list" className="hover:underline">
                    Trip List
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <ul className="text-slate-950 font-medium">
                <li className="mb-4">
                  <Link to="/property-list" className="hover:underline">
                    Property List
                  </Link>
                </li>
                <li>
                  <Link to="/reservation-list" className="hover:underline">
                    Reservation List
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        <div className="sm:flex sm:items-center sm:justify-center">
          <span className="text-sm text-gray-900 text-center justify-center">
            © 2024{" "}
            <Link to="/" className="hover:underline">
              Homify™
            </Link>
            . All Rights Reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}
