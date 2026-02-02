import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [spectrogram, setSpectrogram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioLength, setAudioLength] = useState(0);

  useEffect(() => {
    // Request permissions on mount
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant audio recording permissions to use this app.'
        );
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording: ' + err.message);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);
      
      // Clear previous results
      setPredictions(null);
      setSpectrogram(null);
      
      Alert.alert('Success', 'Recording saved! Tap "Analyze Audio" to classify.');
    } catch (err) {
      Alert.alert('Error', 'Failed to stop recording: ' + err.message);
    }
  };

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAudioUri(result.assets[0].uri);
        setPredictions(null);
        setSpectrogram(null);
        Alert.alert('Success', 'Audio file loaded! Tap "Analyze Audio" to classify.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick file: ' + err.message);
    }
  };

  const analyzeAudio = async () => {
    if (!audioUri) {
      Alert.alert('No Audio', 'Please record or upload an audio file first.');
      return;
    }

    setLoading(true);
    
    try {
      // Read audio file
      const audioData = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // For demo purposes, we'll simulate the API response
      // In production, replace this with actual API call to your Flask server
      // const response = await fetch('http://YOUR_SERVER_IP:5000/predict', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ audio: audioData }),
      // });
      // const data = await response.json();

      // Simulated response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      
      const mockPredictions = {
        Dog: { confidence: 0.82, class_name: 'Bark' },
        Bird: { confidence: 0.15, class_name: 'Bird vocalization' },
        Cat: { confidence: 0.08, class_name: 'Meow' },
        Cow: { confidence: 0.05, class_name: 'Moo' },
        Horse: { confidence: 0.03, class_name: 'Neigh' },
        Sheep: { confidence: 0.02, class_name: 'Bleat' },
      };

      setPredictions(mockPredictions);
      setAudioLength(3.5);
      
      // For demo, use a placeholder spectrogram
      // In production, this would come from the API response
      setSpectrogram('placeholder');
      
      Alert.alert(
        'Analysis Complete',
        'Check the results below!'
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to analyze audio: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setAudioUri(null);
    setPredictions(null);
    setSpectrogram(null);
    setAudioLength(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🐾 Animal Sound Classifier</Text>
          <Text style={styles.subtitle}>YAMNet - 6 Species Detection</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Record or Upload Audio</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, isRecording && styles.buttonRecording]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.buttonText}>
                {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={pickAudioFile}
              disabled={isRecording}
            >
              <Text style={styles.buttonText}>📁 Upload File</Text>
            </TouchableOpacity>
          </View>

          {audioUri && (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>✓ Audio ready</Text>
              <TouchableOpacity onPress={clearResults}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.analyzeButton, (!audioUri || loading) && styles.buttonDisabled]}
            onPress={analyzeAudio}
            disabled={!audioUri || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🔍 Analyze Audio</Text>
            )}
          </TouchableOpacity>
        </View>

        {spectrogram && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spectrogram</Text>
            <View style={styles.spectrogramPlaceholder}>
              <Text style={styles.spectrogramText}>
                Mel Spectrogram Visualization
                {audioLength > 0 && `\nDuration: ${audioLength.toFixed(2)}s`}
              </Text>
            </View>
          </View>
        )}

        {predictions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detection Results</Text>
            
            {Object.entries(predictions).map(([animal, info]) => (
              <View key={animal} style={styles.predictionCard}>
                <View style={styles.predictionHeader}>
                  <Text style={styles.animalName}>{animal}</Text>
                  <Text style={styles.confidence}>
                    {(info.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${info.confidence * 100}%` },
                      info.confidence > 0.5 && styles.progressHigh,
                    ]}
                  />
                </View>
                <Text style={styles.className}>{info.class_name}</Text>
              </View>
            ))}
          </View>
        )}

        {!predictions && !loading && (
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>How to use:</Text>
            <Text style={styles.instructionsText}>
              1. Record or upload an audio file{'\n'}
              2. Tap "Analyze Audio" to classify{'\n'}
              3. View results with confidence scores{'\n'}
              {'\n'}
              Supported animals: Dog, Cat, Bird, Cow, Horse, Sheep
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#2ecc71',
  },
  buttonRecording: {
    backgroundColor: '#e74c3c',
  },
  analyzeButton: {
    backgroundColor: '#9b59b6',
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  statusText: {
    color: '#155724',
    fontSize: 14,
  },
  clearButton: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  spectrogramPlaceholder: {
    backgroundColor: '#2c3e50',
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spectrogramText: {
    color: '#ecf0f1',
    fontSize: 16,
    textAlign: 'center',
  },
  predictionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  animalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  confidence: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
  },
  progressHigh: {
    backgroundColor: '#2ecc71',
  },
  className: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  instructionsBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 22,
  },
});
