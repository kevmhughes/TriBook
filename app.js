// import necessary modules
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const dotenv = require('dotenv')
dotenv.config()

// import public routes
const indexRoutes = require("./routes/index")

// import admin routes
const adminRoutes = require("./routes/admin")

// create express instance
const app = express();

//middleware setup
app.use(express.urlencoded({ extended: true })); // parsing form data

app.use((req, res, next) => {
  // sets isAdmin false in all views
  res.locals.isAdmin = false;

  // Call the next function
  next();
});



app.use(morgan("tiny")); // logging requests
app.use("/admin", adminRoutes) // admin routes
app.use("/", indexRoutes) // public routes
app.use(express.static("public")); // serving static files


// defines port: 3000 for dev; process.env.PORT for deployed app
const PORT = process.env.PORT || 3000;

// set view engine
app.set("view engine", "ejs");

async function connectDB() {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI
      );
      console.log("connected to the database")
    } catch (err) {
      console.error(err);
    }
  }
  
  connectDB();

// start server
app.listen(PORT, (req, res) => {
    console.log(`The server is running on port ${PORT}`);
  });
  

