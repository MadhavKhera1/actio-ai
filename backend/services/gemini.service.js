const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateAIResponse(userMessage){
    const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite-preview"
    });

    //this is a custom prompt so that AI behaves like support assistant
    const prompt = `
    You are a helpful customer support assistant.

    Rules:
    - Give short and clear answers.
    - Maximum 3 sentences.
    - Use simple language.
    - Avoid long paragraphs.
    - If unsure, say "Please contact support.
    User Question:
    ${userMessage}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;

}

module.exports = generateAIResponse;

