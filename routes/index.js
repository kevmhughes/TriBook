// "public" routes of the app
const express = require("express");
const router = express.Router();

const indexControllers = require("../controllers/index.js")

router.get("/", indexControllers.getApartments)

router.get("/search", indexControllers.searchApartments)

router.get("/dashboard/bookings", indexControllers.getDashboardBookings)

router.get("/dashboard/bookings/cancel/:idReservation", indexControllers.getDashboardBookingsCancel)

router.post("/send-email/:idUser", indexControllers.postSendEmail)

router.get("/dashboard/apartments", indexControllers.getDashboardApartments)

router.get("/reservation", indexControllers.getReservation)

router.get("/apartment/:idApartment", indexControllers.getApartmentById)

router.post("/apartment/new-reservation", indexControllers.postNewReservation)

module.exports = router;