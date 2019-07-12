const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

const dotenv = require("dotenv");

dotenv.config();

const db = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false
    });

    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err.message);
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
