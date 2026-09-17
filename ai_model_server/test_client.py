"""
Quick CLI tester for the AI Model Server
Usage: python test_client.py <path_to_image_file>
"""
import sys
import os
import requests

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

SERVER_URL = "http://127.0.0.1:5000/predict"


def main():
    if len(sys.argv) < 2:
        print("Usage: python test_client.py <path_to_image>")
        print("Example: python test_client.py sample_mango.jpg")
        return

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(f"Error: File '{image_path}' not found.")
        return

    print(f"Uploading '{image_path}' to {SERVER_URL} ...")
    try:
        with open(image_path, "rb") as f:
            files = {"file": (os.path.basename(image_path), f, "image/jpeg")}
            res = requests.post(SERVER_URL, files=files, timeout=10)

        print("\nStatus Code:", res.status_code)
        print("Response JSON:")
        import json
        print(json.dumps(res.json(), indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"Failed to connect to server: {e}")

if __name__ == "__main__":
    main()
