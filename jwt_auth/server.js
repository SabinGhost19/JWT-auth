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

const posts = [{
    email: "sabin@s",
    title: 'Post 1'
}, {
    email: "Tom@T",
    title: 'Post 2'
}
]



//add middleware to authenticate Token
app.get('/posts', authenticateToken, (req, res) => {

    console.log('User authenticated:', req.user); // Verifică dacă utilizatorul este autentificat corect
    res.json(posts.filter(post => post.email === req.user.email));
});


function authenticateToken(req, res, next) {
    //from header,Bearer TOKEN
    const authHeader = req.headers['authorization']
    //get the second param in the array
    //verify if we have an authHeader
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        //user obtinut din 
        //decodificarea tokenuluii si se obtine payloadul original
        //cu care a fost codificat unde exista userul si parola
        if (error) {
            //has a token but has no longer acccess
            return res.sendStatus(403)
        }
        console.log(user.email)
        req.user = user
        next()
    })

}

app.listen(3000, () => console.log('Server is running on port 3000'))
