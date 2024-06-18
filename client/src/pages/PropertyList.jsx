import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { setPropertyList } from "../redux/state";

export default function PropertyList() {
  const [showListingsErr, setShowListingsErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const propertyList = user.propertyList;

  const dispatch = useDispatch();

  useEffect(() => {
    handleShowListings();
  }, []);

  const handleShowListings = async () => {
    try {
      setShowListingsErr(null);
      setLoading(true);

      const res = await fetch(`/server/user/listings/${user._id}`);

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      dispatch(setPropertyList(data));
    } catch (error) {
      setShowListingsErr(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-80 mb-14">
      {loading && (
        <p className="text-black mt-5 text-2xl text-center font-bold uppercase">
          loading...
        </p>
      )}

      {!loading && showListingsErr && (
        <p className="text-red-700 mt-5 text-2xl text-center font-bold">
          {showListingsErr}
        </p>
      )}

      {!loading && propertyList && propertyList.length > 0 && (
        <>
          <p className="text-black mt-5 text-4xl text-center font-semibold uppercase">
            your property list
          </p>
          <div className="flex flex-col my-14 mx-24">
            <div className="flex flex-wrap gap-6">
              {propertyList.map((listing) => (
                <ListingItem
                  listing={listing}
                  booking={false}
                  property={true}
                  key={listing._id}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {!loading && propertyList && propertyList.length == 0 && (
        <p className="text-black mt-5 text-4xl text-center font-semibold uppercase">
          You do not have any listed properties
        </p>
      )}
    </div>
  );
}
