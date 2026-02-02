# Project Structure

Complete file structure and explanation of the bioacoustic animal classification system.

## Directory Tree

```
Deteccion_Sonidos_Animales/
│
├── README.md                        # Main project documentation
├── QUICKSTART.md                    # Quick start guide
├── INTEGRATION_GUIDE.md             # Detailed integration guide
│
├── backend/                         # Python/TensorFlow backend
│   ├── requirements.txt             # Python dependencies
│   ├── yamnet_inference.py          # Core inference engine
│   ├── api_server.py                # Flask REST API server
│   ├── demo.py                      # Demo/example script
│   ├── .gitignore                   # Git ignore for Python
│   └── README.md                    # Backend documentation
│
└── animal-sound-app/                # Expo/React Native frontend
    ├── package.json                 # Node.js dependencies
    ├── package-lock.json            # Locked dependency versions
    ├── app.json                     # Expo configuration
    ├── index.js                     # Entry point
    ├── App.js                       # Main application component
    ├── config.json                  # Configuration file
    ├── .gitignore                   # Git ignore for Node.js
    ├── README.md                    # Frontend documentation
    │
    ├── services/                    # Service layer
    │   └── api.js                   # Backend API client
    │
    └── assets/                      # Static assets
        ├── icon.png                 # App icon
        ├── splash-icon.png          # Splash screen
        ├── adaptive-icon.png        # Android adaptive icon
        └── favicon.png              # Web favicon
```

## File Descriptions

### Root Level

#### `README.md`
Main project documentation with:
- Project overview
- Features
- Installation instructions
- Usage examples
- Technology stack
- Complete API documentation

#### `QUICKSTART.md`
5-minute quick start guide for developers to get the system running immediately.

#### `INTEGRATION_GUIDE.md`
Comprehensive integration guide covering:
- Architecture diagrams
- Step-by-step setup
- Configuration options
- Network setup for different environments
- Troubleshooting
- Optimization tips

### Backend (`backend/`)

#### `yamnet_inference.py` (Main Inference Engine)
**Purpose**: Core audio processing and classification logic

**Key Components**:
- `YAMNetAnimalClassifier` class: Main classifier
- `load_audio()`: Audio file loading and preprocessing
- `generate_spectrogram()`: Mel spectrogram generation
- `predict()`: YAMNet inference and filtering
- `process_audio()`: Complete pipeline

**Features**:
- Loads YAMNet from TensorFlow Hub
- Filters 521 AudioSet classes to 6 animal species
- Generates base64-encoded spectrograms
- Command-line interface for testing

**Usage**:
```bash
python yamnet_inference.py audio.wav
```

#### `api_server.py` (Flask REST API)
**Purpose**: HTTP API server for audio classification

**Endpoints**:
- `POST /predict`: Upload audio for classification
- `GET /classes`: Get supported animal classes
- `GET /health`: Health check endpoint

**Features**:
- CORS enabled for cross-origin requests
- Multipart file upload support
- Temporary file handling
- Error handling and validation

**Usage**:
```bash
python api_server.py
# Server runs on http://0.0.0.0:5000
```

#### `demo.py` (Demo Script)
**Purpose**: Demonstration and testing script

**Features**:
- Shows how to initialize the classifier
- Lists supported animals
- Provides usage examples

**Usage**:
```bash
python demo.py
```

#### `requirements.txt`
Python dependencies:
- `tensorflow>=2.13.0`: ML framework
- `tensorflow-hub>=0.14.0`: Model loading
- `librosa>=0.10.0`: Audio processing
- `numpy>=1.24.0`: Numerical operations
- `scipy>=1.11.0`: Scientific computing
- `matplotlib>=3.7.0`: Plotting
- `soundfile>=0.12.0`: Audio file I/O
- `flask>=2.3.0`: Web framework
- `flask-cors>=4.0.0`: CORS support

#### `README.md`
Backend-specific documentation covering:
- Installation
- Usage (CLI and API)
- API endpoints
- Model details
- Supported animals

### Frontend (`animal-sound-app/`)

#### `App.js` (Main Application)
**Purpose**: Core React Native application component

**Key Features**:
- Audio recording with expo-av
- File upload with expo-document-picker
- API integration for predictions
- Results visualization
- Server status monitoring
- Demo mode fallback

**State Management**:
- `recording`: Current recording object
- `isRecording`: Recording state
- `audioUri`: Audio file URI
- `predictions`: Classification results
- `spectrogram`: Spectrogram image
- `loading`: Loading state
- `serverStatus`: Backend connection status

**Functions**:
- `startRecording()`: Start audio recording
- `stopRecording()`: Stop and save recording
- `pickAudioFile()`: Open file picker
- `analyzeAudio()`: Send audio to API
- `checkBackendStatus()`: Check server health

#### `services/api.js` (API Client)
**Purpose**: Backend API communication layer

**Functions**:
- `predictAnimalSound(audioUri)`: Send audio for prediction
- `getSupportedClasses()`: Get animal classes
- `checkServerHealth()`: Check backend status

**Configuration**:
- Platform-specific URLs
- iOS: `localhost:5000`
- Android: `10.0.2.2:5000`
- Physical device: User's IP address

**Features**:
- FormData for file upload
- Error handling
- Timeout management
- Development/production modes

#### `app.json` (Expo Configuration)
**Purpose**: Expo project configuration

**Settings**:
- App name: "Animal Sound Classifier"
- Version: 1.0.0
- Permissions: Microphone, Storage
- Platforms: iOS, Android, Web
- Plugins: expo-av

#### `package.json`
**Dependencies**:
- `expo`: ^54.0.33 - Development platform
- `expo-av`: ^16.0.8 - Audio recording
- `expo-document-picker`: ^14.0.8 - File selection
- `expo-file-system`: ^19.0.21 - File operations
- `react-native`: 0.81.5 - Mobile framework

**Scripts**:
- `start`: Start dev server
- `android`: Run on Android
- `ios`: Run on iOS
- `web`: Run in browser

#### `config.json`
**Purpose**: Application configuration

**Environments**:
- Development: Local URLs
- Production: Production API URL

#### `README.md`
Frontend-specific documentation covering:
- Features
- Installation
- Usage
- Backend configuration
- Project structure
- Troubleshooting

### Assets (`animal-sound-app/assets/`)

#### App Icons
- `icon.png`: General app icon (1024x1024)
- `adaptive-icon.png`: Android adaptive icon
- `splash-icon.png`: Splash screen image
- `favicon.png`: Web favicon

## Data Flow

```
1. User records/uploads audio
   └─> App.js (React Native)

2. Audio sent to backend
   └─> services/api.js (FormData)
       └─> POST /predict

3. Backend processes
   └─> api_server.py (Flask)
       └─> yamnet_inference.py
           ├─> Load audio (16kHz)
           ├─> Generate spectrogram
           └─> YAMNet inference
               └─> Filter to 6 species

4. Results returned
   └─> JSON response
       ├─> predictions (confidence scores)
       ├─> spectrogram (base64 image)
       └─> audio_length

5. Display in app
   └─> App.js renders results
       ├─> Spectrogram image
       ├─> Confidence bars
       └─> Animal classifications
```

## Technology Stack

### Backend
- **Language**: Python 3.8+
- **Framework**: Flask (REST API)
- **ML Framework**: TensorFlow 2.13+
- **Model**: YAMNet (TensorFlow Hub)
- **Audio Processing**: Librosa
- **Scientific Computing**: NumPy, SciPy
- **Visualization**: Matplotlib

### Frontend
- **Language**: JavaScript (ES6+)
- **Framework**: React Native
- **Platform**: Expo
- **Audio**: expo-av
- **File System**: expo-file-system, expo-document-picker
- **UI**: React Native built-in components

## Development Workflow

### Backend Development
1. Edit Python files in `backend/`
2. Test with `python yamnet_inference.py`
3. Run server with `python api_server.py`
4. Test API with curl or Postman

### Frontend Development
1. Edit React Native files in `animal-sound-app/`
2. Run with `npm start`
3. Test on emulator or device
4. Hot reload automatically updates

### Integration Testing
1. Start backend server
2. Start frontend app
3. Test audio recording
4. Test file upload
5. Verify predictions
6. Check error handling

## Deployment

### Backend
- **Local**: `python api_server.py`
- **Production**: Deploy to Heroku, AWS, GCP
- **Docker**: Create Dockerfile for containerization

### Frontend
- **Development**: Expo Go app
- **Production**: Build with `eas build`
- **Distribution**: App Store, Google Play

## Extending the System

### Add New Animal Species
1. Update `ANIMAL_CLASSES` in `yamnet_inference.py`
2. Add corresponding AudioSet class names
3. Update UI in `App.js`
4. Update documentation

### Add New Features
1. Backend: Add new endpoints in `api_server.py`
2. Frontend: Add new UI components in `App.js`
3. API: Update `services/api.js`

### Custom Model
1. Replace YAMNet in `yamnet_inference.py`
2. Update preprocessing pipeline
3. Maintain same API interface

## Security Considerations

- Audio files are temporarily stored and deleted
- No persistent storage of user data
- CORS configured for allowed origins
- Input validation on backend
- Error messages don't expose sensitive info

## Performance Optimization

### Backend
- Model loaded once (lazy loading)
- Async processing possible
- Batch inference support

### Frontend
- Results cached in state
- Images compressed
- Lazy loading of components
- Platform-specific optimizations

## Maintenance

### Regular Updates
- Update Python dependencies
- Update Node.js dependencies
- Update TensorFlow/YAMNet model
- Update Expo SDK

### Monitoring
- Backend logs
- API response times
- Error rates
- User feedback

## License

MIT License - See root README.md

## Contributors

Built with ❤️ for bioacoustic classification
