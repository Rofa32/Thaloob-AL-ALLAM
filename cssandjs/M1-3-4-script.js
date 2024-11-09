document.addEventListener('DOMContentLoaded', () => {
    let currentStage = 1;
    const message = document.getElementById('message');
    const soundContainer = document.getElementById('sound-container');
    const choicesContainer = document.getElementById('choices-container');

    // Function to load the current stage with sounds and color options
    function loadStage(stage) {
        let audioOptions, choiceOptions;

        if (stage === 1) {
            audioOptions = [`${AUDIO_BASE_PATH}yellow.mp3`, `${AUDIO_BASE_PATH}green.mp3`, `${AUDIO_BASE_PATH}blue.mp3`, `${AUDIO_BASE_PATH}red.mp3`];
            choiceOptions = [
                { name: 'أصفر', color: '#FDEE00' },
                { name: 'أخضر', color: '#57E964' },
                { name: 'أزرق', color: '#6495ED' },
                { name: 'أحمر', color: '#E55451' }
            ];
        } else if (stage === 2) {
            audioOptions = [`${AUDIO_BASE_PATH}black.mp3`, `${AUDIO_BASE_PATH}orange.mp3`, `${AUDIO_BASE_PATH}green.mp3`, `${AUDIO_BASE_PATH}blue.mp3`];
            choiceOptions = [
                { name: 'أسود', color: '#000000' },
                { name: 'برتقالي', color: '#FFA500' },
                { name: 'أخضر', color: '#57E964' },
                { name: 'أزرق', color: '#6495ED' }
            ];
        } else {
            message.textContent = 'انتهت اللعبة! أحسنت!';
            message.style.color = 'blue';
            return;
        }

        soundContainer.innerHTML = '';
        choicesContainer.innerHTML = '';
        message.textContent = '';

        // Setup sound boxes
        audioOptions.forEach((audioFile, index) => {
            const soundBox = document.createElement('div');
            soundBox.classList.add('sound-box');
            soundBox.setAttribute('data-answer', choiceOptions[index].name);

            const audioIcon = document.createElement('img');
            audioIcon.src = `${IMAGE_BASE_PATH}audiologo.png`;
            audioIcon.alt = 'تشغيل الصوت';
            audioIcon.style.width = '80px';
            audioIcon.style.height = '80px';

            soundBox.appendChild(audioIcon);
            soundBox.addEventListener('click', () => {
                const audio = new Audio(audioFile);
                audio.play();
            });
            soundContainer.appendChild(soundBox);
        });

        // Shuffle and create draggable color choices
        choiceOptions.sort(() => Math.random() - 0.5);
        choiceOptions.forEach(choice => {
            const choiceButton = document.createElement('div');
            choiceButton.classList.add('choice');
            choiceButton.style.backgroundColor = choice.color;
            choiceButton.setAttribute('draggable', true);
            choiceButton.setAttribute('data-word', choice.name);

            choiceButton.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text', choice.name);
            });
            choicesContainer.appendChild(choiceButton);
        });

        // Enable drag-and-drop functionality for each sound box
        const soundBoxes = document.querySelectorAll('.sound-box');
        soundBoxes.forEach(soundBox => {
            soundBox.addEventListener('dragover', (event) => {
                event.preventDefault();
            });

            soundBox.addEventListener('drop', (event) => {
                event.preventDefault();
                const draggedChoice = event.dataTransfer.getData('text');

                // Check if dragged color matches the sound answer
                if (draggedChoice === soundBox.getAttribute('data-answer')) {
                    const draggedElement = document.querySelector(`.choice[data-word="${draggedChoice}"]`);
                    if (draggedElement) {
                        soundBox.style.backgroundColor = draggedElement.style.backgroundColor;
                        soundBox.textContent = '';  // Clear icon
                        draggedElement.style.display = 'none'; // Hide matched color
                    }

                    // Check if stage is complete
                    if ([...choicesContainer.children].every(child => child.style.display === 'none')) {
                        setTimeout(() => loadStage(++currentStage), 1000);
                    }
                } else {
                    showMessage('مطابقة خاطئة! حاول مرة أخرى!', false);
                }
            });
        });
    }

    // Load the first stage on page load
    loadStage(currentStage);
});

// Helper function to show a message on match
function showMessage(text, success) {
    const messageBox = document.getElementById('message');
    messageBox.textContent = text;
    messageBox.style.color = success ? 'green' : 'red';
}
