const User = require("../models/user.model.js");

// Render login form
const getLoginForm = (req, res) => {
    return res.render("login", {
        message: "" // Optional message placeholder for dynamic feedback
    })
}

// Render sign-up form
const getSignUpForm = (req, res) => {
    return res.render("sign-up", {
        message: "" // Optional message placeholder for dynamic feedback
    })
}

// Handle user sign-up
const postSignUpForm = async (req, res) => {
    const {password, username, userType, email} = req.body

    try {

        // Check if user with the same details already exists
        const isUserInDatabase = await User.find({password, username, userType, email})

        // Check if the username is already taken
        const isUsernameDuplicated = await User.find({username})

        // If user details are already in the database, redirect to login
        if (isUserInDatabase.length > 0 ) {
            req.flash("error", "Those details were previously registered in our database, please proceed to log in.");
            return res.redirect('/login');
        }
        
        // If the username is already taken, prompt the user to choose another username
        if (isUsernameDuplicated.length > 0) {
            req.flash("error", "That username has already been used, please choose another username.")
            return res.redirect("/sign-up")
        } 

        // Create new user in the database 
        await User.create(req.body)
        req.flash("success", "You have signed up successfully. Now, you can log in.")
        return res.redirect("/login");
            
        } catch (error) {
        console.error("Error during sign-up:", error.stack);
        req.flash("error", "An error occurred during sign-up. Please try again.");
        return res.redirect("/sign-up");
    }
    }

// Handle user login
const postLoginForm = async (req, res) => {
    try {
        
    // Check if user exists in the database
    const isUserInDatabase = await User.find(req.body)

    // If user doesn't exist, prompt them to sign up
    if (isUserInDatabase.length == 0) {
        req.flash("error", "That user does not exist, please sign up here.")
        return res.redirect("/sign-up")

    // If user exists and is an admin, authenticate as admin
    } else if (isUserInDatabase && isUserInDatabase[0].userType == "admin") {
        userData = isUserInDatabase[0]
        req.session.isAuthenticated = true;
        req.session.userType = "admin"
        res.locals.isAdmin = true;
        res.locals.isUser = false;

        req.flash("success", "You have logged in as an admin user.")
        return res.redirect('/');

    // If user exists and is a standard user, authenticate as standard user      
    } else if (isUserInDatabase && isUserInDatabase[0].userType == "standard") {
        userData = isUserInDatabase[0]
        req.session.isAuthenticated = true;
        req.session.userType = "standard"
        res.locals.isAdmin = false;
        res.locals.isUser = true;

        req.flash("success", "You have logged in as a standard user.")
        return res.redirect('/');
    }
    } catch (error) {
        console.error("Error during login:", error);
        req.flash("error", "An error occurred during login. Please try again.");
        return res.redirect("/login");
    }
}

// Handle user logout
const logout = (req, res) => {
    console.log('Logout');

    // Destroy session and redirect to home page
    req.session.destroy(err => {
        if (err) {
            return res.send('Error while logging out.');
        }
        return res.redirect("/login");
    });
}

module.exports = {
    getLoginForm,
    postLoginForm,
    getSignUpForm,
    postSignUpForm,
    logout
}