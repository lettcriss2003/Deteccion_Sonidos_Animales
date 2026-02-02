# Quick Start Guide

Guía rápida para iniciar el sistema de clasificación de sonidos animales en menos de 5 minutos.

## Requisitos Previos

- Python 3.8+
- Node.js 18+
- npm o yarn

## Instalación Express (5 minutos)

### 1. Backend (2 minutos)

```bash
# Clonar el repositorio (si aún no lo has hecho)
git clone https://github.com/lettcriss2003/Deteccion_Sonidos_Animales.git
cd Deteccion_Sonidos_Animales

# Instalar dependencias Python
cd backend
pip install -r requirements.txt

# Iniciar el servidor (esto descargará YAMNet en el primer inicio)
python api_server.py
```

Espera a que veas: `Running on http://0.0.0.0:5000`

### 2. Frontend (3 minutos)

En una nueva terminal:

```bash
cd Deteccion_Sonidos_Animales/animal-sound-app

# Instalar dependencias
npm install

# Iniciar la aplicación
npm start
```

### 3. Ejecutar la App

Opciones:

**A. En el navegador web (más rápido para probar):**
- Presiona `w` cuando se muestre el menú
- O abre http://localhost:19006 en tu navegador

**B. En dispositivo físico:**
- Instala Expo Go desde App Store / Google Play
- Escanea el código QR que aparece en la terminal

**C. En emulador:**
- iOS Simulator: Presiona `i`
- Android Emulator: Presiona `a`

## Uso Rápido

1. **Grabar audio**: Toca "🎤 Start Recording"
2. **Detener**: Toca "⏹ Stop Recording"
3. **Analizar**: Toca "🔍 Analyze Audio"
4. **Ver resultados**: Observa las predicciones con confianza

## Modo Demo

Si el backend no está disponible, la app funcionará en **modo demo** con datos simulados para que puedas probar la interfaz.

## Solución de Problemas Rápidos

### Backend no inicia
```bash
# Verificar versión de Python
python --version  # Debe ser 3.8+

# Reinstalar dependencias
pip install -r requirements.txt --upgrade
```

### Frontend no inicia
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install

# O con Expo
expo start -c
```

### No se conecta al backend

**iOS Simulator / Web:**
- Usa `http://localhost:5000` en `services/api.js`

**Android Emulator:**
- Usa `http://10.0.2.2:5000` en `services/api.js`
- Esto ya está configurado automáticamente

**Dispositivo Físico:**
- Encuentra tu IP: `ifconfig` (Mac/Linux) o `ipconfig` (Windows)
- Edita `services/api.js` línea 17:
  ```javascript
  return 'http://TU_IP_AQUI:5000';
  ```

## Siguiente Paso

Lee la documentación completa en:
- `README.md` - Visión general
- `INTEGRATION_GUIDE.md` - Guía de integración detallada
- `backend/README.md` - Documentación del backend
- `animal-sound-app/README.md` - Documentación de la app

## Comandos Útiles

```bash
# Backend
python yamnet_inference.py audio.wav  # Clasificar desde CLI
python demo.py                        # Ver demo

# Frontend
npm start                             # Iniciar dev server
npm run web                          # Solo web
npm run android                      # Solo Android
npm run ios                          # Solo iOS

# Test rápido del API
curl -X POST -F "file=@audio.wav" http://localhost:5000/predict
curl http://localhost:5000/health
curl http://localhost:5000/classes
```

## Especies Soportadas

| Emoji | Animal | Clases AudioSet |
|-------|--------|----------------|
| 🐕 | Dog | Bark, Bow-wow, Growling, Whimper |
| 🐱 | Cat | Meow, Purr, Hiss, Caterwaul |
| 🐦 | Bird | Chirp, Tweet, Squawk |
| 🐄 | Cow | Moo |
| 🐴 | Horse | Neigh, Whinny, Clip-clop |
| 🐑 | Sheep | Bleat |

## Soporte

¿Problemas? Revisa:
1. Logs del backend en la terminal
2. Logs de Expo en la terminal
3. Consola del navegador (F12)
4. Issues en GitHub

¡Listo para clasificar sonidos animales! 🎉
