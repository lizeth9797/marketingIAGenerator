
import { GoogleGenerativeAI,HarmCategory, HarmBlockThreshold} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro-vision-latest";
const API_KEY = "AIzaSyC3cj7PGgtDpmnVKgropqVQLTtiqrzUGlw";

// Converts a File object to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

async function run() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const fileInputEl = document.querySelector("input[type=file]");
    const file = fileInputEl.files[0];
    const imageParts = await fileToGenerativePart(file);
    //console.log(imageParts.inlineData.data);
    const generationConfig = {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
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

  const parts = [
    {text: "Given an image of a product and its target audience, write an engaging marketing description"},
    {text: "Product Image: "},
    {text: "Target Audience: Mid-aged men"},
    {text: "Marketing Description: Introducing the epitome of power and sophistication - the sleek and captivating sports car. It's more than just a car; it's a symbol of your passion for life and your unwavering commitment to excellence. Embrace the thrill and indulge in the ultimate driving pleasure."},
    {text: "Product Image: "},
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageParts.inlineData.data
      }
    },
  ];
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });
  const response = result.response;
  console.log(response.text());
}



let btnSendData = document.getElementById("sendData");

btnSendData.addEventListener("click", function(event){
  event.preventDefault();

  run();

})
