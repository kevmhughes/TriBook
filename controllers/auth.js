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
        res.render('login', {
            /* loginMessage: true */
            message: "That user already exists, please log in with your username and password."
        });
    } else if (isUsernameDuplicated) {
        res.render('sign-up', {
            /* loginMessage: true */
            message: "That username has already been used, please choose another username."
        });
    } else {
        await User.create(req.body)
       res.redirect('/login');
       }
    }

const postLoginForm = async (req, res) => {

    const isUserInDatabase = await User.find(req.body)

    if (isUserInDatabase.length == 0) {
        res.render("sign-up", {
            message: "That user does not exist, please sign up here."
        })
    } else if (isUserInDatabase && isUserInDatabase[0].userType == "admin") {
        console.log("after login: admin user")

        // !!! testing area
        userData = isUserInDatabase[0]

        req.session.isAuthenticated = true;
        req.session.userType = "admin"
        res.locals.isAdmin = true;
        res.locals.isUser = false;
        res.redirect('/');
    } else if (isUserInDatabase && isUserInDatabase[0].userType == "standard") {
        console.log("after login: standard user")

         // !!! testing area
        userData = isUserInDatabase[0]

        req.session.isAuthenticated = true;
        req.session.userType = "standard"
        res.locals.isAdmin = false;
        res.locals.isUser = true;
        res.redirect('/');
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