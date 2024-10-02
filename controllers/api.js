const Apartment = require("../models/apartment.model.js");

// Fetch apartments from the database
const getApartments = async (req, res) => {
  // Parse limit from query parameters, default to a large number if not provided
  let limit = parseInt(req.query.limit) || 100000 ;

  // Validate the limit parameter
  if (limit) {
    // Check if the limit is a number and within the acceptable range
    if (isNaN(limit) || limit < 1 || limit > 100000) {
        return res.status(400).json({
        message: "The limit parameter must be between 1 and 100000",
      });
    }
  }

  // Fetch apartments from the database with the specified limit
  const apartments = await Apartment.find().limit(limit);
  
  return res.status(200).json({
    message: "Query executed successfully",
    results: apartments,
  });
};

module.exports = {
  getApartments,
};
