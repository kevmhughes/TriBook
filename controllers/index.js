const Apartment = require('../models/apartment.model.js');

const getApartments = async (req, res) => {
    const apartments = await Apartment.find();

    res.render("home", {
        apartments
    })
}

const getApartmentById = async (req, res) => {
    console.log(req.params)
    const {idApartment } = req.params 
    const selectedApartment = await Apartment.findById(idApartment);

    res.render("apartment-details", {
        selectedApartment
    })
}

module.exports = {
    getApartments,
    getApartmentById
}