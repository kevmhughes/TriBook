// Import third-party modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

// Import public routes
const indexRoutes = require('../routes/index.js');

// Import admin routes
const adminRoutes = require('../routes/admin.js');

// Authentication routes
const authRoutes = require('../routes/auth.js');

// API routes
const apiRoutes = require('../routes/api.js')

// Create an instance of the Express server
const app = express();

// Use middleware to process POST requests
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // secure: true in production with HTTPS
}));

// Set up flash middleware
app.use(flash());

// Middleware to set up local variables for views
app.use((req, res, next) => {
  // The req.locals variable is a "global" object that all views can access

    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    
    if (req.session.isAuthenticated) {
        res.locals.userData = userData

        res.locals.isAuthenticated = true;
        res.locals.isAdmin = req.session.userType === "admin"; // Check if the user is admin
        res.locals.isUser = req.session.userType === "standard"; // Check if the user is a standard user
    } else {
        res.locals.isAuthenticated = false;
        res.locals.isAdmin = false;
        res.locals.isUser = false;
    }

    // We need to execute next() to let the HTTP request continue its course
    next();
})

// Add middleware to allow client to make GET requests to public resources in the 'public' folder
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Set the views directory to the correct location
app.set('views', path.join(__dirname, '..', 'views')); 

// Specify to Express that EJS will be the template engine
app.set('view engine', 'ejs');

// Use the morgan middleware to log client requests
app.use(morgan('tiny'));

// Middleware to protect admin routes
app.use('/admin', (req, res, next) => {
    // Check if the user is authenticated
    if (req.session.isAuthenticated) {
        // If yes, establish that the user is an admin type and allow the request to continue
        res.locals.isAdmin = true;
        next();
    } else {
         // Otherwise, redirect them to the login view
        res.redirect('/login');
    }
});

// Use the routes
app.use('/admin', adminRoutes);
app.use('/', authRoutes);
app.use('/', indexRoutes);
app.use('/api', apiRoutes)

// Function to connect to the database
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to the database');
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
}

// Call the connectDB function and catch any errors
connectDB().catch(err => console.log(err))

// Start the server and listen on the specified port
app.listen(PORT, (req, res) => {
    console.log("Servidor escuchando correctamente en el puerto " + PORT);
});

module.exports = app