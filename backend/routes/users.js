const User = require("../models/User")
const bcrypt = require('bcrypt');


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
       !user && res.status(400).json('Wrong username or password')

       const validPassword = await bcrypt.compare(req.body.password,user.password)
       !validPassword && res.status(400).json('Wrong username or password')

       res.status(200).json(user)
    } catch(err) {
        res.status(500).json(err)
    }
} )