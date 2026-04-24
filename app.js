const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");
const WrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

const app = express();
const PORT = 8080;

// ejs-mate setup (order important)
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const validateListing = (req, res, next) => {};

// DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Air-bnb");
    console.log("mongoDB connected...");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Get root request");
});

// Index Route
app.get(
  "/listing",
  WrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("Listings/index.ejs", { allListings });
  }),
);

// New Form Route
app.get("/listing/new", (req, res) => {
  res.render("Listings/new.ejs");
});

// Show Route
app.get(
  "/listing/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      throw new ExpressError(404, "Listing not found!");
    }

    res.render("Listings/show.ejs", { listing });
  }),
);

// Create Route
app.post(
  "/listing/new",
  WrapAsync(async (req, res) => {
    const result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  }),
);

// Edit Route
app.get(
  "/listing/:id/edit",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      throw new ExpressError(404, "Listing not found!");
    }

    res.render("Listings/edit.ejs", { listing });
  }),
);

// Update Route
app.put(
  "/listing/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid data..");
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { new: true },
    );

    if (!updatedListing) {
      throw new ExpressError(404, "Listing not found!");
    }

    res.redirect(`/listing/${id}`);
  }),
);

// Delete Route
app.delete(
  "/listing/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
  }),
);

// Page Not Found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
