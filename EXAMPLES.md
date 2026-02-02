# Ejemplo de Uso - Animal Sound Classifier

Este documento muestra ejemplos prácticos de uso del sistema.

## 📱 Flujo de Usuario en la App

### 1. Inicio de la Aplicación

```
┌─────────────────────────────────────────┐
│  🐾 Animal Sound Classifier             │
│  YAMNet - 6 Species Detection           │
│                                         │
│  ● Backend: Connected / Demo Mode      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Record or Upload Audio                 │
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ 🎤 Start     │  │ 📁 Upload File  │ │
│  │   Recording  │  │                 │ │
│  └──────────────┘  └─────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  🔍 Analyze Audio                       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  How to use:                            │
│  1. Record or upload an audio file     │
│  2. Tap "Analyze Audio" to classify    │
│  3. View results with confidence       │
│                                         │
│  Supported animals:                     │
│  Dog, Cat, Bird, Cow, Horse, Sheep     │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Grabando Audio

```
┌─────────────────────────────────────────┐
│  🐾 Animal Sound Classifier             │
│  YAMNet - 6 Species Detection           │
│                                         │
│  ● Backend: Connected                  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Record or Upload Audio                 │
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ ⏹ Stop       │  │ 📁 Upload File  │ │
│  │   Recording  │  │                 │ │
│  └──────────────┘  └─────────────────┘ │
│         🔴 Recording...                 │
│                                         │
│  ✓ Audio ready               [Clear]   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  🔍 Analyze Audio                       │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Analizando Audio

```
┌─────────────────────────────────────────┐
│  🐾 Animal Sound Classifier             │
│  YAMNet - 6 Species Detection           │
│                                         │
│  ● Backend: Connected                  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ✓ Audio ready               [Clear]   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  🔍 Analyze Audio                       │
│      ⏳ Analyzing...                    │
│                                         │
└─────────────────────────────────────────┘
```

### 4. Mostrando Resultados

```
┌─────────────────────────────────────────┐
│  🐾 Animal Sound Classifier             │
│  YAMNet - 6 Species Detection           │
│                                         │
│  ● Backend: Connected                  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Spectrogram                            │
│  ┌───────────────────────────────────┐ │
│  │   Mel Spectrogram Visualization   │ │
│  │         Duration: 3.50s           │ │
│  │                                   │ │
│  │  [Visual representation of       │ │
│  │   audio frequency over time]     │ │
│  └───────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Detection Results                      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Dog                         82.5% │ │
│  │ ████████████████░░░░░░            │ │
│  │ Bark                              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Bird                        15.3% │ │
│  │ ███░░░░░░░░░░░░░░░░░              │ │
│  │ Bird vocalization                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Cat                          8.2% │ │
│  │ █░░░░░░░░░░░░░░░░░░░              │ │
│  │ Meow                              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Cow                          5.1% │ │
│  │ █░░░░░░░░░░░░░░░░░░░              │ │
│  │ Moo                               │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## 💻 Ejemplos de Código

### Uso del Backend - CLI

```bash
# Iniciar el servidor
$ python api_server.py
Loading YAMNet model...
Model loaded. Monitoring 6 animal-related classes
 * Running on http://0.0.0.0:5000
```

```bash
# Clasificar un archivo de audio
$ python yamnet_inference.py dog_bark.wav

Loading YAMNet model...
Model loaded. Monitoring 6 animal-related classes

Processing audio: dog_bark.wav

Audio duration: 3.45 seconds

Predictions:
--------------------------------------------------
Dog       :  82.50% (Bark)
Bird      :  15.30% (Bird vocalization)
Cat       :   8.20% (Meow)
Cow       :   5.10% (Moo)
Horse     :   3.20% (Neigh)
Sheep     :   2.10% (Bleat)

Spectrogram generated successfully
```

### Uso del Backend - API REST

```bash
# Health check
$ curl http://localhost:5000/health
{
  "status": "ok",
  "message": "Server is running"
}
```

```bash
# Obtener clases soportadas
$ curl http://localhost:5000/classes
{
  "classes": [
    "Dog",
    "Cat",
    "Bird",
    "Cow",
    "Horse",
    "Sheep"
  ]
}
```

```bash
# Clasificar audio
$ curl -X POST -F "file=@dog_bark.wav" http://localhost:5000/predict
{
  "predictions": {
    "Dog": {
      "confidence": 0.825,
      "class_name": "Bark"
    },
    "Bird": {
      "confidence": 0.153,
      "class_name": "Bird vocalization"
    },
    "Cat": {
      "confidence": 0.082,
      "class_name": "Meow"
    },
    "Cow": {
      "confidence": 0.051,
      "class_name": "Moo"
    },
    "Horse": {
      "confidence": 0.032,
      "class_name": "Neigh"
    },
    "Sheep": {
      "confidence": 0.021,
      "class_name": "Bleat"
    }
  },
  "spectrogram": "data:image/png;base64,iVBORw0KG...",
  "audio_length": 3.45
}
```

### Uso del Frontend - JavaScript

```javascript
// En App.js - Grabar audio
const startRecording = async () => {
  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  setRecording(recording);
  setIsRecording(true);
};
```

```javascript
// En services/api.js - Llamar al API
import { predictAnimalSound } from './services/api';

const analyzeAudio = async () => {
  try {
    const data = await predictAnimalSound(audioUri);
    setPredictions(data.predictions);
    setSpectrogram(data.spectrogram);
    setAudioLength(data.audio_length);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🎨 Ejemplo Visual de Espectrograma

```
Mel Spectrogram - Dog Bark
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8000 Hz ┤         ██████                    
        │     ████████████████              
6000 Hz ┤   ██████████████████████          
        │ ████████████████████████████      
4000 Hz ┤████████████████████████████████   
        │████████████████████████████████   
2000 Hz ┤████████████████████████████████   
        │██████████████████████████████     
   0 Hz └────────────────────────────────
        0s      1s      2s      3s    3.5s
        
        Time (seconds)
```

## 📊 Casos de Ejemplo

### Ejemplo 1: Ladrido de Perro

**Entrada**: `dog_bark.wav` (3.5 segundos)

**Resultados**:
- 🐕 Dog: 82.5% (Bark) ← **Predicción principal**
- 🐦 Bird: 15.3% (Bird vocalization)
- 🐱 Cat: 8.2% (Meow)
- 🐄 Cow: 5.1% (Moo)
- 🐴 Horse: 3.2% (Neigh)
- 🐑 Sheep: 2.1% (Bleat)

**Interpretación**: Alta confianza en perro (82.5%), claramente identificado como ladrido.

### Ejemplo 2: Maullido de Gato

**Entrada**: `cat_meow.wav` (2.1 segundos)

**Resultados**:
- 🐱 Cat: 78.9% (Meow) ← **Predicción principal**
- 🐕 Dog: 12.4% (Bark)
- 🐦 Bird: 7.8% (Chirp)
- 🐑 Sheep: 3.2% (Bleat)
- 🐄 Cow: 2.5% (Moo)
- 🐴 Horse: 1.8% (Neigh)

**Interpretación**: Alta confianza en gato (78.9%), claramente identificado como maullido.

### Ejemplo 3: Canto de Pájaro

**Entrada**: `bird_song.wav` (4.2 segundos)

**Resultados**:
- 🐦 Bird: 91.2% (Bird vocalization) ← **Predicción principal**
- 🐱 Cat: 5.3% (Meow)
- 🐕 Dog: 4.1% (Bark)
- 🐑 Sheep: 2.0% (Bleat)
- 🐴 Horse: 1.5% (Neigh)
- 🐄 Cow: 1.2% (Moo)

**Interpretación**: Muy alta confianza en pájaro (91.2%), vocalizaciones características.

## 🔧 Configuración de Ejemplo

### Para Desarrollo Local

**iOS Simulator**:
```javascript
// services/api.js
const API_BASE_URL = 'http://localhost:5000';
```

**Android Emulator**:
```javascript
// services/api.js
const API_BASE_URL = 'http://10.0.2.2:5000';
```

**Dispositivo Físico**:
```javascript
// services/api.js
// Encuentra tu IP con: ifconfig (Mac) o ipconfig (Windows)
const API_BASE_URL = 'http://192.168.1.100:5000';
```

### Para Producción

```javascript
// services/api.js
const API_BASE_URL = 'https://api.animal-sounds.com';
```

## 🎓 Tutorial Paso a Paso

### Tutorial 1: Primera Grabación

1. **Inicia la app**: `npm start` y presiona `w`
2. **Permite permisos**: Acepta permisos de micrófono
3. **Graba audio**: Toca "🎤 Start Recording"
4. **Haz ruido**: Reproduce un sonido de perro (YouTube, etc.)
5. **Detén**: Toca "⏹ Stop Recording"
6. **Analiza**: Toca "🔍 Analyze Audio"
7. **Ve resultados**: Observa las predicciones

### Tutorial 2: Cargar Archivo

1. **Abre la app**
2. **Toca**: "📁 Upload File"
3. **Selecciona**: Un archivo de audio de animal
4. **Analiza**: Toca "🔍 Analyze Audio"
5. **Compara**: Verifica la precisión con el animal real

### Tutorial 3: Modo Demo

1. **Sin backend**: No inicies el servidor Python
2. **Abre la app**: La app detectará el backend offline
3. **Graba audio**: Funciona normalmente
4. **Analiza**: Verás datos demo simulados
5. **Observa**: Banner indica "Demo Mode"

## 🐛 Solución de Problemas con Ejemplos

### Problema: "Cannot connect to backend"

```
Error mostrado:
❌ Backend: Demo Mode
⚠️  Backend server is not available

Solución:
1. Verifica que el backend esté corriendo:
   $ ps aux | grep python
   
2. Inicia el backend:
   $ cd backend
   $ python api_server.py
   
3. Verifica la URL en api.js
```

### Problema: "Permission denied"

```
Error mostrado:
❌ Error: Failed to start recording
   Permission denied

Solución:
1. iOS: Settings > Privacy > Microphone > [App] ✓
2. Android: Settings > Apps > [App] > Permissions > Microphone ✓
3. Reinicia la app
```

## 📈 Métricas de Rendimiento

### Tiempos de Procesamiento

```
┌─────────────────────┬──────────────┐
│ Operación           │ Tiempo       │
├─────────────────────┼──────────────┤
│ Cargar YAMNet       │ ~10-15s      │
│ Procesar audio 3s   │ ~1-2s        │
│ Generar espectro    │ ~0.5-1s      │
│ Inferencia          │ ~0.5-1s      │
│ Total (primera vez) │ ~12-19s      │
│ Total (subsiguiente)│ ~2-4s        │
└─────────────────────┴──────────────┘
```

### Precisión Estimada

```
┌─────────────┬──────────────┐
│ Especie     │ Precisión    │
├─────────────┼──────────────┤
│ Perro       │ ~85-90%      │
│ Gato        │ ~80-85%      │
│ Pájaro      │ ~90-95%      │
│ Vaca        │ ~75-80%      │
│ Caballo     │ ~70-75%      │
│ Oveja       │ ~70-75%      │
└─────────────┴──────────────┘
```

*Nota: La precisión depende de la calidad del audio y claridad del sonido*

## 🎯 Casos de Uso Reales

1. **Granja Inteligente**: Monitoreo de ganado
2. **Reserva Natural**: Identificación de fauna
3. **Educación**: App de aprendizaje para niños
4. **Veterinaria**: Análisis de vocalizaciones
5. **Investigación**: Estudios de bioacústica

---

¿Listo para probarlo? Sigue el [QUICKSTART.md](QUICKSTART.md)
