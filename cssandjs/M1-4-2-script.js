let currentTextIndex = 0;
let mediaRecorder;
let audioChunks = [];

function startReading() {
    showPopup("ابدأ القراءة");
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioChunks = [];
                uploadAudio(audioBlob);
            };

            // Dynamically add the stop button after recording starts
            let stopBtn = document.createElement('button');
            stopBtn.id = 'stopBtn';
            stopBtn.className = 'control-btn stop-btn';
            stopBtn.textContent = 'إيقاف التسجيل';
            stopBtn.onclick = stopRecording;

            // Append the stop button to the controls section
            document.querySelector('.controls-section').appendChild(stopBtn);
        })
        .catch(error => {
            console.error("Error accessing microphone:", error);
            showPopup("خطأ في الوصول إلى الميكروفون");
        });
}


// Stop recording
function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();  // This will trigger the onstop event

        // Remove or hide the stop button after recording stops
        const stopBtn = document.getElementById('stopBtn');
        if (stopBtn) {
            stopBtn.remove();  // Removes the button from the DOM
        }
    }
}

// Function to upload audio
function uploadAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    fetch('/game/reading/submit', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        showPopup(data.message); // Display the response message
        // Optionally, here you can show a "Next" button to proceed
        document.getElementById('nextBtn').style.display = 'block'; // Show the next button
    })
    .catch(error => {
        console.error("Error uploading audio:", error);
        showPopup("حدث خطأ أثناء رفع الصوت");
    });
}

function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;
    popup.classList.remove('hidden');
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
}
// Function to go to the next text
function nextText() {
    currentTextIndex = (currentTextIndex + 1) % texts.length;
    document.getElementById('text-to-read').textContent = texts[currentTextIndex].text;
    document.getElementById('popup').classList.add('hidden');
    // Optionally, hide the next button after using it
    document.getElementById('nextBtn').style.display = 'none'; // Hide after proceeding
}

// Ensure to hide the "Next" button initially
document.getElementById('nextBtn').style.display = 'none'; // Hide next button on load