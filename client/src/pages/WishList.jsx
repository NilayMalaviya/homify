import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ListingItem from "../components/ListingItem";

export default function WishList() {
  const { user } = useSelector((state) => state.user);
  const wishList = user.wishList;
  return (
    <div className="min-h-80 mb-14">
      <p className="text-black mt-5 text-4xl text-center font-semibold uppercase">
        your wish list
      </p>
      <div className="flex flex-col my-14 mx-24">
        <div className="flex flex-wrap gap-6">
          {wishList.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
