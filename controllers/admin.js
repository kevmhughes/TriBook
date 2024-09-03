const Apartment = require("../models/apartment.model.js");

const getNewApartmentForm = (req, res) => {
  res.render("new-apartment.ejs", {
    // send empty apartment object
    apartment: {},
  });
};

const getEditApartmentForm = async (req, res) => {
  const { idApartment } = req.params;
  const apartment = await Apartment.findById(idApartment);

  res.render("new-apartment.ejs", {
    // send apartment object to fill edit form with apartment data
    apartment,
  });
};

const postNewApartment = async (req, res) => {
    // "id" from name="id" in the HTML form
  const { id } = req.body;

    // it is possible to send simply req.body in the following objects 
    // => await Apartment.findByIdAndUpdate(id, {req.body);
    // => await Apartment.create(id, {req.body);
    console.log(req.body)

  if (id) {
    await Apartment.findByIdAndUpdate(id, {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      size: req.body.size,
      mainPhoto: req.body.mainPhoto,
    });

    res.send("Apartment updated");
  } else {
    await Apartment.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      size: req.body.size,
      mainPhoto: req.body.mainPhoto,
    });

    res.send("Apartment added");
  }
};

module.exports = {
  getNewApartmentForm,
  postNewApartment,
  getEditApartmentForm,
};
