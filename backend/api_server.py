"""
Flask API Server for Animal Sound Classification
Provides REST endpoints for audio processing and prediction
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
from yamnet_inference import YAMNetAnimalClassifier

app = Flask(__name__)
CORS(app)

# Initialize classifier (lazy loading)
classifier = None

def get_classifier():
    """Lazy load the classifier"""
    global classifier
    if classifier is None:
        classifier = YAMNetAnimalClassifier()
    return classifier


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Server is running'})


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict animal sounds from uploaded audio file
    
    Request:
        - file: Audio file (multipart/form-data)
        
    Response:
        - predictions: Dictionary of animal predictions with confidence
        - spectrogram: Base64 encoded spectrogram image
        - audio_length: Duration of audio in seconds
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name
        
        try:
            # Get classifier and process audio
            clf = get_classifier()
            results = clf.process_audio(temp_path)
            
            return jsonify(results), 200
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/classes', methods=['GET'])
def get_classes():
    """Get supported animal classes"""
    return jsonify({
        'classes': list(YAMNetAnimalClassifier.ANIMAL_CLASSES.keys())
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
