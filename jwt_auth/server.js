require('dotenv').config()
//to use .env file with the secrets

//function to get random bytes
//require('crypto').randomBytes(64).toString('hex')


const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')


app.use(express.json())


const posts = [{
    username: "Sabin",
    title: 'Post 1'
}, {
    username: "Tom",
    title: 'Post 2'
}
]



//add middleware to authenticate Token
app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});


function authenticateToken(req, res, next) {
    //from header,Bearer TOKEN
    const authHeader = req.headers['authorization']

    //get the second param in the array
    //verify if we have an authHeader
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    console.log('token extraction from request: ', token);


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            //has a token but has no longer acccess
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })

}

app.listen(3000, () => console.log('Server is running on port 3000'))
