const User = require("../models/user.model.js");

const getLoginForm = (req, res) => {
    res.render("login", {
        message: ""
    })
}

const getSignUpForm = (req, res) => {
    res.render("sign-up", {
        message: ""
    })
}

const postSignUpForm = async (req, res) => {

    const {password, username, userType} = req.body

    const isUserInDatabase = await User.find({password, username, userType})

    const isUsernameDuplicated = await User.find({username})

    if (isUserInDatabase.length > 0 ) {
        req.flash("error", "Those details were previously registered in our database, please proceed to log in.");

        return res.redirect('/login');
    }
    
    if (isUsernameDuplicated.length > 0) {
        req.flash("error", "That username has already been used, please choose another username.")

        return res.redirect("/sign-up")
    } 
        await User.create(req.body)
        req.flash("success", "You have signed up successfully, please proceed to log in.")
        res.redirect("/login");
    }

const postLoginForm = async (req, res) => {

    const isUserInDatabase = await User.find(req.body)

    if (isUserInDatabase.length == 0) {
        req.flash("error", "That user does not exist, please sign up here.")

        return res.redirect("/sign-up")

    } else if (isUserInDatabase && isUserInDatabase[0].userType == "admin") {

        userData = isUserInDatabase[0]

        req.session.isAuthenticated = true;
        req.session.userType = "admin"
        res.locals.isAdmin = true;
        res.locals.isUser = false;

        req.flash("success", "You have logged in as an admin user.")
        return res.redirect('/');
    } else if (isUserInDatabase && isUserInDatabase[0].userType == "standard") {

        userData = isUserInDatabase[0]

        req.session.isAuthenticated = true;
        req.session.userType = "standard"
        res.locals.isAdmin = false;
        res.locals.isUser = true;

        req.flash("success", "You have logged in as a standard user.")
        return res.redirect('/');
    }
}

const logout = (req, res) => {
    console.log('Logout');

    req.session.destroy(err => {
        if (err) {
            return res.send('Error al cerrar sesión');
        }
        res.redirect('/');
    });
}

module.exports = {
    getLoginForm,
    postLoginForm,
    getSignUpForm,
    postSignUpForm,
    logout
}