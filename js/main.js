let loadImage = document.getElementById("loadImage");
let inpImage = document.getElementById("inpImage");
let contentImage = document.getElementById("contentImage");
let imagePreview = document.getElementById("imagePreview");
let cancelImage = document.getElementById("cancelImage");
let inpTarget = document.getElementById("inpTarget");
let addTargetBtn = document.getElementById("addTargetBtn");
let contentTarget = document.getElementById("contentTarget");
let targetList = [];

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

    reader.readAsDataURL(inpImage.files[0]);
})

cancelImage.addEventListener("click", function(event){
    event.preventDefault();
    loadImage.style.display = "flex";
    contentImage.style.display = "none";
})


function addTarget() {
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

document.addEventListener("click", function(event) {
    if (event.target.classList.contains('bi-x')) {
        removeTarget(event);
    }
});

