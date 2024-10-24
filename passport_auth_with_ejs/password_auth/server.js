if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const users = []

const initilizePassport = require('./passport-config')
initilizePassport(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }
))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get("/", checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', check_NOT_Authenticated, check_NOT_Authenticated, (req, res) => {
    res.render('login.ejs')
})


//-----------------------------------------------------
//passport auth middleware use
//local strategy
app.post('/login', check_NOT_Authenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
//list of options
//flash massages true, to let the messages in the pasport-config.js 
//be displayed to the user
//(to see the error)


app.get('/register', check_NOT_Authenticated, (req, res) => {
    res.render('register.ejs')
})
app.post('/register', check_NOT_Authenticated, async (req, res) => {
    try {
        //hashing password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        //adding new user to the local list of users - no db yet
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch (error) {
        res.redirect('/register')
    }
    console.log(users)
})


app.delete('/logout', (req, res) => {

    req.logout(function (err) {
        if (err) {
            return next(err); // Trateaza eroarea daca apare
        }

        res.redirect('/login')
    })
})


//protect the main data page
//redirect the user to the login
//if s not authenticate
function checkAuthenticated(req, res, next) {
    //isAuthenticated 
    //method provided by the use of passport.js middleware 
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
function check_NOT_Authenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}
app.listen(3000)
