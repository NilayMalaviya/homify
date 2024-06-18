import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { facilities } from "../data";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import { Link } from "react-router-dom";
import { setPropertyList, setWishList } from "../redux/state";

export default function Listing() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [listing, setListing] = useState(null);
  const [owner, setOwner] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setErr(false);

      const listingId = params.listingId;
      const res = await fetch(`/server/listing/get/${listingId}`);

      const data = await res.json();
      if (!res.ok) throw new Error("Error fetching listing!");

      setListing(data);
      setLoading(false);
      setErr(false);
      fetchOwner(data.userRef);
    } catch (error) {
      setLoading(false);
      setErr(true);
    }
  };

  const fetchOwner = async (userRef) => {
    try {
      const res = await fetch(`/server/user/${userRef}`);
      const data = await res.json();
      setOwner(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListing();
    console.log(owner);
  }, [params.listingId]);

  const renderIcon = (IconComponent) => {
    return <IconComponent className="w-8 h-10" />;
  };

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24);

  const wishList = user?.wishList || [];
  const isLiked = wishList?.find((item) => item?._id === listing?._id);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/server/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      dispatch(setPropertyList(data));
      navigate("/property-list");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const bookingForm = {
        userRef: user._id,
        listingId: listing._id,
        hostRef: owner._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      const res = await fetch("/server/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      navigate("/trip-list");
    } catch (error) {
      console.log(error);
    }
  };

  const patchWishList = async () => {
    if (user._id !== owner._id) {
      const response = await fetch(`/server/user/${user._id}/${listing._id}`, {
        method: "PATCH",
        header: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch(setWishList(data.wishList));
    } else {
      return;
    }
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-3xl">Loading...</p>}
      {err && (
        <p className="text-center my-7 text-3xl text-red-700">
          Something went wrong!!!
        </p>
      )}

      {listing && !loading && !err && (
        <div className="mx-16 p-10 xl:p-20 lg:p-12 sm:p-5">
          <div className="sm:items-start sm:flex-row sm:gap-4 flex flex-col flex-wrap justify-between items-center gap-5 p-0">
            <h1 className="text-4xl font-semibold ">{listing.title}</h1>

            {user && owner && user._id === owner._id && (
              <div className="px-6 py-4 flex gap-4">
                <Link to={`/update-listing/${listing._id}`}>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Update
                  </button>
                </Link>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleListingDelete(listing._id);
                  }}
                >
                  Delete
                </button>
              </div>
            )}

            {user && owner && user._id !== owner._id && (
              <div className="flex flex-row gap-3 shadow-lg p-4 shadow-slate-950">
                <button
                  className={` ${isLiked ? " text-red-600" : "text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    patchWishList();
                  }}
                >
                  <FaHeart className="h-6 w-6" />
                </button>
                <div className="text-xl font-semibold">like</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 p-2 mb-4">
            {listing.imageUrls.map((url) => (
              <img
                key={url}
                src={url}
                alt="listing photo"
                className="max-w-[230px] hover:scale-110 transition-scale duration-100 hover:shadow-lg ease-in"
              />
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {listing.type} in {listing.city}, {listing.state},{" "}
              {listing.country}
            </h2>
            <p className="text-gray-600">
              {listing.guests} {listing.guests === 1 ? "guest" : "guests"} -{" "}
              {listing.bedrooms}{" "}
              {listing.bedrooms === 1 ? "bedroom" : "bedrooms"} -{" "}
              {listing.bathrooms}{" "}
              {listing.bathrooms === 1 ? "bathroom" : "bathrooms"}
            </p>
            <hr className="border-t-2 border-black border-opacity-70" />
          </div>

          {owner && (
            <div className="">
              <div className="flex gap-5 items-center">
                <img
                  src={owner.avatar}
                  className="w-12 h-12 m-4 border-2 border-black rounded-full"
                />
                <h3 className="text-2xl">Hosted by {owner.username}</h3>
              </div>
              <hr className="border-t-2 border-black border-opacity-70" />
            </div>
          )}

          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Description
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl">{listing.description}</p>
            <hr className="border-t-2 border-black border-opacity-70" />
          </div>

          <div className="mt-7 flex justify-between">
            <div className="">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                What this place offers?
              </h2>

              <div className="grid grid-cols-2 gap-x-56 mx-auto my-7.5 w-full">
                {listing.amenities.map((item, index) => (
                  <div
                    className="flex items-center gap-5 text-lg font-semibold mb-5"
                    key={index}
                  >
                    <div className="text-3xl">
                      {renderIcon(
                        facilities.find((facility) => facility.name === item)
                          .icon
                      )}
                    </div>
                    <p className="m-0">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {owner && user && owner._id != user._id && (
              <div className="">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  How long do you want to stay?
                </h2>

                <div className="my-7.5">
                  <DateRange ranges={dateRange} onChange={handleSelect} />
                  {dayCount > 1 ? (
                    <h2 className="mb-2.5 text-2xl font-semibold text-gray-800">
                      ₹{listing.price.toLocaleString("en-IN")} x {dayCount}{" "}
                      nights
                    </h2>
                  ) : (
                    <h2 className="mb-2.5 text-2xl font-semibold text-gray-800">
                      ₹{listing.price.toLocaleString("en-IN")} x {dayCount}{" "}
                      night
                    </h2>
                  )}

                  <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                    Total price: ₹
                    {(listing.price * dayCount).toLocaleString("en-IN")}
                  </h2>
                  <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
                  <p>End Date: {dateRange[0].endDate.toDateString()}</p>

                  <button
                    className="bg-gray-800 text-white w-full mt-6 p-3 text-2xl rounded-2xl lg:max-w-xs"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    BOOKING
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
