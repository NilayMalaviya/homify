const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id)
    return res.status(401).json({ message: "Unauthorized Access" });

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
      const sameUsername = await User.findOne({ username: req.body.username });
      if (sameUsername) {
        return res.status(400).json({ message: "userName already taken" });
      }
    }
    if (req.body.email) {
      const sameEmail = await User.findOne({ email: req.body.email });
      if (sameEmail) {
        return res.status(400).json({ message: "Email already taken" });
      }
    }

    const updateduser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...info } = updateduser._doc;

    return res.status(200).json(info);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id)
    return res.status(401).json({ message: "Unauthorized Access" });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User deleted successfully!!!" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};

const getUserListings = async (req, res) => {
  if (req.user.id !== req.params.id)
    return res.status(401).json({ message: "Unauthorized Access" });

  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(401).json({ message: "User not found!!" });

    const { password, ...info } = user._doc;
    return res.status(200).json(info);
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
};

const getUserBookings = async (req, res) => {
  if (req.user.id !== req.params.id)
    return res.status(401).json({ message: "Unauthorized Access" });

  try {
    const bookings = await Booking.find({ userRef: req.params.id });
    res.status(200).json(bookings);
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
};

const updateWishlist = async (req, res) => {
  try {
    const { userId, listingId } = req.params;
    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId)

    const favoriteListing = user.wishList.find(
      (item) => item._id.toString() === listingId
    );

    if (favoriteListing) {
      user.wishList = user.wishList.filter(
        (item) => item._id.toString() !== listingId
      );
      await user.save();
      res
        .status(200)
        .json({
          message: "Listing is removed from wish list",
          wishList: user.wishList,
        });
    } else {
      user.wishList.push(listing);
      await user.save();
      res
        .status(200)
        .json({
          message: "Listing is added to wish list",
          wishList: user.wishList,
        });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const getUserReservations = async (req, res) => {
  if (req.user.id !== req.params.id)
    return res.status(401).json({ message: "Unauthorized Access" });

  try {
    const reservations = await Booking.find({ hostRef: req.params.id });
    res.status(200).json(reservations);
  } catch (error) {
    return res.status(401).json({ message: "Bad Request" });
  }
};

module.exports = { 
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
  getUserBookings,
  updateWishlist,
  getUserReservations
};
