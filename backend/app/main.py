from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pickle
from app.preprocessing.preprocessingPipeline import preprocessDoodle
from app.prediction.predict import predict

app = Flask(__name__)


model = tf.keras.models.load_model("app\models\doodle_classifier.keras", compile=False)
with open("app\models\label_encoder.pkl", 'rb') as f:
    le = pickle.load(f)

@app.route('/', methods=['GET'])
def home():
    return "Backend is running! Please use POST /predict to send drawings.", 200

@app.route('/predict', methods=['POST'])
def predict_route():
    data = request.get_json()

    rawStrokes = data['rawStrokes'] 

    try:
        padded = preprocessDoodle(rawStrokes)  
        prediction = predict(padded, model, le)  
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
