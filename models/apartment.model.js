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
    mainPhotoCaption: {
        type: String,
    },
    photoTwo: {
        type: String,
    },
    photoTwoCaption: {
        type: String,
    },
    photoThree: {
        type: String,
    },
    photoThreeCaption: {
        type: String,
    },
    photoFour: {
        type: String,
    },
    photoFourCaption: {
        type: String,
    },
    airConditioning: Boolean,
    centralHeating: Boolean,
    disabledAccess: Boolean,
    tv: Boolean,
    kitchen: Boolean,
    wifi: Boolean,
    province: {
        type: String,
    },
    city: {
        type: String,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
})

const Apartment = model('Apartment', apartmentSchema);

module.exports = Apartment;