const recordBtn = document.getElementById('record-btn');
const storyText = document.getElementById('story-text');
const foxImage = document.getElementById('fox-image');
let mediaRecorder; 
let timeoutId;
let currentAudio; 

recordBtn.addEventListener('click', async () => {
    if (recordBtn.dataset.recording === 'true') {
        mediaRecorder.stop(); 
        return;
    }
    
    recordBtn.dataset.recording = 'true';
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];

    mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
    });

    mediaRecorder.start();
    recordBtn.textContent = "توقف التسجيل";

    timeoutId = setTimeout(() => {
        mediaRecorder.stop();
    }, 10000);

    mediaRecorder.addEventListener('stop', async () => {
        clearTimeout(timeoutId);
        recordBtn.textContent = "🎤 تسجيل الصوت";
        recordBtn.dataset.recording = 'false';

        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');

        const response = await fetch('/stories/transcribe', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        storyText.textContent = data.transcription;

        // Stop previous audio if playing
        if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Generate a unique URL to avoid caching
        const uniqueAudioUrl = `${data.audio_url}?t=${new Date().getTime()}`;
        currentAudio = new Audio(uniqueAudioUrl);
        
        // Change fox image when audio starts and ends
        currentAudio.addEventListener('play', () => {
            foxImage.src = talking_fox;
        });
        
        currentAudio.addEventListener('ended', () => {
            foxImage.src = still_fox;
        });

        currentAudio.play()
            .then(() => console.log("Audio is playing"))
            .catch((error) => console.error("Audio playback failed:", error));
    });
});

//to go to the chating page
function handleTopRightButtonClick() {
            window.location.href = go_chat;
        }
