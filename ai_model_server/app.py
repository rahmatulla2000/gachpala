"""
Fruit Tree AI Model Inference Server (FastAPI + Gradio UI)
Supports: MobileNetV3Large_FruitTree_92.67.keras
Compatible with: Hugging Face Spaces (Gradio SDK), Local Dev, and Render/Docker
"""

import sys
import os
import io
import json
import glob
from typing import Optional
import numpy as np
from PIL import Image

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import gradio as gr
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf

app = FastAPI(
    title="Fruit Tree Detection AI Server",
    description="Inference API for MobileNetV3 Fruit Tree Classifier",
    version="1.0.0"
)

# Enable CORS for Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLASSES_FILE = os.path.join(BASE_DIR, "classes.json")
DEFAULT_MODEL_NAME = "MobileNetV3Large_FruitTree_92.67.keras"
INPUT_SIZE = (224, 224)

model = None
model_name = None
classes = []

def load_classes():
    global classes
    if os.path.exists(CLASSES_FILE):
        with open(CLASSES_FILE, "r", encoding="utf-8") as f:
            classes = json.load(f)
        print(f"Loaded {len(classes)} classes from {CLASSES_FILE}")
    else:
        print(f"Warning: {CLASSES_FILE} not found!")

def find_model_path() -> Optional[str]:
    env_path = os.environ.get("MODEL_PATH")
    if env_path and os.path.exists(env_path):
        return env_path
    default_path = os.path.join(BASE_DIR, DEFAULT_MODEL_NAME)
    if os.path.exists(default_path):
        return default_path
    candidates = glob.glob(os.path.join(BASE_DIR, "*.keras")) + glob.glob(os.path.join(BASE_DIR, "*.h5"))
    if candidates:
        return candidates[0]
    return None

def load_ai_model():
    global model, model_name
    path = find_model_path()
    if path:
        print(f"Loading Keras model from: {path} ...")
        try:
            model = tf.keras.models.load_model(path)
            model_name = os.path.basename(path)
            # Warm up
            dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
            _ = model(dummy, training=False)
            print(f"Model loaded and warmed up: {model_name}")
        except Exception as e:
            print(f"Error loading model: {e}")
            model = None
    else:
        print(f"Model file not found in {BASE_DIR}")

# Load immediately
load_classes()
load_ai_model()

@app.get("/health")
def health():
    return {
        "status": "ok" if model is not None else "model_missing",
        "model_loaded": model is not None,
        "model_name": model_name
    }

def preprocess_pil_image(image: Image.Image) -> np.ndarray:
    img = image.convert("RGB").resize(INPUT_SIZE, Image.Resampling.BILINEAR)
    img_array = np.array(img, dtype=np.float32)
    processed = tf.keras.applications.mobilenet_v3.preprocess_input(img_array)
    return np.expand_dims(processed, axis=0)

def classify_tensor(tensor: np.ndarray):
    raw_preds = model(tensor, training=False)[0].numpy()
    is_probabilities = np.isclose(float(np.sum(raw_preds)), 1.0, atol=1e-2) and np.all(raw_preds >= 0.0)
    probs = raw_preds if is_probabilities else tf.nn.softmax(raw_preds).numpy()
    top_indices = np.argsort(probs)[::-1][:3]
    results = []

    for idx in top_indices:
        conf = float(probs[idx])
        class_info = classes[idx] if idx < len(classes) else {"englishName": f"Class {idx}"}
        results.append({
            "className": class_info.get("folder", f"Class_{idx}"),
            "banglaName": class_info.get("banglaName", ""),
            "englishName": class_info.get("englishName", ""),
            "scientificName": class_info.get("scientificName", ""),
            "family": class_info.get("family", ""),
            "genus": class_info.get("genus", ""),
            "confidence": round(conf, 4)
        })
    return results

# 1. API Endpoint for Next.js App
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="AI model is not loaded.")
    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        tensor = preprocess_pil_image(image)
        results = classify_tensor(tensor)
        return {"success": True, "predictions": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

# 2. Function for Gradio Interactive UI
def gradio_predict(img):
    if img is None:
        return "Please upload an image"
    if model is None:
        return "AI model is not loaded"
    tensor = preprocess_pil_image(img)
    results = classify_tensor(tensor)
    confidences = {}
    for r in results:
        label = f"{r.get('banglaName', '')} ({r.get('englishName', '')})"
        confidences[label] = r["confidence"]
    return confidences

# Gradio interface definition
demo = gr.Interface(
    fn=gradio_predict,
    inputs=gr.Image(type="pil", label="Upload Leaf/Fruit Image"),
    outputs=gr.Label(num_top_classes=3, label="Top Predictions"),
    title="🌿 গাছপালা - Fruit Tree Classifier",
    description="MobileNetV3 Model (FastAPI + Gradio) for Tree Identification."
)

# Mount Gradio UI on root
app = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    # Hugging Face Spaces uses port 7860, default local fallback to 5000 or PORT env
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
