const express = require("express");
const { createBooking } = require("../controllers/booking");
const { verifyToken } = require("../utils/verifyUser");

const router = new express.Router();

router.post("/create", verifyToken, createBooking);

module.exports = router;
