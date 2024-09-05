// reservation schema
const { Schema, model } = require("mongoose");

const reservationSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    },
    apartment: { type: Schema.Types.ObjectId, ref: 'Apartment' }
})

const Reservation = model('Reservation', reservationSchema);

module.exports = Reservation;