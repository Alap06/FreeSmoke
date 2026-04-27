# 🚭 FreeSmoke

**FreeSmoke** is a gamified, AI-powered React Native mobile application designed to help users quit smoking. By tracking progress, providing an interactive AI Coach, and offering engaging mini-games to distract from cravings, FreeSmoke turns the difficult journey of quitting into a rewarding and interactive experience.

---

## ✨ Key Features

- **📊 Progress Tracking**: Monitor your smoke-free days, money saved, and health improvements in real-time.
- **🤖 AI Coach (Powered by Groq)**: Get personalized advice, motivation, and coping strategies instantly via a seamless conversational interface.
- **🆘 SOS Panic Button**: Immediate distraction and emergency motivation for when cravings peak.
- **🎮 Distraction Mini-Games**: Three engaging games specifically designed to occupy your hands and mind during strong cravings:
  - **Sniper Focus**: Test your precision and timing.
  - **Lung Breather**: A rhythmic breathing game to calm the nervous system.
  - **Focus Mode**: A concentration game to redirect mental energy.
- **🏅 Gamification & Badges**: Unlock achievements and badges as you hit milestones in your smoke-free journey.
- **📓 Smoke Journal**: Log relapses or cravings to identify triggers and patterns.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.81.5)
- **Environment**: [Expo SDK 54](https://expo.dev/) (Managed/Development Build)
- **Navigation**: [React Navigation v7](https://reactnavigation.org/) (Bottom Tabs & Stack)
- **AI Integration**: [Groq SDK](https://groq.com/) for high-speed LLM inference.
- **Animations & Graphics**: [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native) & [React Native SVG](https://github.com/software-mansion/react-native-svg).
- **Storage**: AsyncStorage for local offline data persistence.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An Android Emulator, iOS Simulator, or a physical device.

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Alap06/FreeSmoke.git
cd FreeSmoke
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory and add your Groq API key and local API URL:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

### 3. Running the Application

Since this project utilizes native modules (like `expo-notifications`), it requires an Expo Development Build.

**For Android:**
```bash
npx expo run:android
```

**For iOS:**
```bash
npx expo run:ios
```

> **Note**: Standard Expo Go is not fully supported due to the use of custom native Push Notifications and TurboModules.

---

## 📁 Project Structure

```
freesmoke/
├── src/
│   ├── context/       # Global State Management (Theme, User State)
│   ├── navigation/    # React Navigation setup (Stack, Tabs)
│   ├── screens/       # Application Screens
│   │   ├── games/     # Distraction Mini-Games
│   │   └── ...
│   └── ...
├── App.tsx            # Application entry wrapper
├── index.js           # Expo Root Component registration
└── ...
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Alap06/FreeSmoke/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
