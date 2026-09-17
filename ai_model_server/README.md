# 🌳 Fruit Tree AI Model Integration Guide
Model: **`MobileNetV3Large_FruitTree_92.67.keras`**

এই ফোল্ডারে আপনার ফলের গাছের ডিপ লার্নিং মডেলটি Next.js ওয়েবসাইটের সাথে যুক্ত করার সব ফাইল তৈরি করা হয়েছে।

---

## 📋 ক্লাসের তালিকা (15 Fruit Tree Classes)
1. `আম_Mango` (Mangifera indica)
2. `আমড়া_Hog plum` (Spondias mombin)
3. `কাঁঠাল_Jackfruit` (Artocarpus heterophyllus)
4. `কামরাঙ্গা_Star fruit` (Averrhoa carambola)
5. `কুল_Indian jujube` (Ziziphus mauritiana)
6. `জলপাই_Indian olive` (Elaeocarpus serratus)
7. `জাম_Java plum` (Syzygium cumini)
8. `তেঁতুল_Tamarind` (Tamarindus indica)
9. `নারিকেল_Coconut` (Cocos nucifera)
10. `পেঁপে_Papaya` (Carica papaya)
11. `পেয়ারা_Guava` (Psidium guajava)
12. `বেল_Bael` (Aegle marmelos)
13. `লিচু_Lychee` (Litchi chinensis)
14. `লেবু_Lemon` (Citrus limon)
15. `সফেদা_Sapodilla` (Manilkara zapota)

---

## 🚀 অপশন ১: লোকাল পিসিতে চালানো (Local Setup)

### ধাপ ১: মডেল ফাইলটি এখানে রাখুন
আপনার `MobileNetV3Large_FruitTree_92.67.keras` ফাইলটি এই `ai_model_server/` ফোল্ডারে কপি করে রাখুন।

### ধাপ ২: প্রয়োজনীয় লাইব্রেরি ইনস্টল করুন
একটি নতুন টার্মিনাল খুলে এই ফোল্ডারে গিয়ে কমান্ড দিন:
```bash
cd ai_model_server
pip install -r requirements.txt
```

### ধাপ ৩: পাইথন সার্ভারটি চালু করুন
```bash
python app.py
```
সার্ভারটি `http://127.0.0.1:5000` এ রান হবে।

### ধাপ ৪: Next.js `.env.local` কনফিগার করুন
প্রজেক্টের রুট ডিরেক্টরিতে `.env.local` ফাইলে নিচের লাইনগুলো সেট করুন:
```env
AI_PROVIDER="custom"
CUSTOM_AI_URL="http://127.0.0.1:5000/predict"
```

ব্যাস! এখন ওয়েবসাইটে গিয়ে কোনো ফলের গাছের ছবি আপলোড করলে সরাসরি আপনার মডেল প্রেডিক্ট করবে এবং ডাটাবেজ থেকে ম্যাচ করে তথ্য দেখাবে!

---

## 🌐 অপশন ২: সরাসরি Google Colab থেকে চালানো (Free GPU / No Local Setup)
আপনার কম্পিউটারে পাইথন বা টেনসরফ্লো ইনস্টল না থাকলে Colab দিয়েও চালাতে পারবেন:

1. গুগল কোলাবে একটি নতুন নোটবুক খুলুন।
2. `ai_model_server/run_in_colab.py` এর কোডগুলো পেস্ট করুন এবং আপনার `MobileNetV3Large_FruitTree_92.67.keras` ফাইলটি কোলাবে আপলোড করুন।
3. সেলগুলো রান করলে একটি পাবলিক ngrok URL পাবেন (যেমন `https://xxxx.ngrok-free.app/predict`)।
4. `.env.local` ফাইলে বসিয়ে দিন:
   ```env
   AI_PROVIDER="custom"
   CUSTOM_AI_URL="https://xxxx.ngrok-free.app/predict"
   ```
