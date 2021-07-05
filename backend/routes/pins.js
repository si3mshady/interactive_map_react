const router = require('express').Router();
const Pin = require('./models/Pin')

//create a pin
// get all pins 

router.post("/",async (req,res) => {
    const newPin = new Pin(req.body);
    try {
        // database operation is async
        const savedPin = await newPin.save()
        res.status(200).json(savedPin)

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router; 