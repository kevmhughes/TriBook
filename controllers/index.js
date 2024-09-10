const Apartment = require("../models/apartment.model.js");
const Reservation = require("../models/reservation.model.js");

const getDashboard = async (req, res) => {
  try {
    if (res.locals.isAuthenticated){
      // get list of all reservations - made by specific standard user
      const reservations = await Reservation.find({user: userData.id}).populate("apartment")

      // get list of all reservations - owned by specific admin user
      const myApartmentsBooked = await Reservation.find().populate("apartment").populate("user")

      console.log("my apartments booked - dashboard: ", myApartmentsBooked)

      // get list of all apartments - owned by specific admin user
      const apartments = await Apartment.find({user: userData.id})
      
      res.render("dashboard", {reservations, apartments, myApartmentsBooked}) 
    } else {
      res.status(404).render("404", {message: "You must log in to see your dashboard."})
    }
  } catch (error) {
    
  }
}

const getReservation = async (req, res) => {
  try {
    if (res.locals.isAuthenticated && res.locals.isUser){
      res.render("reservation") 
    } else {
      res.status(404).render("404", {message: "You must log in before making a reservation."})
    }
  } catch (error) {
    
  }
}

// Get all properties and show on home page
const getApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find();

    console.log("isAdmin?", res.locals.isAdmin);
    console.log("isUser?", res.locals.isUser);
    console.log("isAuthenticated?", res.locals.isAuthenticated);

    res.render("home", { apartments, zeroResultsMessage: false });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch apartments" });
  }
};

// Get a specific property by ID and its reserved dates
const getApartmentById = async (req, res) => {
  const { idApartment } = req.params;

  try {
    const selectedApartment = await Apartment.findById(idApartment);
    const reservations = await Reservation.find({ apartment: idApartment });

    const reservedDates = reservations.reduce((acc, reservation) => {
      const { startDate, endDate } = reservation;
      const range = getDateRange(new Date(startDate), new Date(endDate));
      return acc.concat(range);
    }, []);

    res.render("apartment-details", {
      selectedApartment,
      reservedDates,
    });
  } catch (error) {
    console.error("Error fetching apartment details:", error);
    res.status(500).json({ error: "Failed to fetch apartment details" });
  }
};

// Search for properties based on filters
const searchApartments = async (req, res) => {
  let { maxPrice, minPrice, numberOfGuests, location } = req.query;

  const searchQuery = {
    price: {
      $gte: minPrice ? minPrice : "0",
      $lte: maxPrice ? maxPrice : "10000",
    },
    maxNumberOfGuests: {
      $gte: numberOfGuests ? numberOfGuests : "1",
    },
  };

  if (location) {
    searchQuery.city = location;
  }

  try {
    const apartments = await Apartment.find(searchQuery);

    if (apartments.length == 0) {
      const defaultApartments = await Apartment.find().limit(5); // Fetch 5 default properties
      return res.render("home", {
        apartments: defaultApartments,
        zeroResultsMessage: true,
      });
    }

    res.render("home", { apartments, zeroResultsMessage: false });
  } catch (error) {
    console.error("Error during property search:", error);
    res.status(500).json({ error: "Failed to search for properties" });
  }
};

// Post a new reservation for a specific apartment
const postNewReservation = async (req, res) => {
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);

  if (isNaN(startDate) || isNaN(endDate)) {
    return res.status(400).json({ error: "Invalid dates provided." });
  }

  try {
    // Get all reservations for this apartment
    const reservations = await Reservation.find({ apartment: req.body.id });

    // Create an array of all reserved dates
    const reservedDates = reservations.reduce((acc, reservation) => {
      const { startDate, endDate } = reservation;
      const range = getDateRange(new Date(startDate), new Date(endDate));
      return acc.concat(range);
    }, []);

    // Get the range of dates for the new reservation
    const dateRangeForNewReservation = getDateRange(startDate, endDate);

    // Check if any of the new reservation dates overlap with existing booking dates
    const hasOverlap = dateRangeForNewReservation.some((date) =>
      reservedDates.some(
        (reservedDate) => date.getTime() === reservedDate.getTime()
      )
    );

    if (hasOverlap) {
      return res
        .status(400)
        .json({ error: "The requested dates are not available." });
    }

    // Ensure the start date is before the end date
    if (startDate < endDate) {
      await Reservation.create({
        email: req.body.email,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        apartment: req.body.id,
        user: userData.id,
      });

      res.redirect("/reservation");
    } else {
      res.status(400).json({ error: "Invalid date range." });
    }
  } catch (error) {
    console.error("Error posting reservation:", error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
};

// Helper function to generate all dates between start and end date
function getDateRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

module.exports = {
  getDashboard,
  getReservation,
  getApartments,
  getApartmentById,
  searchApartments,
  postNewReservation,
};
