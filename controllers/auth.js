const User = require("../models/user.model.js");

const getLoginForm = (req, res) => {
    res.render("login", {
        loginMessage: false
    })
}

const getSignUpForm = (req, res) => {
    res.render("sign-up", {
        signupMessage: false
    })
}

const postSignUpForm = async (req, res) => {

    const {password, username} = req.body

    const isUserInDatabase = await User.find({password, username})

    console.log(req.body)

    if (isUserInDatabase.length > 0) {
        res.render('login', {
            loginMessage: true
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
            signupMessage: true
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