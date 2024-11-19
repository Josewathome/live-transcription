// Initialize variables
let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let audioElement;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const recordingStatus = document.getElementById("recordingStatus");

startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);

function startRecording() {
    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            // Create a MediaRecorder instance to capture the audio stream
            mediaRecorder = new MediaRecorder(stream);
            
            // When data is available, push the chunks to audioChunks
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            // Once the recording is stopped, create the audio blob
            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioUrl = URL.createObjectURL(audioBlob);

                // Create an audio element to play the recorded audio
                audioElement = new Audio(audioUrl);
                audioElement.controls = true;
                document.body.appendChild(audioElement);
                
                // Enable the buttons for playback and save
                recordingStatus.innerText = "Status: Recording Stopped";
                stopBtn.disabled = true;
                startBtn.disabled = false;
                
                // Optionally, save the audio file
                const a = document.createElement('a');
                a.href = audioUrl;
                a.download = 'recorded_audio.wav';
                a.innerText = 'Download Audio';
                document.body.appendChild(a);
            };

            // Start the recording
            mediaRecorder.start();
            recordingStatus.innerText = "Status: Recording";
            stopBtn.disabled = false;
            startBtn.disabled = true;
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
            alert("Could not access the microphone.");
        });
}

function stopRecording() {
    // Stop the recording
    mediaRecorder.stop();
}
