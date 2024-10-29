const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const cors = require('cors');

app.use(express.json())
app.use(cors());

const users = []

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
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

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.email === req.body.email)

    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        //secure
        //prevent timing attacks

        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.status(403).send('Not Allowed')
        }

    } catch {
        res.status(500).send()
    }
})
app.listen(3000)