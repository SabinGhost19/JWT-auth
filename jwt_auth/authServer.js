require('dotenv').config()
//to use .env file with the secrets

//function to get random bytes
//require('crypto').randomBytes(64).toString('hex')


const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')


app.use(express.json())

//just for demonstration
let stored_refreshTokens = [];


app.delete('/logout', (req, res) => {
    stored_refreshTokens = stored_refreshTokens.filter(token => token !== req.body.token)
    //delete the refresh token from the stored_refreshed_tokens
    res.sendStatus(204);
})
app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken === null) return res.sendStatus(401).send('Cannot get refresh token from the request body');

    if (!stored_refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403).send('Refresh token not included in the token stored')
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.sendStatus(403).send('Failed at verifying the refresh token')
        }
        //generating another access token for the client
        //after verifying the integrity of the refresh
        const acccessToken = generateAccesToken({ name: user.name });

        //send the new generated acces token to the client
        res.json({ acccessToken: acccessToken });
    })
})


app.post('/login', (req, res) => {
    //authenticate the user here
    //passw and user etc...
    //from prev homework

    const username = req.body.username
    if (!username) {
        res.statusCode(400), send('Username required')
    }
    //take the payload
    //what we want to serialize
    const user = { name: username }
    //can add expiration date
    const accessToken = generateAccesToken(user);

    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    stored_refreshTokens.push(refreshToken);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });

    //create the accessToken to be passed to the user
    //with his date
})

function generateAccesToken(user) {
    return accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s' })
}

app.listen(4000, () => console.log('Server is running on port 4000'))
