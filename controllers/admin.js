const Apartment = require("../models/apartment.model.js");

// get form to add new property
const getNewApartmentForm = (req, res) => {
  try {
    res.render("new-apartment", {
      // send empty apartment object
      apartment: {},
    });
  } catch (error) {
    console.error("Error rendering new apartment form:", error);
    res.status(500).render("500", { message: "Failed to load the new apartment form"})
  }
};

// Display form for editing an existing apartment
const getEditApartmentForm = async (req, res) => {
  try {
    const { idApartment } = req.params;
    const apartment = await Apartment.findById(idApartment);

    if (!apartment) {
      // Render the custom 404 page with a message
      return res.status(404).render("404", {
        message: "Apartment not found. It might have been removed or the ID might be incorrect.",
      });
    }

    res.render("new-apartment", {
      apartment, // Pass existing apartment data for form population
    });
  } catch (error) {
    console.error("Error fetching apartment:", error);
    res.status(500).render("500", {
      message: "Server error while fetching apartment. Please try again later.",
    });
  }
};

// Post new property to the database
const postNewApartment = async (req, res) => {
  try {
    // Extract apartment ID from the request body
    const { id } = req.body;

    // Define the list of service features
    const services = [
      "tv",
      "airConditioning",
      "centralHeating",
      "disabledAccess",
      "kitchen",
      "wifi"
    ];

    // Set values to false for services that are not included in the request
    services.forEach(service => {
      if (req.body[service] === undefined) {
        req.body[service] = false;
      }
    });


    // !!! testing ground
    req.body.latitude = parseFloat(req.body.latitude);
    req.body.longitude = parseFloat(req.body.longitude);

    if (id) {
      // Update existing apartment if ID is provided
      await Apartment.findByIdAndUpdate(id, req.body);
      console.log("Apartment updated:", req.body);
      res.send("Apartment updated successfully");
    } else {
      // Create a new apartment if no ID is provided
      await Apartment.create(req.body);
      res.send("Apartment added successfully");
    }
  } catch (error) {
    console.error("Error processing apartment request:", error);
    res.status(500).render("500", { message: "Failed to process the request"})
  }
};

module.exports = {
  getNewApartmentForm,
  postNewApartment,
  getEditApartmentForm,
};
