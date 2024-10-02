// "api" routes of the app
const express = require("express");
const router = express.Router();
/* const { query } = require("express-validator") */

const apiControllers = require('../controllers/api.js');

router.get("/apartments", /* query("limit").isInt({ min: 1, max: 100000}), */ apiControllers.getApartments );


module.exports = router;