const Apartment = require('../models/apartment.model.js');

const getApartments = async (req, res) => {
    const apartments = await Apartment.find();

    res.render("home", {
        apartments
    })
}

module.exports = {
    getApartments
}