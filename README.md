---

# Live Transcription System

This project allows you to perform **real-time audio transcription** using a **browser-based frontend** and a **FastAPI** backend that interacts with the **Hugging Face Whisper ASR model**.

The transcription system records audio from the user's microphone, sends audio chunks to the backend for transcription, and displays the live transcription on the webpage. It supports stopping and starting the transcription process as needed.

## Features
- **Real-time transcription**: Converts speech to text in real time.
- **Customizable API Integration**: Use your own Hugging Face API key or replace it with a custom ASR model.
- **Flexible chunking**: Ability to modify chunk size for better transcription accuracy or reduced latency.

## Prerequisites
- Python 3.7 or higher
- Node.js (for running the frontend)
- Hugging Face API key (if using Hugging Face's Whisper model)

## Project Structure
- **Frontend (index.html & process.js)**: Handles audio recording and displays live transcription in the browser.
- **Backend (main.py)**: Handles the API endpoint for receiving and processing audio chunks.

## Installation

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/yourusername/live-transcription-system.git
cd live-transcription-system
```

### 2. Install Backend Dependencies

Navigate to the backend directory and install the necessary Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

Make sure to install the required libraries, including **FastAPI**, **requests**, and **soundfile**.

### 3. Set Up Hugging Face API Key

To use Hugging Face's Whisper model for transcription, you need a valid **Hugging Face API key**.

1. Go to the [Hugging Face website](https://huggingface.co/).
2. Sign up or log in to your account.
3. Navigate to your [API settings](https://huggingface.co/settings/tokens).
4. Copy your **API key**.

Then, create a `.env` file in the backend folder (next to `main.py`) and add your API key like this:
```env
API_KEY=your_hugging_face_api_key_here
```

Alternatively, you can update the `API_KEY` variable in `main.py` directly (though using the `.env` file is recommended for security).

### 4. Run the Backend
Now that you've set up the API key, you can start the FastAPI server:
```bash
uvicorn main:app --reload
```
This will start the server on `http://127.0.0.1:8000`.

### 5. Set Up Frontend

The frontend files (`index.html` and `process.js`) are ready to use. Ensure that the backend is running and the frontend is properly linked to it.

To serve the frontend, you can simply open the `index.html` file in a browser or use any web server to host it. The frontend will make API requests to the backend running at `http://127.0.0.1:8000/transcribe`.

### 6. Access the Live Transcription

Once the backend and frontend are running, go to your browser and open the `index.html` file. Click **Start Recording** to begin the transcription, and click **Stop Recording** when you're done.

The transcription will appear live in the browser, updating every 2 seconds with new chunks of text.

---

## Customization

### 1. Change the Hugging Face API Key

To change the Hugging Face API key, simply replace the value in the `.env` file:
```env
API_KEY=your_new_api_key_here
```
Alternatively, update the `API_KEY` variable directly in `main.py` if you're not using `.env` files.

### 2. Use a Different ASR Model

You can easily replace Hugging Face's Whisper model with another ASR model of your choice. Here's how:

- **Step 1**: Find a different ASR model on Hugging Face (e.g., `pyannote/speaker-diarization-3.1`).
- **Step 2**: Update the `API_URL` in `main.py` to the new model's inference URL:
  ```python
  API_URL = "https://api-inference.huggingface.co/models/your_model_name"
  ```
- **Step 3**: Make sure the model accepts the same audio format or adjust the request accordingly.

### 3. Modify Audio Chunk Size (Improving Accuracy or Latency)

The audio is currently being sent in chunks every **2 seconds**. To improve accuracy or latency, you can change the chunk size or send smaller audio pieces. Here's how you can modify it:

- **Step 1**: In the `process.js` file, change the `CHUNK_INTERVAL_MS` variable:
  ```javascript
  const CHUNK_INTERVAL_MS = 1000; // Send chunks every 1 second (adjust as needed)
  ```

- **Step 2**: In the backend (`main.py`), adjust the handling of audio chunks. You may want to process smaller audio chunks for better accuracy, but keep in mind that sending too small chunks might increase latency.

```python
# Adjust chunk size handling in /transcribe endpoint if necessary
```

---

## Troubleshooting

### 1. Model Too Busy

If you receive a "Model too busy" error, it means the Hugging Face server is overwhelmed with requests. To mitigate this:

- Try again after some time.
- Use the `x-wait-for-model` header to make the request wait for model availability (added to `main.py`).
- Consider using a Hugging Face Pro account or deploy your own model instance for more reliability.

### 2. Frontend Issues

If you're facing issues with the frontend, ensure that:

- The browser has microphone access enabled.
- The backend server is running and accessible at `http://127.0.0.1:8000`.

---

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE.

---