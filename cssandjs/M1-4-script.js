let currentStage = 0; // Current stage
let selectedLetters = []; // The letters selected by the user
let correctWord = stages[currentStage].word; // The correct word for the current stage

// Function to play sound when the listen button is pressed
function playSound() {
    const audio = document.getElementById('wordAudio'); // Get the audio element
    audio.play(); // Play the sound
}

// Function to shuffle letters
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateStage() {
    const imageElement = document.querySelector('.object-image');
    const audioElement = document.getElementById('wordAudio');

    // Update the image and sound based on the stage
    imageElement.src = stages[currentStage].image;
    imageElement.alt = stages[currentStage].alt;
    audioElement.src = stages[currentStage].sound;

    // Show or hide the "Back" button based on the current stage
    const backButton = document.querySelector('.back-btn');
    if (currentStage > 0) {  // Change the condition to > 0 to start from the second stage
        backButton.style.display = 'inline-block'; // Show the button if in the second stage or more
    } else {
        backButton.style.display = 'none'; // Hide the button in the first stage
    }

    // Update the correct word
    correctWord = stages[currentStage].word;

    // Reset selected letters
    selectedLetters = [];

    // Combine the correct and extra letters and shuffle them
    let allLetters = [...correctWord, ...stages[currentStage].extraLetters];
    allLetters = shuffle(allLetters).slice(0, 8); // Select only 8 letters and shuffle them

    // Update the letter interface
    const lettersSection = document.querySelector('.letters-section');
    lettersSection.innerHTML = ''; // Clear previous letters

    allLetters.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.onclick = () => selectLetter(letter);
        lettersSection.appendChild(button);
    });

    updateWordBlanks(); // Update the blanks based on the new stage
}

// Function to select letters
function selectLetter(letter) {
    if (selectedLetters.length < correctWord.length) {
        selectedLetters.push(letter); // Add the letter to the list of selected letters
    }
    
    updateWordBlanks(); // Update the blanks based on the selected letters
    checkAnswer(); // Check the answer when the selected letters are complete
}

// Function to update blanks in the word
function updateWordBlanks() {
    const wordBlanks = document.querySelector('.word-blanks');
    let displayWord = '';

    for (let i = 0; i < correctWord.length; i++) {
        if (selectedLetters[i]) {
            displayWord += selectedLetters[i]; // Display the selected correct letter
        } else {
            displayWord += '_'; // Display a blank if the letter hasn't been selected yet
        }
        if (i < correctWord.length - 1) {
            displayWord += ' '; // Add a space between letters or blanks
        }
    }

    wordBlanks.textContent = displayWord; // Update the text in the blanks
}

// Function to check the answer
function checkAnswer() {
    if (selectedLetters.length === correctWord.length) {
        if (selectedLetters.every((val, index) => val === correctWord[index])) {
            // Prepare data for submission
            const data = {
                correctWord: correctWord.join('') // Convert array to string
            };

            // Send the data to the server
            fetch('/game/complete_word/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Show the popup with a line break between the static and dynamic message
                showPopup(`لقد أكملت الكلمة بنجاح!<br>${data.message}`);
            })
            .catch(error => {
                console.error('Error:', error);
                showPopup("خطأ في الاتصال بالسيرفر. حاول مرة أخرى!", true);
            });
        } else {
            showPopup("خطأ حاول مرة أخرى!", true); // If the answer is wrong
        }
    }
}

// Function to show the popup
function showPopup(message, isError = false) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const nextBtn = document.getElementById('nextBtn');

    popupMessage.innerHTML = message;

    if (isError) {
        nextBtn.textContent = "إعادة";
        nextBtn.onclick = resetGame; // Make the "Retry" button restart the game
    } else {
        nextBtn.textContent = "التالي";
        nextBtn.onclick = nextPage; // Go to the next page if the answer is correct
    }

    popup.classList.remove('hidden'); // Show the popup
}

// Function to go to the next stage
function nextPage() {
    currentStage++; // Go to the next stage
    if (currentStage < stages.length) {
        updateStage(); // Update the content based on the new stage
        document.getElementById('popup').classList.add('hidden'); // Hide the popup
    } else {
        alert("لقد انتهيت من جميع المراحل!"); // When all stages are completed
        // Navigate to the next page when all stages are completed
        window.location.href = nextPageUrl;  // Redirect to /4/2 page
    }
}

// Function to delete the last letter
function deleteLastLetter() {
    selectedLetters.pop(); // Remove the last selected letter
    updateWordBlanks(); // Update the blanks
}

function resetGame() {
    selectedLetters = []; // Reset the selected letters
    currentStage = 0; // Reset to the first stage
    updateStage(); // Reload the first stage (including letters, image, and sound)
    document.getElementById('popup').classList.add('hidden'); // Hide the popup
}