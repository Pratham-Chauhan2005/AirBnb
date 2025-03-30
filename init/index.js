const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) => ({
      ...obj , owner:"67dfe03e8668279965234fc8",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data is successfully inserted");
}

initDB(); 

