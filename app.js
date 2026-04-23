const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");
const wrapeAsync = require("./utils/wrapAsync.js");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Air-bnb");
    console.log("mongoDB connected::");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("Get root request");
});

app.get("/listing", async (req, res) => {
  const allListings = await Listing.find();
  res.render("./Listings/index.ejs", { allListings });
});

app.get("/listing/new", (req, res) => {
  res.render("./Listings/new.ejs");
});

// Show route for single title...
app.get("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./Listings/show.ejs", { listing });
});

//create route
app.post(
  "/listing/new",
  wrapeAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  }),
);

// Edit route
app.get("/listing/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./Listings/edit.ejs", { listing });
});

app.put("/listing/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.body.listing);
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
});

// delete route
app.delete("/listing/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

// app.get("/testlistings", async (req, res) => {
//   let listing = new Listing({
//     title: "my new house",
//     description: "this is my new house for living",
//     price: 18000,
//     location: "jaipur",
//     country: "India",
//   });

//   await listing.save();
//   console.log("your listing was saved..");
//   res.send("successfully tested listings..");
// });

app.use((err, req, res, next) => {
  res.send("something wents wronge..");
});

app.listen(PORT, () => {
  console.log("server started..");
});
