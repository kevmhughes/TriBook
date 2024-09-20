// "api" routes of the app
const express = require("express");
const router = express.Router();

const apiControllers = require('../controllers/api.js');


router.get("/apartments", apiControllers.getApartments );


module.exports = router;