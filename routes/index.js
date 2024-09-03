// "public" routes of the app
const express = require("express");
const router = express.Router();

const indexControllers = require("../controllers/index.js")

router.get("/", indexControllers.getApartments)

router.get("/apartment/:idApartment", indexControllers.getApartmentById)

module.exports = router;