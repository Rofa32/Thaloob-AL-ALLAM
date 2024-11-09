let currentNumberIndex = 0;
const modal = document.getElementById("myModal");
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let audio = new Audio();
document.querySelector(".modal-content").appendChild(canvas);

// Function to update content based on the current number
function updateContent() {
    const numberData = numbersData[currentNumberIndex];

    document.getElementById("number-image").src = numberData.number.image;
    document.getElementById("number-image").addEventListener("click", () => playSound(numberData.number.sound));

    const handImagesContainer = document.getElementById("hand-images");
    handImagesContainer.innerHTML = "";

    numberData.hands.forEach(handImageSrc => {
        const handImage = document.createElement("img");
        handImage.src = handImageSrc;
        handImage.className = "hand-image";
        handImagesContainer.appendChild(handImage);
    });
}

// Function to play the sound
function playSound(audioSrc) {
    if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
    audio.src = audioSrc;
    audio.play();
}

// Function to navigate between numbers
function navigateNumber(direction) {
    if (direction === 'next') {
        currentNumberIndex++;
        // If all numbers are completed, redirect to the game page
        if (currentNumberIndex >= numbersData.length) {
            window.location.href = GO_M1_3_2 ;  // Redirect to the game page
            return;
        }
    } else if (direction === 'prev') {
        currentNumberIndex = (currentNumberIndex - 1 + numbersData.length) % numbersData.length;
    }
    updateContent();
}

// Function to open the writing modal
document.getElementById("pen-logo").onclick = function() {
    modal.style.display = "block";
    loadWriteImage();
};

// Function to close the writing modal
document.querySelector(".close").onclick = function() {
    modal.style.display = "none";
    clearCanvas();
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        clearCanvas();
    }
};

// Function to load the writing image
function loadWriteImage() {
    const numberData = numbersData[currentNumberIndex];
    const backgroundImage = new Image();
    backgroundImage.src = numberData.write_image;
    backgroundImage.onload = function() {
        canvas.width = backgroundImage.width;
        canvas.height = backgroundImage.height;
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    };
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadWriteImage();
}

// Drawing functions
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

// Initialize content on page load
window.onload = updateContent;
