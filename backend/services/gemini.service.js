const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateAIResponse(userMessage){
    const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite-preview"
    });

    //this is a custom prompt so that AI behaves like support assistant
    const prompt = `
    Your are a helpful customer support bot.
    Understand and Answer the user's question clearly and briefly.
    If you do not know the answer, say you are not sure and suggest contacting support.
    User Question:
    ${userMessage}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;

}

module.exports = generateAIResponse;

