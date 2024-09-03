// apartmemt schema
const { Schema, model } = require("mongoose");

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    rules: {
        type: String,
    },
    bedrooms: {
        type: Number,
        min: 0
    },
    totalBeds: {
        type: Number,
        min: 0
    },
    bathrooms: {
        type: Number,
        min: 0  
    },
    price: {
        type: Number,
        required: true,
    },
    maxNumberOfGuests: {
        type: Number,
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    mainPhoto: {
        type: String,
        required: true,
    },
    wifi: Boolean,
    airConditioning: Boolean,
    kitchen: Boolean,
    disability: Boolean,
    heater: Boolean,
    tv: Boolean,
    province: {
        type: String,
    },
    city: {
        type: String,
    },
    gps: {
        type: String,
    },
})

const Apartment = model('Apartment', apartmentSchema);

module.exports = Apartment;