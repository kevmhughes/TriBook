const Apartment = require('../models/apartment.model.js');
const Reservation = require("../models/reservation.model.js");

const getApartments = async (req, res) => {
    const apartments = await Apartment.find();

    console.log(res.locals.isAdmin)

    res.render("home", {
        apartments
    })
}

const getApartmentById = async (req, res) => {
    const {idApartment } = req.params 
    const selectedApartment = await Apartment.findById(idApartment);

    res.render("apartment-details", {
        selectedApartment
    })
}

const searchApartments = async (req, res) => {
    const { maxPrice } = req.query
    const apartments = await Apartment.find({price: {$lte: maxPrice}})

    if (apartments.length == 0) {
        res.send("create an error message later")
    }
    res.render("home", {
        apartments
    })
}

const postNewReservation = async (req, res) => {

   await Reservation.create(
        {   
        email: req.body.email,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        apartment: req.body.id
        }
   );

   const checkReservation = await Reservation.find()
   .populate('apartment')

   console.log(checkReservation)

   res.json(req.body);

}

module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation
}