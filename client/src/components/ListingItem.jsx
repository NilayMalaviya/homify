import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaHeart,FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";

export default function ListingItem({ listing, booking }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [owner, setOwner] = useState(null);
  const dispatch = useDispatch();
  // console.log(booking);
  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % listing.imageUrls.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + listing.imageUrls.length) % listing.imageUrls.length
    );
  };

  useEffect(() => {
    fetchOwner(listing.userRef);
  });

  const fetchOwner = async (userRef) => {
    try {
      const res = await fetch(`/server/user/${userRef}`);
      const data = await res.json();
      setOwner(data);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item._id === listing._id);

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
    <div className="bg-white hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-[240px] cursor-pointer">
      <div
        onClick={() => {
          navigate(`/listing/${listing._id}`);
        }}
        className="relative"
      >
        <img
          src={listing?.imageUrls[currentImageIndex]}
          alt="listing photo"
          className="h-[180px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />

        {user && owner && user._id !== owner._id && (
          <button
            className={`absolute z-10 top-2 right-2 ${
              isLiked ? " text-red-600" : "text-white"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              patchWishList();
            }}
          >
            <FaHeart className="h-6 w-6" />
          </button>
        )}

        {listing.imageUrls.length > 1 && (
          <>
            <button
              className="absolute z-10 top-1/3 left-0 transform -translate-y-1/2 rounded-full m-1 p-1 bg-white bg-opacity-85"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <FaChevronLeft className="h-3 w-3 text-gray-800" />
            </button>
            <button
              className="absolute z-10 top-1/3 right-0 transform -translate-y-1/2 rounded-full m-1 p-1 bg-white bg-opacity-85"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <FaChevronRight className="h-3 w-3 text-gray-800" />
            </button>
          </>
        )}

        <div className="p-3 flex flex-col gap-1 w-full">
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-500" />
            <p className="text-sm text-black truncate w-full font-semibold">
              {listing.city}, {listing.state}, {listing.country}
            </p>
          </div>

          <p className="text-sm text-black truncate w-full font-semibold">
            {listing.category}
          </p>

          {booking && (
            <>
              <p className="text-sm text-black truncate w-full font-semibold">
                {booking.startDate} - {booking.endDate}
              </p>
              <p className="text-sm text-black truncate w-full font-semibold">
                <span className="text-xl font-bold">₹{booking.totalPrice.toLocaleString("en-IN")}</span>{" "}
                total
              </p>
            </>
          )}

          {!booking && (
            <>
              <p className="text-sm text-black truncate w-full font-semibold">
                <span className="text-xl font-bold text-black">
                  ₹{listing.price.toLocaleString("en-IN")}
                </span>{" "}
                per night
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
