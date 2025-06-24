# 👁️ Vision-Assistant: AI-Powered Voice & Vision Companion for the Visually Impaired

**Vision-Assistant** is an intelligent, voice-activated companion designed to assist blind and visually impaired individuals in navigating their surroundings, identifying objects, and performing everyday tasks using a combination of real-time computer vision and conversational AI powered by **Claude API** from Anthropic.

---

## 🔍 Overview

Vision-Assistant serves as a *digital eye and smart assistant* that helps users move around their homes, understand their environment, and receive spoken assistance for tasks like cooking or locating items. It brings together state-of-the-art object detection, indoor navigation, and natural voice conversation to promote greater independence and accessibility.

---

## 🧠 Features

### 🏠 Smart Indoor Navigation
- First-time environment scanning and mapping via mobile or wearable camera
- Understand spatial layout (kitchen, bathroom, hallway, etc.)
- Voice commands like:  
  > “Take me to the bathroom”  
  > “Guide me to the fridge”  
- Turn-by-turn voice guidance to reach destination safely

### 🧾 Real-Time Object Recognition
- Detects and announces obstacles and objects in front of the user
- Uses computer vision (YOLOv8 + OpenCV) to identify surroundings
- Sample responses:  
  > “There’s a chair two feet ahead.”  
  > “Microwave is to your right.”

### 🗣️ Conversational Voice Interface (Claude API)
- Natural and safe voice interaction using Anthropic’s Claude API
- Understands context and user needs
- Example queries:  
  > “What’s in front of me?”  
  > “Help me find my phone.”  
  > “What can I cook with these ingredients?”

### 🍳 Task Guidance & Context Awareness
- Recognizes ingredients and suggests recipes in the kitchen
- Provides step-by-step help for tasks like making tea or brushing teeth
- Contextually aware of location and objects

---

## ⚙️ Tech Stack

| Component             | Technology                              |
|----------------------|------------------------------------------|
| Object Detection      | YOLOv8, OpenCV                          |
| Speech Recognition    | Whisper / Google Speech-to-Text        |
| Text-to-Speech        | gTTS, pyttsx3, or Google TTS            |
| NLP & Reasoning       | Claude API (Anthropic)                 |
| Mapping & Navigation  | ORB-SLAM2 / RTAB-Map                   |
| Platform              | Python backend, optional Android app   |

---




"Where is the soap?"

🤝 Contributing
Contributions, feedback, and new feature ideas are welcome! Feel free to fork the repo, open issues, or submit pull requests.
