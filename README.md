# Deteccion_Sonidos_Animales

Sistema de clasificación bioacústica para 6 especies de animales (perro, gato, pájaro, vaca, caballo, oveja) usando el modelo YAMNet de Google. El sistema incluye un backend Python/TensorFlow y una aplicación móvil desarrollada con Expo (React Native).

## 🎯 Características

- **Clasificación de 6 Especies**: Perro, Gato, Pájaro, Vaca, Caballo, Oveja
- **Modelo YAMNet**: Utiliza el modelo pre-entrenado de Google en AudioSet
- **Generación de Espectrogramas**: Visualización Mel Spectrogram del audio
- **Backend Python**: API REST para procesamiento de audio e inferencia
- **App Móvil Expo**: Interfaz para grabar/subir audio y ver resultados
- **Confianza de Predicción**: Muestra porcentajes de confianza para cada especie

## 📁 Estructura del Proyecto

```
Deteccion_Sonidos_Animales/
├── backend/                      # Backend Python/TensorFlow
│   ├── yamnet_inference.py      # Script principal de inferencia
│   ├── api_server.py            # Servidor Flask API
│   ├── requirements.txt         # Dependencias Python
│   └── README.md               # Documentación del backend
│
├── animal-sound-app/            # Aplicación Expo/React Native
│   ├── App.js                  # Componente principal
│   ├── services/
│   │   └── api.js             # Cliente API
│   ├── app.json               # Configuración Expo
│   ├── package.json           # Dependencias Node.js
│   └── README.md             # Documentación de la app
│
└── README.md                   # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

**Backend:**
- Python 3.8 o superior
- pip (gestor de paquetes Python)

**Frontend:**
- Node.js 18 o superior
- npm o yarn
- Expo CLI: `npm install -g expo-cli`

### Instalación

#### 1. Backend (Python/TensorFlow)

```bash
cd backend
pip install -r requirements.txt
```

#### 2. Frontend (Expo/React Native)

```bash
cd animal-sound-app
npm install
```

### Ejecución

#### Iniciar el Backend

```bash
cd backend
python api_server.py
```

El servidor estará disponible en `http://localhost:5000`

#### Iniciar la App Móvil

```bash
cd animal-sound-app
npm start
```

Opciones para ejecutar:
- **iOS Simulator**: Presiona `i`
- **Android Emulator**: Presiona `a`
- **Dispositivo Físico**: Escanea el código QR con Expo Go
- **Navegador Web**: Presiona `w`

## 🔧 Configuración

### Conectar Frontend con Backend

1. En `animal-sound-app/services/api.js`, actualiza la URL del backend:

```javascript
// Para desarrollo local
const API_BASE_URL = 'http://localhost:5000';  // iOS Simulator
const API_BASE_URL = 'http://10.0.2.2:5000';   // Android Emulator
const API_BASE_URL = 'http://192.168.1.x:5000'; // Dispositivo físico
```

2. Asegúrate de que el backend esté ejecutándose y accesible desde la red

## 📱 Uso de la Aplicación

### Grabar Audio
1. Abre la aplicación
2. Toca el botón "🎤 Start Recording"
3. Graba el sonido del animal
4. Toca "⏹ Stop Recording"

### Subir Archivo de Audio
1. Toca el botón "📁 Upload File"
2. Selecciona un archivo de audio
3. El archivo estará listo para análisis

### Analizar Audio
1. Con audio grabado o cargado, toca "🔍 Analyze Audio"
2. Espera mientras se procesa
3. Visualiza los resultados:
   - Espectrograma Mel
   - Predicciones con porcentajes de confianza
   - Clasificación por especie

## 🧠 Modelo YAMNet

YAMNet es un modelo de clasificación de audio profundo pre-entrenado que puede predecir eventos de audio del conjunto de datos AudioSet de Google. El modelo:

- **Entrada**: Audio a 16 kHz mono
- **Arquitectura**: Red neuronal convolucional MobileNet
- **Clases**: 521 clases de AudioSet
- **Filtrado**: Solo se utilizan las clases relacionadas con las 6 especies

### Especies Soportadas

| Animal | Clases AudioSet Relacionadas |
|--------|------------------------------|
| **Perro** | Dog, Bark, Bow-wow, Growling, Whimper |
| **Gato** | Cat, Meow, Purr, Hiss, Caterwaul |
| **Pájaro** | Bird, Bird vocalization, Chirp, Tweet, Squawk |
| **Vaca** | Cow, Moo, Cattle |
| **Caballo** | Horse, Neigh, Whinny, Clip-clop |
| **Oveja** | Sheep, Bleat |

## 🔬 API del Backend

### Endpoints

#### POST /predict
Clasifica audio subido

**Request:**
```
Content-Type: multipart/form-data
Body: file (archivo de audio)
```

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
  "spectrogram": "data:image/png;base64,...",
  "audio_length": 3.5
}
```

#### GET /classes
Obtiene lista de especies soportadas

#### GET /health
Verifica estado del servidor

## 🧪 Uso por Línea de Comandos

Puedes usar el script de inferencia directamente:

```bash
cd backend
python yamnet_inference.py path/to/audio.wav
```

Output:
```
Loading YAMNet model...
Model loaded. Monitoring 6 animal-related classes

Processing audio: audio.wav

Audio duration: 3.45 seconds

Predictions:
--------------------------------------------------
Dog       :  82.50% (Bark)
Bird      :  15.30% (Bird vocalization)
Cat       :   8.20% (Meow)
...
```

## 📊 Generación de Espectrogramas

El sistema genera espectrogramas Mel para visualización:

- **Tipo**: Mel Spectrogram
- **Resolución**: 128 bandas mel
- **Rango de frecuencia**: 0-8000 Hz
- **Escala**: dB
- **Formato**: PNG en base64

## 🛠️ Tecnologías Utilizadas

### Backend
- **TensorFlow**: Framework de ML
- **TensorFlow Hub**: Carga del modelo YAMNet
- **Librosa**: Procesamiento de audio
- **Flask**: API REST
- **NumPy/SciPy**: Operaciones numéricas
- **Matplotlib**: Generación de espectrogramas

### Frontend
- **React Native**: Framework móvil
- **Expo**: Plataforma de desarrollo
- **expo-av**: Grabación y reproducción de audio
- **expo-document-picker**: Selección de archivos
- **expo-file-system**: Operaciones de archivos

## 🐛 Solución de Problemas

### Backend no inicia
- Verifica que todas las dependencias estén instaladas
- Asegúrate de tener Python 3.8+
- El primer inicio puede tardar mientras descarga el modelo YAMNet

### App no se conecta al backend
- Verifica que el backend esté ejecutándose
- Usa la IP correcta según tu dispositivo
- Comprueba el firewall/antivirus
- Para Android emulator, usa `10.0.2.2` en lugar de `localhost`

### Permisos de micrófono
- Acepta los permisos cuando se soliciten
- En iOS: Settings > App > Microphone
- En Android: Settings > Apps > Permissions > Microphone

## 📝 Licencia

MIT

## 👨‍💻 Autor

Sistema desarrollado con EXPO y YAMNet para clasificación bioacústica de 6 especies de animales.

## 🙏 Referencias

- [YAMNet - Google Research](https://tfhub.dev/google/yamnet/1)
- [AudioSet Dataset](https://research.google.com/audioset/)
- [Expo Documentation](https://docs.expo.dev/)
- [TensorFlow Hub](https://www.tensorflow.org/hub)

