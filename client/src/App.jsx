import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AboutUs from "./pages/AboutUs";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import CreateListing from "./pages/CreateListing";
import PropertyList from "./pages/PropertyList";
import TripList from "./pages/TripList";
import WishList from "./pages/WishList";
import ReservationList from "./pages/ReservationList";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/property-list" element={<PropertyList />} />
          <Route path="/trip-list" element={<TripList />} />
          <Route path="/wish-list" element={<WishList />} />
          <Route path="/reservation-list" element={<ReservationList />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
