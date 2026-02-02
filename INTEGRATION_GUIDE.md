# Guía de Integración Completa

Esta guía te ayudará a configurar e integrar el sistema completo de clasificación de sonidos animales.

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────┐
│         App Móvil (React Native/Expo)       │
│  - Grabación de audio                       │
│  - Carga de archivos                        │
│  - Visualización de resultados              │
└────────────────┬────────────────────────────┘
                 │ HTTP POST /predict
                 │ (multipart/form-data)
                 ▼
┌─────────────────────────────────────────────┐
│         Backend API (Flask)                 │
│  - Recepción de audio                       │
│  - Preprocesamiento                         │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│      YAMNet (TensorFlow Hub)                │
│  - Modelo pre-entrenado                     │
│  - Clasificación AudioSet (521 clases)      │
│  - Filtrado a 6 especies                    │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         Resultados                          │
│  - Predicciones por especie                 │
│  - Porcentajes de confianza                 │
│  - Espectrograma Mel                        │
└─────────────────────────────────────────────┘
```

## Configuración Paso a Paso

### Paso 1: Configurar el Backend

1. **Instalar dependencias Python:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Verificar instalación:**
```bash
python demo.py
```

3. **Iniciar servidor API:**
```bash
python api_server.py
```

El servidor estará disponible en `http://localhost:5000`

### Paso 2: Configurar la App Móvil

1. **Instalar dependencias Node.js:**
```bash
cd animal-sound-app
npm install
```

2. **Configurar la URL del backend:**

Edita `animal-sound-app/services/api.js`:

```javascript
// Desarrollo Local
const API_BASE_URL = 'http://localhost:5000';  // iOS Simulator
const API_BASE_URL = 'http://10.0.2.2:5000';   // Android Emulator

// Dispositivo Físico (usa la IP de tu computadora)
const API_BASE_URL = 'http://192.168.1.100:5000';
```

Para encontrar tu IP:
- **Windows**: `ipconfig`
- **Mac/Linux**: `ifconfig` o `ip addr show`

3. **Iniciar la aplicación:**
```bash
npm start
```

### Paso 3: Conectar Frontend y Backend

#### Opción A: Desarrollo en Emuladores

**iOS Simulator:**
- Backend: `http://localhost:5000`
- Frontend: Usa `localhost` en api.js

**Android Emulator:**
- Backend: `http://localhost:5000`
- Frontend: Usa `10.0.2.2` en api.js (IP especial que apunta al host)

#### Opción B: Desarrollo en Dispositivo Físico

1. Asegúrate de que tu computadora y dispositivo estén en la misma red WiFi
2. Encuentra tu IP local (e.g., 192.168.1.100)
3. Actualiza `API_BASE_URL` en api.js
4. Inicia el servidor con: `python api_server.py`
5. Escanea el código QR en Expo Go

#### Opción C: Producción

Para desplegar en producción:

**Backend:**
- Despliega en servicios como Heroku, AWS, Google Cloud
- Actualiza la URL en la app móvil
- Considera usar HTTPS

**Frontend:**
- Build la app: `eas build`
- Publica en App Store / Google Play

## Flujo de Trabajo Típico

### 1. Usuario graba audio
```javascript
// En App.js
const { recording } = await Audio.Recording.createAsync(
  Audio.RecordingOptionsPresets.HIGH_QUALITY
);
```

### 2. App envía audio al backend
```javascript
// En services/api.js
const formData = new FormData();
formData.append('file', {
  uri: audioUri,
  name: 'audio.wav',
  type: 'audio/wav',
});

const response = await fetch(`${API_BASE_URL}/predict`, {
  method: 'POST',
  body: formData,
});
```

### 3. Backend procesa el audio
```python
# En yamnet_inference.py
waveform = self.load_audio(audio_path)  # Carga a 16kHz
spectrogram = self.generate_spectrogram(waveform)  # Mel spectrogram
predictions = self.predict(waveform)  # Inferencia YAMNet
```

### 4. Resultados se devuelven a la app
```json
{
  "predictions": {
    "Dog": {"confidence": 0.85, "class_name": "Bark"},
    "Bird": {"confidence": 0.15, "class_name": "Chirp"},
    ...
  },
  "spectrogram": "data:image/png;base64,...",
  "audio_length": 3.5
}
```

### 5. App muestra los resultados
```javascript
// En App.js
setPredictions(data.predictions);
setSpectrogram(data.spectrogram);
```

## Pruebas

### Probar el Backend Directamente

```bash
# Desde línea de comandos
cd backend
python yamnet_inference.py sample_audio.wav

# O usando curl
curl -X POST -F "file=@sample_audio.wav" http://localhost:5000/predict
```

### Probar la Integración Completa

1. Inicia el backend: `python api_server.py`
2. Inicia la app: `npm start` en animal-sound-app
3. En la app:
   - Graba un audio de prueba
   - O sube un archivo de audio
   - Toca "Analyze Audio"
   - Verifica que se muestren los resultados

## Solución de Problemas Comunes

### Error: "Cannot connect to backend"

**Solución:**
1. Verifica que el backend esté ejecutándose
2. Comprueba la URL en `services/api.js`
3. Para Android emulator, usa `10.0.2.2`
4. Para dispositivo físico, usa la IP de tu PC
5. Verifica el firewall/antivirus

### Error: "Permission denied for microphone"

**Solución:**
1. iOS: Settings > Privacy > Microphone > [App] > Enable
2. Android: Settings > Apps > [App] > Permissions > Microphone > Allow
3. Reinicia la app después de otorgar permisos

### Error: "Module not found" en Python

**Solución:**
```bash
pip install -r requirements.txt --upgrade
```

### Error: "Expo Go incompatible"

**Solución:**
1. Actualiza Expo Go desde App Store/Play Store
2. O ejecuta: `expo start --clear`

## Optimizaciones

### Backend

1. **Caché del modelo:**
```python
# Cargar el modelo una vez y reutilizar
classifier = YAMNetAnimalClassifier()  # Global
```

2. **Procesamiento en lote:**
```python
# Procesar múltiples audios a la vez
results = [classifier.process_audio(f) for f in files]
```

3. **Compresión de respuestas:**
```python
# En Flask
from flask import jsonify
from flask_compress import Compress
Compress(app)
```

### Frontend

1. **Caché de resultados:**
```javascript
// Guardar resultados en AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
```

2. **Compresión de audio:**
```javascript
// Antes de enviar al backend
import { Audio } from 'expo-av';
// Usar calidad media para archivos más pequeños
```

3. **Indicadores de progreso:**
```javascript
// Mostrar progreso durante el análisis
<ActivityIndicator animating={loading} />
```

## Recursos Adicionales

- [YAMNet Documentation](https://tfhub.dev/google/yamnet/1)
- [Expo Audio API](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Flask REST API](https://flask.palletsprojects.com/)
- [React Native Best Practices](https://reactnative.dev/)

## Soporte

Para problemas o preguntas:
1. Revisa los logs del backend
2. Revisa los logs de Expo (`expo start`)
3. Verifica la consola del navegador (para web)
4. Abre un issue en el repositorio
