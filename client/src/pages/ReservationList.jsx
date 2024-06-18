import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { setReservationList } from "../redux/state";

export default function ReservationList() {
  const [showListingsErr, setShowListingsErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState(false);
  const { user } = useSelector((state) => state.user);
  const reservationList = user.reservationList;

  const dispatch = useDispatch();

  useEffect(() => {
    handleShowListings();
  }, []);

  const handleShowListings = async () => {
    try {
      setShowListingsErr(null);
      setLoading(true);

      const res = await fetch(`/server/user/reservations/${user._id}`);

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      dispatch(setReservationList(data));
      fetchShowListings(data);
    } catch (error) {
      setShowListingsErr(error.message);
    }
    setLoading(false);
  };

  const fetchShowListings = async (data) => {
    try {
      setShowListingsErr(null);
      setLoading(true);

      const responses = await Promise.all(
        data.map((item) => fetch(`/server/listing/get/${item.listingId}`))
      );

      const result = await Promise.all(
        responses.map((res) => {
          if (!res.ok) throw new Error("Error fetching listing!");
          return res.json();
        })
      );

      setListings(result);
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

      {!loading && listings && listings.length > 0 && (
        <>
          <p className="text-black mt-5 text-4xl text-center font-semibold uppercase">
            your reservation list
          </p>
          <div className="flex flex-col my-14 mx-24">
            <div className="flex flex-wrap gap-6">
              {reservationList.map((item) => {
                const listing = listings.find(
                  (listing) => listing._id === item.listingId
                );
                return (
                  <ListingItem
                    listing={listing}
                    booking={item}
                    key={item._id}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}

      {!loading && listings && listings.length == 0 && (
        <p className="text-black mt-5 text-4xl text-center font-semibold uppercase">
          you do not have any reservationlist
        </p>
      )}
    </div>
  );
}
