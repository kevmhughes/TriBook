const Apartment = require("../models/apartment.model.js")

const getNewApartmentForm = (req, res) => {
    res.render("new-apartment.ejs")
}

const postNewApartment = async (req, res) => {

    console.log("console log", req.body)
    
    await Apartment.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        size: req.body.size,
        mainPhoto: req.body.mainPhoto
    });

    res.send('Apartment added');
}


module.exports = {
    getNewApartmentForm,
    postNewApartment
}