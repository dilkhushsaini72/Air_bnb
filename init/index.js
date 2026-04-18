const mongoose = require("mongoose");
const data = require("./data");
const Listing = require("../models/listing");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Air-bnb");
    console.log("mongoDB connected::");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const initDB = async () => {
  await Listing.deleteMany({});
  //   console.log(data.data);
  await Listing.insertMany(data.data);
  console.log("Data initialization succussfull..");
};

initDB();
