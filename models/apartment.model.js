// apartmemt schema
const { Schema, model } = require("mongoose");

const apartmentSchema = new Schema({
    title: {
        type: String,
        required: true,
        match: /^[A-Za-z\s\-]{5,50}$/, 
        minlength: 5,  
        maxlength: 50 
    },
    description: {
        type: String,
        required: true,
        minlength: 1,  
        maxlength: 1000 
    },
    rules: {
        type: String,
    },
    bedrooms: {
        type: Number,
        min: 0,
        max: 50
    },
    totalBeds: {
        type: Number,
        min: 0,
        max: 100
    },
    bathrooms: {
        type: Number,
        min: 0,
        max: 50
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 10000
    },
    maxNumberOfGuests: {
        type: Number,
        min: 1,
        max: 100
    },
    size: {
        type: Number,
        required: true,
        min: 0,
        max: 10000
    },
    mainPhoto: {
        type: String,
        required: true,
    },
    mainPhotoCaption: {
        type: String,
        required: true,
        match: /^[A-Za-z\s\-]{5,30}$/, 
        min: 1,
        max: 30,
    },
    photoTwo: {
        type: String,
    },
    photoTwoCaption: {
        type: String,
        match: /^[A-Za-z\s\-]{5,30}$/, 
        min: 1,
        max: 30,
    },
    photoThree: {
        type: String,
    },
    photoThreeCaption: {
        type: String,
        match: /^[A-Za-z\s\-]{5,30}$/, 
        min: 1,
        max: 30,
    },
    photoFour: {
        type: String,
    },
    photoFourCaption: {
        type: String,
        match: /^[A-Za-z\s\-]{5,30}$/, 
        min: 1,
        max: 30,
    },
    airConditioning: Boolean,
    centralHeating: Boolean,
    disabledAccess: Boolean,
    tv: Boolean,
    kitchen: Boolean,
    wifi: Boolean,
    province: {
        type: String,
        required: true,
        match: /^[A-Za-z\s\-]*$/, 
        minlength: 1,
        maxlength: 30,
      },
    city: {
        type: String,
        required: true,
        match: /^[A-Za-z\s\-]*$/, 
        minlength: 1,
        maxlength: 30,
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
    listed: {
        type: Boolean,
        default: true
         } 
})

const Apartment = model('Apartment', apartmentSchema);

module.exports = Apartment;