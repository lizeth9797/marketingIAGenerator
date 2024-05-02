import { GoogleGenerativeAI,HarmCategory, HarmBlockThreshold} from "@google/generative-ai";
let loadImage = document.getElementById("loadImage");
let inpImage = document.getElementById("inpImage");
let contentImage = document.getElementById("contentImage");
let imagePreview = document.getElementById("imagePreview");
let cancelImage = document.getElementById("cancelImage");
let inpTarget = document.getElementById("inpTarget");
let addTargetBtn = document.getElementById("addTargetBtn");
let contentTarget = document.getElementById("contentTarget");
let btnSendData = document.getElementById("sendData");
let alertImage = document.getElementById("alertImage");
let alertTarget = document.getElementById("alertTarget")
let alertRangeAge = document.getElementById("alertRangeAge");
let minAge = document.getElementById("minAge");
let maxAge = document.getElementById("maxAge");
let outputData = document.getElementById("outputData");
let targetList = [];
let prevImage = null;
const toastLiveExample = document.getElementById('liveToast')

loadImage.addEventListener("click",function(event){
    event.preventDefault();
    inpImage.click();
})

inpImage.addEventListener("change",function(event){
    event.preventDefault();
    let reader = new FileReader();

    reader.onload = function(e) {
        contentImage.style.display = "flex";
        loadImage.style.display = "none"
        imagePreview.setAttribute('src', e.target.result);
    }

    prevImage = inpImage.files[0];
    reader.readAsDataURL(prevImage);
})

/*
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No se proporcionó ningún archivo.");
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            let base64Image = e.target.result;
            resolve(base64Image); 
        }
        reader.onerror = function(e) {
            reject("Error al leer el archivo.");
        }
        reader.readAsDataURL(file);
    });
}

function imprimirValorBase64() {
        convertImageToBase64(inpImage.files[0])
        .then(base64Image => {
            let imgb64 = base64Image;
        })
        .catch(error => {
            console.error(error);
        });
}

async function running() {
    const base64Imagee = await convertImageToBase64(inpImage.files[0]);
    return base64Imagee;
}
*/

cancelImage.addEventListener("click", function(event){
    event.preventDefault();
    loadImage.style.display = "flex";
    contentImage.style.display = "none";
})


function addTarget() {
    alertTarget.style.display = "none";
    let targetValue = inpTarget.value.trim();
    if(targetList.find(t => t.toLowerCase() == targetValue.toLowerCase())){
        inpTarget.value = "";
        return;
    }
    if (targetValue !== "") {
        targetList.push(targetValue);
        inpTarget.value = "";
        contentTarget.insertAdjacentHTML("beforeend", `
        <div class="targetCard">
            <span>${targetValue} <i class="bi bi-x"></i></span>
        </div>
        `)
    }
}

inpTarget.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTarget();
    }
});

addTargetBtn.addEventListener("click", addTarget);

function removeTarget(event) {
    let targetCard = event.target.closest('.targetCard');
    if (targetCard) {
        targetCard.remove();

        let targetValue = targetCard.textContent.trim();
        let index = targetList.findIndex(t => t.toLowerCase() === targetValue.toLowerCase());
        if (index !== -1) {
            targetList.splice(index, 1);
        }
    }
}

function removeResult(event){
    let resultCard = event.target.closest('.cardResult');
    if(resultCard){
        resultCard.remove();
    }
    if (document.querySelectorAll('.cardResult').length === 0) {
        outputData.style.display = 'none';
    }
}

function copyText(event) {
    let cardResult = event.target.closest('.cardResult');
    if (cardResult) {
        let paragraph = cardResult.querySelector('.bodyCard p');
        if (paragraph) {
            const textToCopy = paragraph.textContent;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
                    toastBootstrap.show()
                })
                .catch(err => {
                });
        }
    }
}

function saveText(event) {
    let cardResult = event.target.closest('.cardResult');
    if (cardResult) {
        let paragraph = cardResult.querySelector('.bodyCard p');
        if (paragraph) {
            const textToSave = paragraph.textContent;
            const blob = new Blob([textToSave], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'marketinIAGenerator.txt';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    }
}


document.addEventListener("click", function(event) {
    if (event.target.classList.contains('bi-x')) {
        removeTarget(event);
    }
    if (event.target.classList.contains('bi-x-lg')) {
        removeResult(event);
    }
    if (event.target.classList.contains('copy')) {
        copyText(event);
    }
    if (event.target.classList.contains('save')) {
        saveText(event);
    }
});


btnSendData.addEventListener("click", async function(event){
    event.preventDefault();
    let isValid = true;
    if(minAge.value == "" || maxAge.value == ""){
        alertRangeAge.innerHTML="";
        alertRangeAge.insertAdjacentHTML("beforeend","Please enter an age range");
        alertRangeAge.style.display="flex";
        isValid= false;
    }else if(minAge.value > maxAge.value) {
        alertRangeAge.innerHTML="";
        alertRangeAge.insertAdjacentHTML("beforeend","Please enter a valid age range");
        alertRangeAge.style.display="flex";
        isValid= false;
    }else{
        alertRangeAge.innerHTML="";
        alertRangeAge.style.display="none";
    }
    if(targetList.length == 0){
        alertTarget.style.display= "flex";
        isValid = false;
    }else{
        alertTarget.style.display = "none";
    }
    if(prevImage == null){
        alertImage.style.display = "flex";
        isValid = false;
    }else{
        alertImage.style.display = "none";
    }

    if(true){
        outputData.insertAdjacentHTML("afterbegin",`
                <div class="cardResult">
                    <div class="headerCard">
                        <span>150 words</span>
                        <span>Formal</span>
                        <span class="close"><i class="bi bi-x-lg"></i></span>
                    </div>
                    <div class="bodyCard">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit porro exercitationem 
                            praesentium, impedit quasi nihil totam sapiente? Dolore architecto, nam sunt velit esse beatae 
                            voluptatibus distinctio, quam nobis illo doloremque possimus. Cupiditate odit veritatis sed nam 
                            explicabo. Porro blanditiis deserunt adipisci iusto facere, reprehenderit atque hic fuga vel 
                            facilis ex in corporis. Voluptates natus nisi at facere tempora aperiam pariatur iusto, in 
                            perspiciatis exercitationem, placeat labore consequuntur sint, hic nemo magni? Ut ipsum illo quas 
                            veniam rerum ab sapiente perspiciatis! Nostrum molestias cumque autem quasi eos impedit dolorem 
                            molestiae rerum quod. Sit beatae quod repudiandae tempora, dolor culpa earum aliquam perspiciatis 
                            libero maiores quae similique debitis labore voluptas quia adipisci, maxime magni quas explicabo 
                            id! Minima recusandae necessitatibus harum aut. Dolorum fuga deserunt ullam necessitatibus itaque 
                            odio obcaecati, temporibus molestias culpa provident minus possimus! Officia dolor cupiditate 
                            temporibus! Assumenda laudantium iure ad unde dolor? Labore laudantium deleniti rerum consectetur 
                            repudiandae.
                        </p>
                    </div>
                    <div class="footerCard">
                        <span class="copy"><i class="bi bi-files"></i> Copy</span>
                        <span class="save"><i class="bi bi-save2"></i> Save</span>
                    </div>
                </div>
        `)
        outputData.style.display="flex";

        run();
    }
})



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

var target='women at university';
var writingTone='religious';
var age='20-29';
var numberWords='30';


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
    {text: `Target Audience: ${target}`},
    {text: `Writing tone: ${writingTone}`},
    {text: `Age: ${age}`},
    {text: `Number of words: ${numberWords}`},
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