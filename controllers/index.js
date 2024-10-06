const Apartment = require("../models/apartment.model.js");
const Reservation = require("../models/reservation.model.js");
const { getDateRange } = require("../utils/dateUtils.js");

// "RESERVATIONS" VIEW - STANDARD USER
const getDashboardBookings = async (req, res) => {
  try {
    if (res.locals.isAuthenticated) {
      // Helper function to format dates in DD-MM-YYYY format
      function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }

      const sortByValueUserBookings = req.query.sortByBookingsUser;

      // Set sorting criteria for user bookings based on query
      let sortByQueryUserBookings;
      if (sortByValueUserBookings == "startDateUserBookings"){
        sortByQueryUserBookings = {startDate: 1};
      } else if (sortByValueUserBookings === "endDateUserBookings") {
        sortByQueryUserBookings = {endDate: 1};
      } else if (sortByValueUserBookings === "startDateLastUserBookings"){
        sortByQueryUserBookings = {startDate: -1};
      } else if (sortByValueUserBookings === "endDateLastUserBookings") {
        sortByQueryUserBookings = {endDate: -1};
      } 

      // Get list of all reservations - made by authenticated standard user
      const reservations = await Reservation.find({ user: userData.id })
        .populate({
          path: "apartment",
          populate: {
            path: "user", 
            select: "name email", 
          },
        })
        .sort(sortByQueryUserBookings) 
        .exec();

        // Sort reservations by city name since Mongoose does not support sorting by nested fields directly
        if (sortByValueUserBookings === "cityAscUserBookings") {
          reservations.sort((a, b) => a.apartment.city.localeCompare(b.apartment.city));
        } else if (sortByValueUserBookings === "cityDescUserBookings") {
          reservations.sort((a, b) => b.apartment.city.localeCompare(a.apartment.city));
        }

      // Format dates of reservations to display in UI "reservation card"
      reservations.forEach((reservation) => {
        reservation.startDateFormatted = formatDate(reservation.startDate);
        reservation.endDateFormatted = formatDate(reservation.endDate);
      });

      const sortByValue = req.query.sortByBookings;

      // Sort bookings of admin user's apartments
      let sortByQuery;
      if (sortByValue == "startDate"){
        sortByQuery = {startDate: 1};
      } else if (sortByValue === "endDate") {
        sortByQuery = {endDate: 1};
      } else if (sortByValue === "startDateLast"){
        sortByQuery = {startDate: -1};
      } else if (sortByValue === "endDateLast") {
        sortByQuery = {endDate: -1};
      } 

      // Get list of all reservations and populate the user object
      const allApartmentsBooked = await Reservation.find()
        .populate("apartment")
        .populate("user")
        .sort(sortByQuery)
        .exec();

      // Manually sort booked apartments by nested fields, as Mongoose does not sort by these directly
        if (sortByValue === "titleAz") {
          allApartmentsBooked.sort((a, b) => a.apartment.title.localeCompare(b.apartment.title));
        } else if (sortByValue === "titleZa") {
          allApartmentsBooked.sort((a, b) => b.apartment.title.localeCompare(a.apartment.title));
        } else if (sortByValue === "usernameAz") {
          allApartmentsBooked.sort((a, b) => a.user.username.localeCompare(b.user.username));
        } else if (sortByValue === "usernameZa") {
          allApartmentsBooked.sort((a, b) => b.user.username.localeCompare(a.user.username));
        }

      // Filter reservations by admin user id - so that an admin only sees their apartment reservations
      const myApartmentsBooked = allApartmentsBooked.filter(
        (ap) => ap.apartment.user._id.toString() === userData.id
      );

      // Format dates of apartments booked to display in UI "booking card"
      myApartmentsBooked.forEach((reservation) => {
        reservation.startDateFormatted = formatDate(reservation.startDate);
        reservation.endDateFormatted = formatDate(reservation.endDate);
      });

      // Get list of all apartments owned by admin user - based on their user id
      const apartments = await Apartment.find({ user: userData.id });

      // Render the dashboard view with the relevant data
      return res.render("dashboard-bookings", { reservations, myApartmentsBooked, apartments });
    } else {
      return res.status(404).render("404", { message: "You must log in to see your dashboard." });
    }
  } catch (error) {

  }
};

// !!! testing ground !!!
const getDashboardBookingsCancel = async (req, res) => {
  try {
    const { idReservation } = req.params;
    /* const reservationToDelete = await Reservation.findByIdAndDelete(idReservation) */
    const reservationToDelete = await Reservation.findById(idReservation).populate("user").populate("apartment")
    const email = reservationToDelete.email
    console.log(email)

    console.log(userData)


    if (!reservationToDelete) {
      console.log(`No reservation found with ID: ${idReservation}`);
      return res.status(404).render("404", { message: "Reservation not found." });
    }

    // Check-in and check-out dates (startDate and endDate)
    const startDate = new Date(reservationToDelete.startDate);
    const endDate = new Date(reservationToDelete.endDate);

    // Options for formatting the date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Format the start and end dates
    const formattedStartDate = startDate.toLocaleDateString('en-US', options);
    const formattedEndDate = endDate.toLocaleDateString('en-US', options);

    console.log("Deleted reservation:", reservationToDelete);

    return res.render("email", {  
      email: reservationToDelete.email,
      user: reservationToDelete.user.username, 
      subject: "Unfortunately, we have to cancel your reservation.",
      body: `We are very sorry, but we regret to inform you that we have no alternative but to cancel your reservation at ${reservationToDelete.apartment.title} between ${formattedStartDate}, and ${formattedEndDate}. \n\nDespite the unfortunate circumstances, we hope that you will continue to use our services in the near future.\n\nBest regards, \n\n${(userData.username)}.`
    });
    
  } catch (error) {
    console.error("Error deleting reservation:", error.stack);
    return res.status(500).render("500", {message: "Error deleting reservation."});
  }
};

// !!! testing ground !!!
const postSendEmail = async (req, res) => {
  const { idUser } = req.params
  req.flash("success", `A cancellation email has been sent to ${idUser}.`)
  return res.redirect("/dashboard/bookings")
}

// "VIEW OR EDIT APARTMENTS" VIEW - ADMIN USER
// Controller to get the apartments for authenticated admin users to be seen on the dashboard
const getDashboardApartments = async (req, res) => {
  try {
    if (res.locals.isAuthenticated) {

      const sortByValueApartments = req.query.sortByApartments

      let sortByQueryApartments 
      if (sortByValueApartments == "newest"){
        sortByQueryApartments = {createdAt: 1}
      } else if (sortByValueApartments == "oldest"){
        sortByQueryApartments = {createdAt: -1}
      } else if (sortByValueApartments == "listed"){
        sortByQueryApartments = {listed: -1}
      } else if (sortByValueApartments == "delisted"){
        sortByQueryApartments = {listed: 1}
      } else if (sortByValueApartments == "titleAzApartments"){
        sortByQueryApartments = {title: 1}
      } else if (sortByValueApartments == "titleZaApartments"){
        sortByQueryApartments = {title: -1}
      } else if (sortByValueApartments == "priceHigh"){
        sortByQueryApartments = {price: 1}
      } else if (sortByValueApartments == "priceLow"){
        sortByQueryApartments = {price: -1}
      }

      // Get list of all apartments owned by admin user based on user id
      const apartments = await Apartment.find({ user: userData.id }).sort(
        sortByQueryApartments 
      );

      // sort all apartments by most recently updated
      const updatedApartment = await Apartment.find({ user: userData.id }).sort(
        {updatedAt: -1}
      );

      // Render the apartments on the dashboard view
      return res.render("dashboard-apartments", { apartments, updatedApartment });
    } else {
      return res
        .status(404)
        .render("404", { message: "You must log in to see your dashboard." });
    }
  } catch (error) {
  }
};

// Render reservation page for authenticated standard user
const getReservation = async (req, res) => {
  try {
    if (res.locals.isAuthenticated && res.locals.isUser) {
      return res.render("reservation");
    } else {
      return res.status(404).render("404", {
        message: "You must log in before making a reservation.",
      });
    }
  } catch (error) {
    console.error("Error fetching reservation confirmation:", error.stack);
    return res.status(500).json({ error: "Failed to fetch reservation confirmation" });
  }
};

// Get all listed properties to show on home page
const getApartments = async (req, res) => {
  try {
    // Find all apartments in the database that have been listed by their respective hosts (admin users)
    const apartments = await Apartment.find({ listed: true }).sort({
      createdAt: -1,
    });

    if (apartments.length == 0) {
      return res.render("home", { apartments, zeroResultsMessage: true });
    } else {
      return res.render("home", { apartments, zeroResultsMessage: false });
    }
  } catch (error) {
    console.error("Error fetching properties:", error.stack);
    return res.status(500).json({ error: "Failed to fetch apartments" });
  }
};

// Get a specific property by ID, and get its reserved dates
const getApartmentById = async (req, res) => {

  try {
    const { idApartment } = req.params;
    // Find the apartment
    const selectedApartment = await Apartment.findById(idApartment).populate("user");
    // Find all reservations of that apartment
    const reservations = await Reservation.find({ apartment: idApartment });

    // Find all reserved dates of all reservations of the specific apartment
    const reservedDates = reservations.reduce((acc, reservation) => {
      const { startDate, endDate } = reservation;
      const range = getDateRange(new Date(startDate), new Date(endDate));
      return acc.concat(range);
    }, []);

    return res.render("apartment-details", {
      selectedApartment,
      reservedDates,
    });
  } catch (error) {
    console.error("Error fetching apartment details:", error.stack);
    return res.status(500).json({ error: "Failed to fetch apartment details" });
  }
};

// Search for properties based on filters
const searchApartments = async (req, res) => {
  let {
    maxPrice,
    minPrice,
    numberOfGuests,
    location,
    startDate,
    endDate,
    sortBy,
  } = req.query;

  // set default values if and when no value is given by the user in the input of the HTML form
  const searchQuery = {
    price: {
      $gte: minPrice || "0",
      $lte: maxPrice || "10000",
    },
    maxNumberOfGuests: {
      $gte: numberOfGuests || "1",
    },
  };

  if (location) {
    searchQuery.city = location;
  }

  try {
    let reservedApartmentIds = [];

    // Check if startDate and endDate are provided
    if (startDate && endDate) {
      // Convert the startDate and endDate to JavaScript Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Find all reservations that overlap with the given date range
      const reservations = await Reservation.find({
        $or: [
          {
            startDate: { $lte: end }, // Reservation starts before or on the search end date
            endDate: { $gte: start }, // Reservation ends after or on the search start date
          },
        ],
      }).select("apartment");

      // Get the apartment IDs that are reserved in the given range
      reservedApartmentIds = reservations.map(
        (reservation) => reservation.apartment
      );
    }

    // Add condition to exclude reserved apartments if there are any
    if (reservedApartmentIds.length > 0) {
      searchQuery._id = { $nin: reservedApartmentIds }; // Exclude reserved apartments
    }

    let sortByInputValue;

    if (sortBy == "mostRecent") {
      sortByInputValue = { createdAt: -1 };
    } else if (sortBy == "minPriceFirst") {
      sortByInputValue = { price: 1 };
    } else if (sortBy == "maxPriceFirst") {
      sortByInputValue = { price: -1 };
    }

    // Filter apartments based on search query
    const apartments = await Apartment.find({
      ...searchQuery,
      listed: true,
    }).sort(sortByInputValue);

    if (apartments.length == 0) {
      const defaultApartments = await Apartment.find({ listed: true })
        .limit(5)
        .sort({ createdAt: -1 }); // Fetch 5 default properties if filter gives zero results
      return res.render("home", {
        apartments: defaultApartments,
        zeroResultsMessage: true,
      });
    }

    return res.render("home", { apartments, zeroResultsMessage: false });
  } catch (error) {
    console.error("Error during property search:", error.stack);
    return res.status(500).json({ error: "Failed to search for properties" });
  }
};

// Post a new reservation for a specific apartment
const postNewReservation = async (req, res) => {
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);

  // Validate check-in and check-out dates
  if (isNaN(startDate) || isNaN(endDate)) {
    req.flash("error", "Please use valid check-in and check-out dates.");
    return res.status(400).redirect(`/apartment/${req.body.id}`);;
  }

  if (startDate > endDate) {
    req.flash("error", "The check-in date cannot be later than the check-out date." );
    return res.status(400).redirect(`/apartment/${req.body.id}`);;
  }

  try {
    // Get all reservations for the specific apartment 
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

    // Send error message if there are overlapping dates
    if (hasOverlap) {
      req.flash("error", "The requested dates are not available for this apartment.");
      return res.status(400).redirect(`/apartment/${req.body.id}`);
    }

    // Create the reservation if dates are valid - the start date is before the end date
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
      req.flash("error", "Invalid date range, please try again.");
      return res.status(400).redirect(`/apartment/${req.body.id}`);
    }
  } catch (error) {
    console.error("Error posting reservation:", error.stack);
    return res.status(500).json({ error: "Failed to create reservation" });
  }
};

module.exports = {
  getDashboardBookings,
  getDashboardBookingsCancel,
  postSendEmail,
  getDashboardApartments,
  getReservation,
  getApartments,
  getApartmentById,
  searchApartments,
  postNewReservation,
};
