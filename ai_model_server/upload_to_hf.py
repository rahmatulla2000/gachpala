"""
Hugging Face Space Automatic Uploader for rahmot2000/fruit-tree-ai-api
"""
import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

try:
    from huggingface_hub import HfApi
except ImportError:
    print("Error: huggingface_hub not installed. Run: pip install huggingface_hub")
    sys.exit(1)

# Set token here or pass as argument
HF_TOKEN = sys.argv[1] if len(sys.argv) > 1 else ""
REPO_ID = sys.argv[2] if len(sys.argv) > 2 else "rahmot2000/knows-about-tree"

def upload():
    if not HF_TOKEN or not HF_TOKEN.startswith("hf_"):
        print("[ERROR] Valid Hugging Face Access Token required!")
        print("Usage: python upload_to_hf.py hf_YOUR_TOKEN_HERE [REPO_ID]")
        print("Example: python upload_to_hf.py hf_YOUR_TOKEN_HERE rahmot2000/knows-about-tree")
        return

    api = HfApi(token=HF_TOKEN)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    print(f"Updating Hugging Face Space: {REPO_ID}...")
    
    # 1. Update README.md to switch SDK from static to gradio
    readme_content = """---
title: Fruit Tree Ai Api
emoji: 🌿
colorFrom: pink
colorTo: green
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: apache-2.0
---

# 🌳 Fruit Tree AI Model API
Running MobileNetV3Large Fruit Tree Classifier.
"""
    api.upload_file(
        path_or_fileobj=readme_content.encode("utf-8"),
        path_in_repo="README.md",
        repo_id=REPO_ID,
        repo_type="space",
        commit_message="Switch Space SDK to Gradio"
    )
    print("[OK] 1. README.md updated (SDK changed to Gradio)")

    # 2. Upload model file
    model_path = os.path.join(base_dir, "MobileNetV3Large_FruitTree_92.67.keras")
    if os.path.exists(model_path):
        print(f"[UPLOADING] 2. Uploading model file: {os.path.basename(model_path)} (~17 MB)...")
        api.upload_file(
            path_or_fileobj=model_path,
            path_in_repo="MobileNetV3Large_FruitTree_92.67.keras",
            repo_id=REPO_ID,
            repo_type="space",
            commit_message="Upload MobileNetV3 Fruit Tree Keras model"
        )
        print("[OK] 2. Model file uploaded successfully!")
    else:
        print(f"[ERROR] Model file not found at: {model_path}")

    # 3. Upload requirements.txt with lightweight tensorflow-cpu
    req_content = """fastapi>=0.100.0
uvicorn>=0.22.0
python-multipart>=0.0.6
tensorflow-cpu>=2.14.0
numpy>=1.23.0
pillow>=9.5.0
gradio>=4.0.0
"""
    api.upload_file(
        path_or_fileobj=req_content.encode("utf-8"),
        path_in_repo="requirements.txt",
        repo_id=REPO_ID,
        repo_type="space",
        commit_message="Update requirements.txt with tensorflow-cpu for fast build"
    )
    print("[OK] 3. requirements.txt updated with fast build config")

    print("\n[SUCCESS] ALL DONE! Your Hugging Face Space is now building and will be RUNNING in ~1 minute!")
    print(f"Live Space: https://huggingface.co/spaces/{REPO_ID}")
    print(f"Your API URL: https://rahmot2000-fruit-tree-ai-api.hf.space/predict\n")

if __name__ == "__main__":
    upload()
