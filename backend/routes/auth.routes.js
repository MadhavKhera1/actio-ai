const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

//Sign Up API
router.post("/signup", async(req,res)=>{
    try{
        const {name, email, password} = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({
                message: "User already registered"
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            message: "User Registered Successfully"
        });

    } catch(error){
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

module.exports  = router; 

