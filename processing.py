import requests
from dotenv import load_dotenv
import os
# load_dotenv(dotenv_path='/path/to/your/.env')
load_dotenv()

api_key = os.getenv("API_KEY")

API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo"
headers = {"Authorization": f"Bearer {api_key}"}

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

# output = query("sample1.flac")

import os
import json
import sounddevice as sd
import numpy as np
import wave

def record_audio(config_path):
    # Load configuration
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    audio_folder = config["audio_folder"]
    recording_duration = config["recording_duration_seconds"]
    microphone_index = config["microphone_index"]
    
    # Ensure audio folder exists
    os.makedirs(audio_folder, exist_ok=True)

    # Set up recording parameters
    sample_rate = 44100  # Standard sample rate
    channels = 2  # Stereo recording
    
    print("Recording audio...")
    
    try:
        # Record audio
        audio_data = sd.rec(int(recording_duration * sample_rate), 
                            samplerate=sample_rate, 
                            channels=channels, 
                            device=microphone_index, 
                            dtype='int16')
        sd.wait()  # Wait until recording is finished
        
        # Save the audio file
        audio_file_path = os.path.join(audio_folder, "recorded_audio.wav")
        with wave.open(audio_file_path, 'wb') as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(2)  # 16-bit audio
            wf.setframerate(sample_rate)
            wf.writeframes(audio_data.tobytes())
        
        print(f"Audio saved to: {audio_file_path}")
    except Exception as e:
        print(f"An error occurred while recording audio: {e}")

if __name__ == "__main__":
    record_audio("config.json")
