import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import requests
import soundfile as sf
from pydub import AudioSegment
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="."), name="static")

API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"
API_KEY = os.getenv("API_KEY")
HEADERS = {"Authorization": f"Bearer {API_KEY}"}


def convert_to_wav(audio_data):
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_data), format="webm")
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        return wav_io.getvalue()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Audio conversion error: {str(e)}")


@app.get("/", response_class=HTMLResponse)
async def read_root():
    html_path = "index.html"
    if os.path.exists(html_path):
        with open(html_path, "r") as file:
            return file.read()
    return HTMLResponse("HTML file not found", status_code=404)


@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    try:
        audio_data = await audio.read()
        wav_data = convert_to_wav(audio_data)
        response = requests.post(API_URL, headers=HEADERS, data=wav_data)

        if response.ok:
            transcription_data = response.json()
            transcription = transcription_data.get("text", "No transcription available.")
            return JSONResponse({"transcription": transcription.strip()})
        else:
            return JSONResponse(
                {"error": f"Transcription failed: {response.text}"}, 
                status_code=response.status_code
            )

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
