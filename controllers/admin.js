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

  const services = ["tv", "airConditioning", "centralHeating", "disabledAccess", "kitchen", "wifi"];
  services.forEach(service => {
    if (req.body[service] === undefined) {
      req.body[service] = false;
    }
  });

  if (id) {
    console.log(req.body)
    await Apartment.findByIdAndUpdate(id, req.body);

    res.send("Apartment updated");
  } else {
    await Apartment.create(req.body);

    res.send("Apartment added");
  }
};

module.exports = {
  getNewApartmentForm,
  postNewApartment,
  getEditApartmentForm,
};
