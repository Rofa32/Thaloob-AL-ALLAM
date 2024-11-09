let currentColorIndex = 0;

let currentColorIndex = 0;

function updateColorContent() {
    // Get color data for current index
    const colorData = colorsData[currentColorIndex];

    // Update the image and event listener for the current index (1, 2, or 3)
    const colorImage = document.getElementById(`color${(currentColorIndex % 3) + 1}`);
    colorImage.src = colorData.image;

    // Replace the element to remove previous event listeners
    colorImage.replaceWith(colorImage.cloneNode(true));
    document.getElementById(`color${(currentColorIndex % 3) + 1}`)
        .addEventListener("click", () => playColorSound(colorData.sound));

    // Increment index and reset to 0 if it reaches the length of colorsData
    currentColorIndex++;

    // If it goes past 3, reset to 0 and redirect
    if (currentColorIndex > colorsData.length) {
        window.location.href = go_game_color;
    }
}

// Function to play the sound of the selected color
function playColorSound(audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play();
}

// Function to navigate between sets of colors
function navigate(direction) {
    if (direction === 'next') {
        currentColorIndex = (currentColorIndex + 3) % colorsData.length;
    } else if (direction === 'prev') {
        currentColorIndex = (currentColorIndex - 3 + colorsData.length) % colorsData.length;
    }
    updateColorContent();
}

// Initialize color content on page load
window.onload = updateColorContent;
