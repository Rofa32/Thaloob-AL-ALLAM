const modal = document.getElementById("myModal");
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const img_write = document.createElement("img");
let currentLetterIndex = 0;


function updateContent() {
    const letterData = lettersData[currentLetterIndex];
    const letterImage = document.getElementById("letter");
    letterImage.src = letterData.letter.image;
    letterImage.replaceWith(letterImage.cloneNode(true));

    const newLetterImage = document.getElementById("letter");
    newLetterImage.addEventListener("click", () => playSound(letterData.letter.sound));

    const wordImagesContainer = document.getElementById("word-images");
    wordImagesContainer.innerHTML = "";
    letterData.words.forEach((word) => {
        const img = document.createElement("img");
        img.src = word.image;
        img.className = "word-image";
        img.addEventListener("click", () => playSound(word.sound));
        wordImagesContainer.appendChild(img);
    });

    img_write.src = letterData.write_letter.image;
    img_write.style.maxWidth = "100%";
    const modalContent = document.querySelector(".modal-content");

    img_write.onload = function() {
        const existingCanvas = modalContent.querySelector("canvas");
        if (existingCanvas) modalContent.removeChild(existingCanvas);

        canvas.width = img_write.width;
        canvas.height = img_write.height;
        modalContent.appendChild(canvas);
        ctx.drawImage(img_write, 0, 0);
    };

    document.getElementById("audio-container").innerHTML = `<audio id="audio-letter" src="${letterData.letter.sound}"></audio>`;
}

function playSound(audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play();
}

function clearCanvas() {
    ctx.clearRect(0, 0, img_write.width, img_write.height);
    ctx.drawImage(img_write, 0, 0);
}

function navigate(direction) {
    if (direction === 'next') {
        currentLetterIndex = (currentLetterIndex + 1) % lettersData.length;
    } else {
        currentLetterIndex = (currentLetterIndex - 1 + lettersData.length) % lettersData.length;
    }
    updateContent();
}

window.onload = function () {
    updateContent();
};

const penIcon = document.getElementById("pen-logo");
const span = document.getElementsByClassName("close")[0];

penIcon.onclick = function() {
    modal.style.display = "block";
};

span.addEventListener('click', function() {
    modal.style.display = "none";
    clearCanvas();
});

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        clearCanvas();
    }
});

let isDrawing = false;
let lastX = 0;
let lastY = 0;

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
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
