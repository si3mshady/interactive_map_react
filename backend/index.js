const express = require('express')
const mongoose = require('mongoose')
const User = require("./models/User")
const bcrypt = require('bcrypt');
const cors = require('cors')
// const pinRouter = require('routes/pins.js')
const Pin = require('./models/Pin')
const app = express()

app.use(cors())
app.use(express.json())

// mongodb://mongo:27017
// ENV MONGO_CONNECT_URL=mongodb://localhost:27017/map

mongoose.connect(process.env.MONGO_CONNECT_URL, 
    {useNewUrlParser:true}, err => {
   if (!err) {
       console.log("Connected to database!")
   }
})

//PIN ROUTES START
app.post("/api/pins", async (req,res) => {
    const newPin = new Pin(req.body);
    try {
        // database operation is async
        const savedPin = await newPin.save()
        res.status(200).json(savedPin)
        console.log(req['body'])
    

    } catch (err) {
        res.status(500).json(err)
    }
})

app.get('/api/allPins', async (req,res) => {
    try {
        const allPins = await Pin.find()
        res.status(200).json(allPins)
    } catch(err) {
        res.status(500).json(err)
    }
} )
//PIN ROUTES END
//USER ROUTES START

app.post("/register", async (req,res) => {
    const newUser = new User(req.body);
    try {
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        // generate new pw 

        // create new user
        const newUser = User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        // save user & send response 
        // database operation is async
        
        res.status(200).json(savedUser)
        console.log(req['body'])
    

    } catch (err) {
        res.status(500).json(err)
    }
})

app.post('/login', async (req,res) => {
    try {
       
       const user = await User.findOne({username: req.body.username})
       if (!user) {
        return res.status(400).json('Wrong username or password')
       }
       

       const validPassword = await bcrypt.compare(req.body.password,user.password)
       if (!validPassword) {
        return res.status(400).json('Wrong username or password')

       }

       return res.status(200).json(user)

    } catch(err) {
        return res.status(500).json(err)
    }
} )


app.listen(8080, () => {
    console.log('Backend server is running port 8080')
})