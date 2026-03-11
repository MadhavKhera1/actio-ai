const express = require('express');
const router = express.Router();
const generateAIResponse = require("../services/gemini.service");

const Chat = require("../models/chat.model");
const FAQ = require("../models/faq.model");


router.post("/chat", async(req,res)=>{
    try{
        const {message} = req.body;

        //check FAQ first
        const faq = await FAQ.findOne({
            question: {$regex: message, $options: "i"}
        });

        let response;

        if(faq){
            response=faq.answer;
        }
        else{
            response= await generateAIResponse(message);
        }

        // Escalation Detection
        const escalationPhrases = [
            "i'm not sure",
            "cannot find information",
            "please contact support"
        ];

        let needsHumanSupport = false;

        for(let phrase of escalationPhrases){
            if(response.toLowerCase().includes(phrase)){
                needsHumanSupport = true;
                break;
            }
        }

        //save chat history
        const chat = new Chat({
            userMessage: message,
            botResponse: response,
            needsHumanSupport
        });

        await chat.save();

        res.json({
            reply: response,
            needsHumanSupport
        });

    } catch(error){
        console.error(error);
        res.status(500).json({ error: "Server error"});
    }
});

module.exports= router;
