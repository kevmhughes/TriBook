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
    let { maxPrice, minPrice, numberOfGuests, location } = req.query

    if (minPrice == "") {
        minPrice = "0"
    } 

    if (maxPrice == "") {
        maxPrice = "10000"
    } 

    if (numberOfGuests == "") {
        numberOfGuests = "1"
    } 

    const searchQuery = {
        price: {
            $gte: minPrice,
            $lte: maxPrice
        },
        maxNumberOfGuests: {
            $gte: numberOfGuests
        }
    };

    if (location) {
        searchQuery.city = location;
    }


    const apartments = await Apartment.find(searchQuery);


  console.log("min price: ", minPrice)
  console.log("max price: ", maxPrice)
  console.log("number of guests: ", numberOfGuests)
  console.log("location: ", location)
  console.log("apartment one", apartments[0])

    if (apartments.length == 0) {
        console.log("number of apartments: ", apartments.length)
        res.send("create an error message later - SHOW A LIST OF SOME APARTMENTS ANYWAY!!!!")
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