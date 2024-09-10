// "public" routes of the app
const express = require("express");
const router = express.Router();

const indexControllers = require("../controllers/index.js")

router.get("/", indexControllers.getApartments)

router.get("/search", indexControllers.searchApartments)

router.get("/dashboard", indexControllers.getDashboard)

router.get("/apartment/:idApartment", indexControllers.getApartmentById)

router.post("/apartment/new-reservation", indexControllers.postNewReservation)

module.exports = router;