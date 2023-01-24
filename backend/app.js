// https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6

// packages
const express = require("express");
const app = express();

require("dotenv").config();
console.log(process.env.S3_BUCKET);
console.log(process.env.DB_URL);

const mongoose = require("mongoose");

// const router = express.Router(); // TEST do I need this here?
// const Sauce = require("./models/sauce"); // TEST don't need that?

const path = require("path");

const saucesRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

app.use(express.json());

// DB connection
mongoose
  .connect(
    process.env.DB_URL // TODO
    // "mongodb+srv://TestUser616:TestUserGenesis@courseworkn01.kykuvcy.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

// CORS Errors handling
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// file handling
app.use("/images", express.static(path.join(__dirname, "images")));

// routes
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;

// BUG FIXME LEG TEST DEL HINT BLOCK ASK TODO WEIRD CHECK DEV VALIDATOR
