const Apartment = require('../models/apartment.model.js');
const Reservation = require("../models/reservation.model.js");

const getApartments = async (req, res) => {
    const apartments = await Apartment.find();

    console.log("isAdmin?", res.locals.isAdmin)
    console.log("isUser?", res.locals.isUser)
    console.log("isAuthenticated?", res.locals.isAuthenticated)

    res.render("home", {
        apartments
    })
}

const getApartmentById = async (req, res) => {
    const {idApartment} = req.params 
    const selectedApartment = await Apartment.findById(idApartment);

    const reservations = await Reservation.find({ apartment: idApartment });

    const reservedDates = reservations.reduce((acc, reservation) => {
        const { startDate, endDate } = reservation; // Assuming your schema has these fields
        const range = getDateRange(new Date(startDate), new Date(endDate));
        return acc.concat(range);
    }, []);

    res.render("apartment-details", {
        selectedApartment,
        reservedDates
    })

    function getDateRange(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
    
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    
        console.log("these are the dates", dates)
        return dates;
    }
}

const searchApartments = async (req, res) => {
    let { maxPrice, minPrice, numberOfGuests, location } = req.query

    const searchQuery = {
        price: {
            $gte: minPrice ? minPrice : "0",
            $lte: maxPrice ? maxPrice : "10000"
        },
        maxNumberOfGuests: {
            $gte: numberOfGuests ? numberOfGuests : "1"
        }
    };

    if (location) {
        searchQuery.city = location;
    }


    const apartments = await Apartment.find(searchQuery);

  console.log("location: ", location)
  console.log("apartment one", apartments[0])

    if (apartments.length == 0) {
        console.log("number of apartments: ", apartments.length)
        res.send("create an error message later - SHOW A LIST OF SOME APARTMENTS ANYWAY!!!!")
    }
    res.render("home", {
        apartments
    })
}

const postNewReservation = async (req, res) => {

    const startDate = new Date(req.body.startDate)
    const endDate = new Date(req.body.endDate)

    if (startDate < endDate) {
        const booking = await Reservation.create(
            {   
            email: req.body.email,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            apartment: req.body.id
            }
       );

       console.log("this is the booking", booking)
       const bookedApartment = await Reservation.find(booking._id)
       .populate('apartment')
       console.log("this is the apartment", bookedApartment[0].apartment.title )
       /* const checkReservation = await Reservation.find()
       .populate('apartment') */
       /* console.log("this is the apartment", checkReservation) */

       res.render("reservation", {booking, bookedApartment})
    
     } else {
        res.json(req.body)
     }

  /*  const checkReservation = await Reservation.find()
   .populate('apartment') */

   /* res.json(req.body); */

}

module.exports = {
    getApartments,
    getApartmentById,
    searchApartments,
    postNewReservation
}