const express = require('express');
const router = express.Router();

const FAQ = require('../models/faq.model');

//add new faq

router.post("/faq",async(req,res)=>{
    try{
        const {question, answer}= req.body;

        const faq = new FAQ({
            question,
            answer
        });

        await faq.save();

        res.json({
            message: "FAQ added successfully",
            faq
        });
    } catch(error){
        console.error(error);
        res.status(500).json({error: "Server error"});
    }
});

// GET all FAQs

router.get("/faq",async(req,res)=>{
    try{
        const faqs = await FAQ.find();
        res.json(faqs);

    }catch(error){
        res.status(500).json({
            error: "Server error"
        });
    }

});

module.exports = router;




