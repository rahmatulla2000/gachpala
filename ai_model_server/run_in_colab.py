"""
Google Colab Deployment Script
Use this script if you want to run your MobileNetV3 model in Google Colab
and connect it directly to your Next.js application via ngrok.

INSTRUCTIONS FOR COLAB:
1. Open Google Colab (https://colab.research.google.com/)
2. Upload your 'MobileNetV3Large_FruitTree_92.67.keras' file into Colab
3. Run the cells below!
"""

# Cell 1: Install dependencies
# !pip install fastapi uvicorn pyngrok python-multipart pillow tensorflow

import os
import io
import json
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import threading
import tensorflow as tf

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASSES = [
  {"id": 0, "folder": "আম_Mango", "banglaName": "আম", "englishName": "Mango", "scientificName": "Mangifera indica"},
  {"id": 1, "folder": "আমড়া_Hog plum", "banglaName": "আমড়া", "englishName": "Hog plum", "scientificName": "Spondias mombin"},
  {"id": 2, "folder": "কাঁঠাল_Jackfruit", "banglaName": "কাঁঠাল", "englishName": "Jackfruit", "scientificName": "Artocarpus heterophyllus"},
  {"id": 3, "folder": "কামরাঙ্গা_Star fruit", "banglaName": "কামরাঙ্গা", "englishName": "Star fruit", "scientificName": "Averrhoa carambola"},
  {"id": 4, "folder": "কুল_Indian jujube", "banglaName": "কুল", "englishName": "Indian jujube", "scientificName": "Ziziphus mauritiana"},
  {"id": 5, "folder": "জলপাই_Indian olive", "banglaName": "জলপাই", "englishName": "Indian olive", "scientificName": "Elaeocarpus serratus"},
  {"id": 6, "folder": "জাম_Java plum", "banglaName": "জাম", "englishName": "Java plum", "scientificName": "Syzygium cumini"},
  {"id": 7, "folder": "তেঁতুল_Tamarind", "banglaName": "তেঁতুল", "englishName": "Tamarind", "scientificName": "Tamarindus indica"},
  {"id": 8, "folder": "নারিকেল_Coconut", "banglaName": "নারিকেল", "englishName": "Coconut", "scientificName": "Cocos nucifera"},
  {"id": 9, "folder": "পেঁপে_Papaya", "banglaName": "পেঁপে", "englishName": "Papaya", "scientificName": "Carica papaya"},
  {"id": 10, "folder": "পেয়ারা_Guava", "banglaName": "পেয়ারা", "englishName": "Guava", "scientificName": "Psidium guajava"},
  {"id": 11, "folder": "বেল_Bael", "banglaName": "বেল", "englishName": "Bael", "scientificName": "Aegle marmelos"},
  {"id": 12, "folder": "লিচু_Lychee", "banglaName": "লিচু", "englishName": "Lychee", "scientificName": "Litchi chinensis"},
  {"id": 13, "folder": "লেবু_Lemon", "banglaName": "লেবু", "englishName": "Lemon", "scientificName": "Citrus limon"},
  {"id": 14, "folder": "সফেদা_Sapodilla", "banglaName": "সফেদা", "englishName": "Sapodilla", "scientificName": "Manilkara zapota"}
]

MODEL_PATH = "MobileNetV3Large_FruitTree_92.67.keras"
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully in Colab!")

@app.get("/")
def home():
    return {"status": "Colab Fruit Tree AI is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    content = await file.read()
    image = Image.open(io.BytesIO(content)).convert("RGB").resize((224, 224))
    img_array = np.array(image, dtype=np.float32)
    processed = tf.keras.applications.mobilenet_v3.preprocess_input(img_array)
    tensor = np.expand_dims(processed, axis=0)

    raw_preds = model(tensor, training=False)[0].numpy()
    is_probabilities = np.isclose(float(np.sum(raw_preds)), 1.0, atol=1e-2) and np.all(raw_preds >= 0.0)
    probs = raw_preds if is_probabilities else tf.nn.softmax(raw_preds).numpy()

    top_indices = np.argsort(probs)[::-1][:3]
    results = []

    for idx in top_indices:
        conf = float(probs[idx])
        c = CLASSES[idx]
        results.append({
            "className": c["folder"],
            "banglaName": c["banglaName"],
            "englishName": c["englishName"],
            "scientificName": c["scientificName"],
            "confidence": round(conf, 4)
        })

    return {"success": True, "predictions": results}

# Cell 2: Start server with ngrok
# from pyngrok import ngrok
# ngrok.set_auth_token("YOUR_NGROK_AUTHTOKEN")
# public_url = ngrok.connect(5000).public_url
# print("Copy this URL into .env.local as CUSTOM_AI_URL:")
# print(f"{public_url}/predict")
# uvicorn.run(app, host="0.0.0.0", port=5000)
