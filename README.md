# 🌱 SOPHIE.ai : Vocab Master

> **Your hands-free learning universe, designed for total focus.**

SOPHIE (which stands for "Seed" in its conceptual origin) is a high-performance language immersion web application. Designed for students and professionals who want to turn commute time, walking, or resting into productive learning, SOPHIE leverages cutting-edge AI to generate context-aware vocabulary and delivers it through a premium, hands-free audio loop.

**[🚀 Live Demo (Deployed on Vercel)](https://sophie-vocab-master.vercel.app/)**

---

## ✨ Key Features

* **🧠 Context-Aware AI Generation:** Powered by **Google Gemini 2.5 Flash**, it doesn't just translate; it understands the context (Work, Travel, Exam) and generates natural, real-life examples.
* **🎙️ Premium Neuro-Learning Audio:** Integrates with the **ElevenLabs API** to provide highly realistic, multi-lingual voices that facilitate retention.
* **🎧 Hands-Free Mode (Echo Rhythm):** An automated sequential playback system designed for deep memorization without looking at the screen: 
    * *Target Language -> Native Translation -> Mental Pause -> Contextual Example.*
* **🔒 Secure Serverless Architecture:** API keys are protected in a secure Vercel Vault, accessed strictly via backend Serverless Functions (`/api`), ensuring client-side safety.
* **🌙 Dark-Mode UI/UX:** A clean, distraction-free interface inspired by modern productivity tools.

---

## 🛠️ Tech Stack

* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
* **Backend / Cloud:** Vercel Serverless Functions (Node.js).
* **APIs:** * `generativelanguage.googleapis.com` (Gemini AI).
    * `api.elevenlabs.io` (Premium TTS).
* **Deployment:** CI/CD via Vercel (GitHub integration).

---

## 🚀 How it Works (Under the Hood)

1. The user inputs raw text or notes.
2. The frontend sends a secure `POST` request to the `/api/gemini` serverless function.
3. The Vercel backend injects the hidden `GEMINI_API_KEY` and prompts the AI to generate structured JSON flashcards.
4. The user clicks "Play", triggering calls to the `/api/elevenlabs` function.
5. The backend safely signs the request with the `ELEVENLABS_API_KEY` and streams the `.mp3` buffer back to the client.
6. The frontend orchestrates the timing, delays, and visual auto-scrolling for a perfect hands-free experience.

---

*Built with passion and focus on real-world language mastery.*
