const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


async function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            //done called everytime is done, 
            //first param is error
            //second param user we found
            //thord param error message
            return done(null, false, { message: "No user with that email" })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user,)
            } else {
                return done(null, false, { message: "Password incorect" })
            }
        } catch (error) {
            return done(e)
        }
    }

    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((id, done) => { })

}
module.exports = initialize