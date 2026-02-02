/**
 * API Service for Animal Sound Classification
 * Handles communication with the Python backend
 */

// Configure your backend server URL here
// For local development:
// - iOS Simulator: use 'localhost' or '127.0.0.1'
// - Android Emulator: use '10.0.2.2'
// - Physical Device: use your computer's IP address (e.g., '192.168.1.100')
const API_BASE_URL = 'http://localhost:5000';

/**
 * Predict animal sounds from audio file
 * @param {string} audioUri - Local file URI of the audio
 * @returns {Promise<Object>} Predictions and spectrogram data
 */
export async function predictAnimalSound(audioUri) {
  try {
    // Create form data
    const formData = new FormData();
    
    // Add file to form data
    const filename = audioUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `audio/${match[1]}` : 'audio/wav';
    
    formData.append('file', {
      uri: audioUri,
      name: filename,
      type: type,
    });

    // Make API request
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze audio');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Get list of supported animal classes
 * @returns {Promise<Array<string>>} List of animal class names
 */
export async function getSupportedClasses() {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch classes');
    }
    
    const data = await response.json();
    return data.classes;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Check if backend server is available
 * @returns {Promise<boolean>} True if server is healthy
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

/**
 * Configuration object for easy access
 */
export const ApiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    predict: '/predict',
    classes: '/classes',
    health: '/health',
  },
};
