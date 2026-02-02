"""
YAMNet Inference Script for Animal Sound Classification
Supports 6 animal species: Dog, Cat, Bird, Cow, Horse, Sheep
"""

import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import librosa
import matplotlib.pyplot as plt
from scipy import signal
import io
import base64


class YAMNetAnimalClassifier:
    """
    Animal sound classifier using YAMNet pretrained model
    Filters predictions for 6 specific animal species from AudioSet
    """
    
    # AudioSet class IDs for target animals
    ANIMAL_CLASSES = {
        'Dog': ['Dog', 'Bark', 'Bow-wow', 'Growling', 'Whimper'],
        'Cat': ['Cat', 'Meow', 'Purr', 'Hiss', 'Caterwaul'],
        'Bird': ['Bird', 'Bird vocalization', 'Bird flight', 'Chirp', 'Tweet', 'Squawk'],
        'Cow': ['Cow', 'Moo', 'Cattle'],
        'Horse': ['Horse', 'Neigh', 'Whinny', 'Clip-clop'],
        'Sheep': ['Sheep', 'Bleat']
    }
    
    def __init__(self, model_url='https://tfhub.dev/google/yamnet/1'):
        """Initialize YAMNet model and class names"""
        print("Loading YAMNet model...")
        self.model = hub.load(model_url)
        
        # Load class names from YAMNet
        self.class_names = self._load_class_names()
        
        # Create mapping of animal classes to indices
        self.animal_class_indices = self._create_animal_indices()
        print(f"Model loaded. Monitoring {len(self.animal_class_indices)} animal-related classes")
    
    def _load_class_names(self):
        """Load YAMNet class names from CSV"""
        class_map_path = self.model.class_map_path().numpy()
        class_names = []
        
        with open(class_map_path, 'r') as f:
            # Skip header
            next(f)
            for line in f:
                parts = line.strip().split(',')
                if len(parts) >= 3:
                    class_names.append(parts[2])  # Display name
        
        return class_names
    
    def _create_animal_indices(self):
        """Create mapping of target animal classes to their indices"""
        animal_indices = {}
        
        for animal, keywords in self.ANIMAL_CLASSES.items():
            indices = []
            for idx, class_name in enumerate(self.class_names):
                for keyword in keywords:
                    if keyword.lower() in class_name.lower():
                        indices.append(idx)
                        break
            animal_indices[animal] = indices
        
        return animal_indices
    
    def load_audio(self, audio_path, target_sr=16000):
        """
        Load audio file and resample to target sample rate
        
        Args:
            audio_path: Path to audio file
            target_sr: Target sample rate (YAMNet expects 16kHz)
            
        Returns:
            Audio waveform as numpy array
        """
        # Load audio with librosa
        waveform, sr = librosa.load(audio_path, sr=target_sr, mono=True)
        
        # Ensure float32 format
        waveform = waveform.astype(np.float32)
        
        return waveform
    
    def generate_spectrogram(self, waveform, sr=16000):
        """
        Generate mel spectrogram for visualization
        
        Args:
            waveform: Audio waveform
            sr: Sample rate
            
        Returns:
            Spectrogram image as base64 string
        """
        # Generate mel spectrogram
        mel_spec = librosa.feature.melspectrogram(
            y=waveform, 
            sr=sr,
            n_mels=128,
            fmax=8000
        )
        
        # Convert to dB scale
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        
        # Create plot
        plt.figure(figsize=(10, 4))
        librosa.display.specshow(
            mel_spec_db,
            sr=sr,
            x_axis='time',
            y_axis='mel',
            fmax=8000,
            cmap='viridis'
        )
        plt.colorbar(format='%+2.0f dB')
        plt.title('Mel Spectrogram')
        plt.tight_layout()
        
        # Convert to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close()
        
        return image_base64
    
    def predict(self, waveform):
        """
        Run YAMNet inference on audio waveform
        
        Args:
            waveform: Audio waveform (16kHz, mono)
            
        Returns:
            Dictionary with predictions for each animal class
        """
        # Run model
        scores, embeddings, spectrogram = self.model(waveform)
        
        # Get predictions
        scores_np = scores.numpy()
        
        # Average scores across all frames
        mean_scores = np.mean(scores_np, axis=0)
        
        # Filter for animal classes
        animal_predictions = {}
        
        for animal, indices in self.animal_class_indices.items():
            if indices:
                # Get max score across all related classes for this animal
                animal_scores = mean_scores[indices]
                max_score = float(np.max(animal_scores))
                best_class_idx = indices[np.argmax(animal_scores)]
                best_class_name = self.class_names[best_class_idx]
                
                animal_predictions[animal] = {
                    'confidence': max_score,
                    'class_name': best_class_name
                }
            else:
                animal_predictions[animal] = {
                    'confidence': 0.0,
                    'class_name': 'Not found'
                }
        
        # Sort by confidence
        sorted_predictions = dict(
            sorted(animal_predictions.items(), 
                   key=lambda x: x[1]['confidence'], 
                   reverse=True)
        )
        
        return sorted_predictions
    
    def process_audio(self, audio_path):
        """
        Complete audio processing pipeline
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Dictionary with predictions and spectrogram
        """
        # Load audio
        waveform = self.load_audio(audio_path)
        
        # Generate spectrogram
        spectrogram_base64 = self.generate_spectrogram(waveform)
        
        # Get predictions
        predictions = self.predict(waveform)
        
        return {
            'predictions': predictions,
            'spectrogram': spectrogram_base64,
            'audio_length': len(waveform) / 16000  # Duration in seconds
        }


def main():
    """Example usage"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python yamnet_inference.py <audio_file_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    
    # Initialize classifier
    classifier = YAMNetAnimalClassifier()
    
    # Process audio
    print(f"\nProcessing audio: {audio_path}")
    results = classifier.process_audio(audio_path)
    
    # Display results
    print(f"\nAudio duration: {results['audio_length']:.2f} seconds")
    print("\nPredictions:")
    print("-" * 50)
    
    for animal, info in results['predictions'].items():
        confidence_pct = info['confidence'] * 100
        print(f"{animal:10s}: {confidence_pct:6.2f}% ({info['class_name']})")
    
    print("\nSpectrogram generated successfully")


if __name__ == '__main__':
    main()
