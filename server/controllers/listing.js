const Listing = require("../models/listing");

const createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body);

    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return res.status(400).json({ message: "Listing Not Found!!" });
  if (req.user.id !== listing.userRef)
    return res.status(400).json({ message: "Unauthorized Access!!" });

  try {
    await Listing.findByIdAndDelete(req.params.id);

    res.status(201).json({ message: "Your Listing has been deleted!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return res.status(400).json({ message: "Listing Not Found!!" });
  if (req.user.id !== listing.userRef)
    return res.status(400).json({ message: "Unauthorized Access!!" });

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing)
      return res.status(400).json({ message: "Listing Not Found!!" });

    res.status(200).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getListings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startInd = parseInt(req.query.startInd) || 0;

    const categoriesArray = req.query.category
      ? req.query.category.split(",")
      : [];
    const typesArray = req.query.type ? req.query.type.split(",") : [];

    let type, category;
    if (typesArray.length === 0) {
      type = { $in: ["An entire place", "Rooms", "A Shared Room"] };
    } else {
      type = { $in: typesArray };
    }

    if (
      categoriesArray.length === 0 ||
      (categoriesArray.length === 1 && categoriesArray[0] === "All")
    ) {
      category = {
        $in: [
          "All",
          "Beachfront",
          "Windmills",
          "Iconic cities",
          "Barns",
          "Luxury",
          "Desert",
          "Arctic",
          "Camping",
          "Caves",
          "Amazing Pools",
          "Ski-in/out",
          "Castles",
          "Lakefront",
          "Islands",
          "Countryside",
        ],
      };
    } else {
      category = { $in: categoriesArray };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { city: { $regex: searchTerm, $options: "i" } },
        { state: { $regex: searchTerm, $options: "i" } },
        { country: { $regex: searchTerm, $options: "i" } },
      ],
      type,
      category,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startInd);

    return res.status(200).json(listings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
};
