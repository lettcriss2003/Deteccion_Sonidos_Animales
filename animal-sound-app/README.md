# Animal Sound Classifier - Expo App

React Native app built with Expo for classifying animal sounds using YAMNet model.

## Features

- 🎤 **Audio Recording**: Record audio directly from your device
- 📁 **File Upload**: Upload existing audio files
- 📊 **Spectrogram Visualization**: View mel spectrogram of audio
- 🔍 **Real-time Classification**: Detect 6 animal species with confidence scores
- 📱 **Cross-platform**: Works on iOS, Android, and Web

## Supported Animals

1. **Dog** (Bark, Bow-wow, Growling, Whimper)
2. **Cat** (Meow, Purr, Hiss, Caterwaul)
3. **Bird** (Bird vocalization, Chirp, Tweet, Squawk)
4. **Cow** (Moo)
5. **Horse** (Neigh, Whinny, Clip-clop)
6. **Sheep** (Bleat)

## Installation

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (macOS only)
- For Android: Android Studio

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **iOS Simulator**: Press `i` in terminal
   - **Android Emulator**: Press `a` in terminal
   - **Physical Device**: Scan QR code with Expo Go app
   - **Web Browser**: Press `w` in terminal

## Backend Configuration

To connect to the Python backend API:

1. Start the backend server (see `../backend/README.md`)
2. Update the API endpoint in `App.js`:
   ```javascript
   const API_URL = 'http://YOUR_SERVER_IP:5000';
   ```
3. For physical devices, use your computer's IP address
4. For emulators:
   - iOS: Use `localhost` or `127.0.0.1`
   - Android: Use `10.0.2.2`

## Project Structure

```
animal-sound-app/
├── App.js                 # Main application component
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── assets/               # Images and static files
└── README.md            # This file
```

## Main Components

### App.js

The main component includes:

- **Audio Recording**: Uses `expo-av` for recording
- **File Picker**: Uses `expo-document-picker` for file selection
- **API Integration**: Sends audio to backend for classification
- **Results Display**: Shows predictions with confidence scores
- **Spectrogram View**: Displays audio visualization

## Key Features Implementation

### Audio Recording
```javascript
const startRecording = async () => {
  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  setRecording(recording);
};
```

### File Upload
```javascript
const pickAudioFile = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
  });
  setAudioUri(result.uri);
};
```

### Audio Analysis
```javascript
const analyzeAudio = async () => {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  setPredictions(data.predictions);
};
```

## Permissions

The app requires the following permissions:

- **Microphone**: For audio recording
- **Storage**: For reading/writing audio files

Permissions are automatically requested on first use.

## Development

### Testing

Test on multiple platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Building for Production

Build standalone apps:
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Troubleshooting

### Audio Recording Issues
- Ensure microphone permissions are granted
- Check device audio settings
- Try restarting the app

### API Connection Issues
- Verify backend server is running
- Check network connectivity
- Ensure correct API URL
- For Android emulator, use `10.0.2.2` instead of `localhost`

### Expo Go Issues
- Update Expo Go app to latest version
- Clear cache: `expo start -c`
- Reinstall node_modules

## Technologies Used

- **React Native**: Mobile framework
- **Expo**: Development platform
- **expo-av**: Audio recording and playback
- **expo-document-picker**: File selection
- **expo-file-system**: File operations

## License

MIT

## Author

Built with YAMNet for bioacoustic classification
