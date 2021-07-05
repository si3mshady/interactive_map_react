const express = require('express')
const mongoose = require('mongoose')
// const pinRouter = require('routes/pins.js')
const Pin = require('./models/Pin')
const app = express()

app.use(express.json())

// mongodb://mongo:27017
mongoose.connect('mongodb://localhost:27017/map', 
    {useNewUrlParser:true}, err => {
   if (!err) {
       console.log("Connected to database!")
   }
})

//pin 
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




app.listen(8080, () => {
    console.log('Backend server is running port 8080')
})