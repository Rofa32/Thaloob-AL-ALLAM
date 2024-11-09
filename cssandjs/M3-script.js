const exampleHistory = [];
const recordBtn = document.getElementById('record-btn');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const history = document.getElementById('history');

// Send user message to the server and get Thaloub's response
async function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        addMessage('child', text, null, false); // False indicates a text message
        exampleHistory.push(text); // Add the user message to the history
        messageInput.value = '';

        try {
            // Create a FormData object to send the message
            const formData = new FormData();
            formData.append('text', text); // Directly append the text input

            // Send the message to Flask
            const response = await fetch('/chat/transcribe', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            const thaloubAnswer = data.transcription;
            const audioUrl = data.audio_url; // Get the audio URL

            // Display Thaloub's response in the chat
            addMessage('thaloub', thaloubAnswer, audioUrl); // Pass the audio URL to addMessage

        } catch (error) {
            console.error('Error fetching Thaloub response:', error);
            addMessage('thaloub', 'عذرًا، حدث خطأ أثناء استلام الرد. الرجاء المحاولة لاحقًا.');
        }

        // Update the displayed history
        loadHistory();
    }
}

function addMessage(sender, text, audioUrl = null, isAudio = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender); // Class for sender type
    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    messageDiv.appendChild(avatar);
    // Handle audio messages separately
    if (isAudio) {
        const micIcon = document.createElement('img');
        micIcon.src = micIconUrl; // Mic icon path
        micIcon.alt = 'Audio Message';
        micIcon.style.width = '20px'; // Optional: Set specific size
        micIcon.style.height = '20px';
        micIcon.classList.add('audio-icon'); // Class for audio icon styling
        micIcon.onclick = () => {
            speakAudioResponse(audioUrl); // Play audio message when mic icon is clicked
        };
        messageDiv.appendChild(micIcon); // Add mic icon directly to messageDiv
    } else {
        const textElement = document.createElement('span');
        textElement.classList.add('text');
        textElement.textContent = text;

        const ttsIcon = document.createElement('img');
        ttsIcon.src = text2SpeechIconUrl; // TTS icon URL
        ttsIcon.alt = 'النطق';
        ttsIcon.classList.add('text-to-speech');

        // Assign the click handler based on the sender
        if (sender === 'child') {
            ttsIcon.onclick = () => {
                speakUserText(text); // For user's messages
            };
        } else if (sender === 'thaloub' && audioUrl) {
            ttsIcon.onclick = () => {
                speakAudioResponse(audioUrl); // For Thaloub's response
            };
        }

        messageDiv.appendChild(textElement); // Add text directly to messageDiv
        messageDiv.appendChild(ttsIcon); // Add TTS icon directly to messageDiv
    }

    // Append the avatar and messageDiv to chatMessages
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to latest message
}

// Function to play text-to-speech for user messages
function speakUserText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'ar';
    window.speechSynthesis.speak(speech);
}

// Function to play audio response from Flask
function speakAudioResponse(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });
}

// Function to start recording audio
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.wav');

            try {
                const response = await fetch('/chat/transcribe', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                const thaloubAnswer = data.transcription;
                const audioUrl = data.audio_url;

                // Add audio message for the user
                addMessage('child', thaloubAnswer, audioUrl, true); // True indicates an audio message

                // Display Thaloub's response in the chat
                addMessage('thaloub', thaloubAnswer, audioUrl);

            } catch (error) {
                console.error('Error fetching Thaloub response:', error);
                addMessage('thaloub', 'عذرًا، حدث خطأ أثناء استلام الرد. الرجاء المحاولة لاحقًا.');
            }

            loadHistory();
        };

        mediaRecorder.start();
    } catch (error) {
        console.error('Error accessing the microphone:', error);
        alert('تعذر الوصول إلى الميكروفون. يرجى التحقق من أذونات المتصفح.');
    }
}

// Function to stop recording audio
function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    } else {
        console.error('MediaRecorder is not initialized');
    }
}

recordBtn.addEventListener('mousedown', startRecording); // Start recording on button press
recordBtn.addEventListener('mouseup', stopRecording); // Stop recording on button release

// Function to load and display message history
function loadHistory() {
    history.innerHTML = '';
    exampleHistory.forEach((message) => {
        const historyItem = document.createElement('div');
        historyItem.textContent = message;
        history.appendChild(historyItem);
    });
}

window.onload = loadHistory;
