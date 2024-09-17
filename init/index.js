const mongoose = require("mongoose");
const initData = require("./data.js");
//requiring the Listing schema
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:'66e1e16dde1757fbeaf45147'}));
  await Listing.insertMany(initData.data,{runValidators:true,new:true});
  console.log("data was initialized");
};

initDB();