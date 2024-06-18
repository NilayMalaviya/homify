import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { categories } from "../data";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";

export default function Home() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const { listings } = useSelector((state) => state.user);

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        `/server/listing/get?category=${selectedCategory}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setListings(data));
      setLoading(false);
      
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    } catch (err) {
      console.log("Something Went Wrong!!!");
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  const renderIcon = (IconComponent) => {
    return <IconComponent className="w-16 h-20" />;
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const res = await fetch(`/server/listing/get?category=${selectedCategory}&&startInd=${startIndex}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    dispatch(setListings([...listings, ...data]));
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-24 px-20 justify-center mx-auto bg-slate-400 shadow-lg">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Book the Perfect Stay,
          <br />
          Experience Perfect Days with{" "}
          <span className="text-white">Homify</span>
        </h1>
        <div className="text-white text-sm sm:text-base mt-4 mb-4">
          Embark on a seamless journey to find your perfect retreat. Homify
          connects you with places where every moment becomes a cherished
          memory.
          <br />
          Dive into luxury and comfort with our hand-selected properties, where
          every detail ensures your stay is nothing short of perfect.
        </div>
        <div>
          <Link
            to={"/search"}
            className="text-sm sm:text-base text-black font-semibold hover:underline"
          >
            Begin Your Journey...
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-black mt-7 text-2xl text-center font-bold uppercase">
          loading...
        </p>
      ) : (
        <div className="m-16">
          <p className="text-slate-700 my-16 text-4xl pb-4 text-center font-semibold border-b-4  border-slate-700">
            Explore our top categories
          </p>

          <div className="flex flex-wrap gap-8 gap-y-12 justify-between">
            {categories.map((category) => (
              <button
                type="button"
                key={category.label}
                className={`flex flex-col items-center p-6 rounded-xl shadow-md hover:scale-125 duration-100 ${
                  selectedCategory === category.label
                    ? "ring-4 ring-slate-700 shadow-lg"
                    : ""
                }`}
                onClick={() => setSelectedCategory(category.label)}
              >
                {renderIcon(category.icon)}
                <span className="mt-2 text-xl text-gray-800">
                  {category.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col my-10 mx-7">
            <div className="flex flex-wrap gap-8">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing}
                  booking={false}
                  property={false}
                  key={listing._id}
                />
              ))}
            </div>
          </div>
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-slate-800 font-semibold text-2xl hover:underline text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      )}
    </>
  );
}
