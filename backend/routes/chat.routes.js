const express = require("express");
const router = express.Router();

const generateAIResponse = require("../services/gemini.service");

const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const FAQ = require("../models/faq.model");


// POST /api/chat
router.post("/chat", async (req, res) => {

    try {

        const { message, conversationId } = req.body;

        let conversation;

        // create new conversation if none exists
        if (!conversationId) {

            conversation = new Conversation({
                title: message.slice(0, 40)
            });

            await conversation.save();

        } else {

            conversation = await Conversation.findById(conversationId);

        }

        // save user message
        const userMessage = new Message({
            conversationId: conversation._id,
            role: "user",
            content: message
        });

        await userMessage.save();

        // check FAQ
        const faq = await FAQ.findOne({
            question: { $regex: message, $options: "i" }
        });

        let response;

        if (faq) {

            response = faq.answer;

        } else {

            // fetch previous messages for context
            const previousMessages = await Message.find({
                conversationId: conversation._id
            })
                .sort({ createdAt: 1 })
                .limit(10);

            let conversationHistory = "";

            previousMessages.forEach(msg => {

                conversationHistory += `${msg.role}: ${msg.content}\n`;

            });

            const fullPrompt = `
Previous conversation:
${conversationHistory}

Current user question:
${message}
`;

            response = await generateAIResponse(fullPrompt);

        }

        // Escalation Detection
        const escalationPhrases = [
            "i'm not sure",
            "cannot find information",
            "please contact support"
        ];

        let needsHumanSupport = false;

        for (let phrase of escalationPhrases) {

            if (response.toLowerCase().includes(phrase)) {

                needsHumanSupport = true;
                break;

            }

        }

        // save bot response
        const botMessage = new Message({
            conversationId: conversation._id,
            role: "bot",
            content: response
        });

        await botMessage.save();

        res.json({
            reply: response,
            conversationId: conversation._id,
            needsHumanSupport
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Server error" });

    }

});


// GET all conversations for sidebar
router.get("/conversations", async (req, res) => {

    try {

        const conversations = await Conversation.find()
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(conversations);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Failed to fetch conversations" });

    }

});


// GET messages of a specific conversation
router.get("/messages/:conversationId", async (req, res) => {

    try {

        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ createdAt: 1 });

        res.json(messages);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Failed to fetch messages" });

    }

});

module.exports = router;