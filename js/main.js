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


btnSendData.addEventListener("click", function(event){
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

    if(isValid){
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
    }
})
