const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://images.pexels.com/photos/36419543/pexels-photo-36419543.jpeg",
    set: (v) =>
      v === ""
        ? "https://images.pexels.com/photos/36419543/pexels-photo-36419543.jpeg"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
