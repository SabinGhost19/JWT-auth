require('dotenv').config()
//to use .env file with the secrets

//function to get random bytes
//require('crypto').randomBytes(64).toString('hex')


const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors');
const bcrypt=require('bcrypt');

app.use(express.json())
app.use(cors())

//just for demonstration
let stored_refreshTokens = [];
//stored the users
const users=[];

app.delete('/logout', (req, res) => {
    stored_refreshTokens = stored_refreshTokens.filter(token => token !== req.body.token)
    //delete the refresh token from the stored_refreshed_tokens
    res.sendStatus(204);
})


//handle the register request
app.post('/register',async (req,res)=>{
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = { email: req.body.email, password: hashedPassword }
        users.push(user)
        console.log(users)
        res.status(201).send()

    } catch {
        res.status(500).send()
    }
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
        console.log("Trimitem ACCES TOKEN NOU");
        res.json({ accessToken: accessToken });
    })
})


app.post('/login', async (req, res) => {
    //authenticate the user here
    //passw and user etc...
    //from prev homework
    console.log('Login request received with email:', req.body.email);


    const user = users.find(user => user.email === req.body.email)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        //secure
        //prevent timing attacks

        if (await bcrypt.compare(req.body.password, user.password)) {
            //take the payload
            //what we want to serialize
            //can add expiration date
            const accessToken = generateAccessToken(user);
    
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                stored_refreshTokens.push(refreshToken);

            res.json({ accessToken: accessToken, refreshToken: refreshToken });
            //create the accessToken to be passed to the user
            //with his date
        } else {
            res.status(403).send('Not Allowed')
        }

    } catch {
        res.status(500).send()
    }

})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' });
}

app.listen(4000, () => console.log('Server is running on port 4000'))
