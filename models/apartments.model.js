// apartmemt schema
const { Schema, model } = require("mongoose");

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    squareMetres: {
        type: Number,
        required: true,
    },
    mainPhoto: {
        type: String,
        required: true,
        match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i, "URL not valid"]
    },
    services: {
        wifi: Boolean,
        airConditioner: Boolean, 
        kitchen: Boolean,
        disability: Boolean,
        heater: Boolean,
        tv: Boolean
    }
})

const Apartment = model('Apartment', apartmentSchema);

module.exports = Apartment;