// reservation schema
const { Schema, model } = require("mongoose");

const reservationSchema = new Schema({

    email: {
        type: String, // email of user making the reservation
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    apartment: { 
        type: Schema.Types.ObjectId, 
        ref: 'Apartment', 
        required: true },
    user: { 
        type: Schema.Types.ObjectId, // user making the reservation
        ref: 'User', 
        required: true },
}, { timestamps: true })

const Reservation = model('Reservation', reservationSchema);

module.exports = Reservation;