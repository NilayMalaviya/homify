const express = require("express");
const { verifyToken } = require("../utils/verifyUser");
const {
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
  getUserBookings,
  updateWishlist,
  getUserReservations,
} = require("../controllers/user");
const router = new express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", getUser);
router.get("/bookings/:id", verifyToken, getUserBookings);
router.patch("/:userId/:listingId", verifyToken, updateWishlist);
router.get("/reservations/:id", verifyToken, getUserReservations);

module.exports = router;
