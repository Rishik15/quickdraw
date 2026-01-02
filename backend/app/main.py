from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import pickle
from app.preprocessing.preprocessingPipeline import preprocessDoodle
from app.prediction.predict import predict

app = Flask(__name__)
app.debug = True  # Enable debug mode
CORS(app)

# Redirect stderr to stdout
import sys
sys.stderr = sys.stdout

model = tf.keras.models.load_model("app/models/doodle_classifier.keras", compile=False)
with open("app/models/label_encoder.pkl", 'rb') as f:
    le = pickle.load(f)

@app.route('/', methods=['GET'])
def home():
    return "Backend is running! Please use POST /predict to send drawings.", 200

@app.route('/predict', methods=['POST'])
def predict_route():
    print("\n=== NEW PREDICTION REQUEST ===")
    print("Raw request data:", request.data)
    data = request.get_json()
    print("Parsed JSON data:", data)

    if 'rawStrokes' not in data:
        print("Error: No rawStrokes in request data")
        return jsonify({'error': 'No rawStrokes data provided'}), 400

    rawStrokes = data['rawStrokes']
    exclude = data.get('exclude', []) # Get the list of excluded guesses

    try:
        if not rawStrokes or not isinstance(rawStrokes, list):
            return jsonify({'error': 'Invalid strokes data'}), 400

        print("Received raw strokes:", rawStrokes)
        print("Number of strokes:", len(rawStrokes))
        
        # Transform strokes data from [{points:[{x,y}]}] to [[x[],y[]]]
        drawing = []
        for stroke in rawStrokes:
            xs = []
            ys = []
            for point in stroke['points']:
                xs.append(point['x'])
                ys.append(point['y'])
            drawing.append([xs, ys])
        
        print("Transformed drawing:", drawing)    
        padded = preprocessDoodle(drawing)
        print("Preprocessed data shape:", np.array(padded).shape)
        print("Preprocessed data sample:", padded[:5] if padded else "Empty padded data")
        
        if not padded:
            return jsonify({'error': 'Failed to preprocess drawing'}), 400
            
        prediction = predict(padded, model, le, exclude=exclude) # Pass excluded guesses to predict
        print("Prediction result:", prediction)
        
        if not isinstance(prediction, np.ndarray):
            return jsonify({'error': 'Invalid prediction result'}), 500
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
