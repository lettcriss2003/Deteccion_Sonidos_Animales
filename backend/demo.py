"""
Example script demonstrating YAMNet inference usage
"""

from yamnet_inference import YAMNetAnimalClassifier
import sys


def demo_with_test_audio():
    """Demo function - replace with actual audio file"""
    print("=" * 60)
    print("YAMNet Animal Sound Classifier - Demo")
    print("=" * 60)
    
    # Initialize classifier
    print("\n1. Initializing classifier...")
    classifier = YAMNetAnimalClassifier()
    
    print("\n2. Supported animals:")
    for animal in classifier.ANIMAL_CLASSES.keys():
        print(f"   - {animal}")
    
    print("\n3. To classify an audio file, run:")
    print(f"   python yamnet_inference.py <path_to_audio.wav>")
    
    print("\n4. Expected output:")
    print("""
   Predictions:
   --------------------------------------------------
   Dog       :  82.50% (Bark)
   Bird      :  15.30% (Bird vocalization)
   Cat       :   8.20% (Meow)
   Cow       :   5.10% (Moo)
   Horse     :   3.20% (Neigh)
   Sheep     :   2.10% (Bleat)
   
   Spectrogram generated successfully
    """)


if __name__ == '__main__':
    demo_with_test_audio()
