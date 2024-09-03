// "admin" routes of the app
const express = require("express");
const router = express.Router();

const adminControllers = require("../controllers/admin.js")

router.get("/apartment/new-apartment", adminControllers.getNewApartmentForm );
router.post("/apartment/new-apartment", adminControllers.postNewApartment );
router.get("/apartment/:idApartment/edit", adminControllers.getEditApartmentForm)

module.exports = router;