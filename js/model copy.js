
import { GoogleGenerativeAI,HarmCategory, HarmBlockThreshold} from "@google/generative-ai";

//const MODEL_NAME = "gemini-1.5-pro-latest";
const MODEL_NAME = "gemini-1.0-pro-vision-latest";
const API_KEY = "AIzaSyC3cj7PGgtDpmnVKgropqVQLTtiqrzUGlw";

async function runChat() {
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
    temperature: 2,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
};

const safetySettings = [
    {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
    ],
});

const result = await chat.sendMessage("Analyze the sentiment of the following Tweets and classify them as POSITIVE, NEGATIVE, or NEUTRAL.: 'It's so beautiful today!'");
const response = result.response;
console.log(response.text());
}

runChat();