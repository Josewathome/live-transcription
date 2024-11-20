let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let transcriptBuffer = '';
const CHUNK_INTERVAL_MS = 2000; // Send chunks every 2 seconds for better transcription accuracy

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const recordingStatus = document.getElementById("recordingStatus");
const liveTranscript = document.getElementById("liveTranscript");

startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);

async function sendAudioChunk(audioBlob) {
    try {
        const formData = new FormData();
        const audioFile = new File([audioBlob], "audio.webm", { type: 'audio/webm' });
        formData.append("audio", audioFile);

        const response = await fetch("http://127.0.0.1:8000/transcribe", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            if (data.transcription) {
                liveTranscript.innerText += data.transcription.trim() + " ";
            } else if (data.error) {
                console.error("Transcription error:", data.error);
            }
        } else {
            console.error("Failed to transcribe audio:", await response.text());
        }
    } catch (error) {
        console.error("Error while processing audio data:", error);
    }
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            audioChunks = [];
            transcriptBuffer = '';
            liveTranscript.innerText = '';

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            let chunkSender = setInterval(() => {
                if (audioChunks.length > 0 && isRecording) {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    sendAudioChunk(audioBlob);
                    audioChunks = [];
                }
            }, CHUNK_INTERVAL_MS);

            mediaRecorder.onstop = () => {
                clearInterval(chunkSender);
                if (audioChunks.length > 0) {
                    const finalBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    sendAudioChunk(finalBlob);
                }
            };

            mediaRecorder.start();
            isRecording = true;
            recordingStatus.innerText = "Status: Recording";
            stopBtn.disabled = false;
            startBtn.disabled = true;
        })
        .catch((error) => {
            console.error("Error accessing microphone:", error);
            alert("Could not access the microphone.");
        });
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        recordingStatus.innerText = "Status: Recording Stopped";
        stopBtn.disabled = true;
        startBtn.disabled = false;
    }
}
