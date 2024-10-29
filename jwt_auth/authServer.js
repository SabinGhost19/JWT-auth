require('dotenv').config()
//to use .env file with the secrets

//function to get random bytes
//require('crypto').randomBytes(64).toString('hex')


const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors');


app.use(express.json())
app.use(cors())

//just for demonstration
let stored_refreshTokens = [];


app.delete('/logout', (req, res) => {
    stored_refreshTokens = stored_refreshTokens.filter(token => token !== req.body.token)
    //delete the refresh token from the stored_refreshed_tokens
    res.sendStatus(204);
})
app.post('/refresh', (req, res) => {

    console.log('in post refresh');

    const refreshToken = req.body.token
    if (refreshToken === null) return res.status(401).send('Cannot get refresh token from the request body');

    if (!stored_refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403).send('Refresh token not included in the token stored')
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.sendStatus(403).send('Failed at verifying the refresh token')
        }
        //generating another access token for the client
        //after verifying the integrity of the refresh
        const accessToken = generateAccessToken({ email: user.email });
        //send the new generated acces token to the client
        res.json({ acccessToken: accessToken });
    })
})


app.post('/login', (req, res) => {
    //authenticate the user here
    //passw and user etc...
    //from prev homework
    console.log('Login request received with email:', req.body.email);

    const email = req.body.email
    if (!email) {
        res.statusCode(400).send('Username required')
    }
    //take the payload
    //what we want to serialize
    const user = { email: email }
    //can add expiration date
    const accessToken = generateAccessToken(user);
    
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    stored_refreshTokens.push(refreshToken);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });

    //create the accessToken to be passed to the user
    //with his date
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
}

app.listen(4000, () => console.log('Server is running on port 4000'))
