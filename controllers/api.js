const Apartment = require("../models/apartment.model.js");

const getApartments = async (req, res) => {

  let limit = parseInt(req.query.limit) || 100000 ;

  if (limit) {
    if (isNaN(limit) || limit < 1 || limit > 100000) {
        return res.status(400).json({
        message: "The limit parameter must be between 1 and 100000",
      });
    }
  }

  const apartments = await Apartment.find().limit(limit);
  
  return res.status(200).json({
    message: "Query executed successfully",
    results: apartments,
  });
};

module.exports = {
  getApartments,
};
