# Backend for Animal Sound Classification

This backend provides audio processing and inference using YAMNet for classifying 6 animal species.

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Command Line

Process an audio file:

```bash
python yamnet_inference.py path/to/audio.wav
```

### API Server

Start the Flask server:

```bash
python api_server.py
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /predict
Upload an audio file for classification.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (audio file)

**Response:**
```json
{
  "predictions": {
    "Dog": {
      "confidence": 0.85,
      "class_name": "Bark"
    },
    "Cat": {
      "confidence": 0.12,
      "class_name": "Meow"
    },
    ...
  },
  "spectrogram": "base64_encoded_image...",
  "audio_length": 3.5
}
```

### GET /classes
Get list of supported animal classes.

### GET /health
Health check endpoint.

## Supported Animals

1. Dog (Bark, Bow-wow, Growling, Whimper)
2. Cat (Meow, Purr, Hiss, Caterwaul)
3. Bird (Bird vocalization, Chirp, Tweet, Squawk)
4. Cow (Moo)
5. Horse (Neigh, Whinny, Clip-clop)
6. Sheep (Bleat)

## Model

Uses Google's YAMNet model from TensorFlow Hub, trained on AudioSet dataset.
