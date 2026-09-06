<div align="center">

<img src="https://lh3.googleusercontent.com/pw/AP1GczNivuDTs5cjL1ZYMbhwmJbVE1n7WDzAVGMKd_79ddlvjRVAlKLw9RHBbavicyMG6W85ws2YONiAj4MT-DOr-XlU-HzfdCU7qZNbRxuzMpA9AVrcXg=s400" alt="ChatApp Logo" width="120">

# 💬 ChatApp

**A mobile chat application built with React Native and Expo.**

![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

</div>

---

## 📸 Preview

<p align="center">
  <img src="https://lh3.googleusercontent.com/pw/AP1GczNliXr5PJCwyaDXeP6iVytDtZxcVCskQmICBjIgCSryrSI0YjxWXi_8StAo7OHnTsIc978xew2TfWllo6zpB7dzCFeRs-rgXZrb51Inh64ZYGCYBw=w600-h315-p-k" alt="ChatApp screens — Profile Settings, Chat, and New Conversation" width="100%">
</p>

---

## ✨ Features

- 💬 Real-time messaging with a clean, mobile-first chat UI
- 👤 Profile settings — display name, bio, and avatar
- 🔎 New conversation screen with searchable contact list
- 🟢 Online/offline presence indicators
- 🔐 Firebase Authentication for secure sign-in
- 🗄️ Firestore for real-time data sync
- 📁 Firebase Storage for media/file uploads
- 📱 Cross-platform — runs natively on both **Android** and **iOS**
- 🚀 Android build distributed via Expo EAS

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native, Expo |
| Navigation | Expo Router |
| Language | TypeScript / JavaScript |
| Backend | Firebase Authentication, Firestore, Firebase Storage |
| Build & Distribution | Expo EAS |
| Platform | Android, iOS |

---

## 📦 APK / Build

The Android APK has been built and is hosted through Expo EAS.

**[⬇️ Download APK / View EAS Build](https://expo.dev/accounts/amaadali/projects/ChatApp/builds/c9f53ff4-3fbc-498a-ba69-cb209f6f7716)**

> Note: The APK build is hosted through Expo EAS — no separate release page is needed.

---

## 🛠️ Installation

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/eas/) (for building APKs)

### Clone the repository

```bash
git clone https://github.com/amaadalidev/chat-app.git
cd chat-app
```

### Install dependencies

```bash
npm install
# or
yarn install
```

### Run the app

```bash
npx expo start
```

Then scan the QR code with the **Expo Go** app on your device, or run it on an emulator:

```bash
npx expo start --android
# or
npx expo start --ios
```

### Build an Android APK

```bash
eas build -p android --profile preview
```

---

## 📁 Project Structure

```
ChatApp/
├── app/              # Screens & navigation (Expo Router)
├── components/       # Reusable UI components
├── assets/           # Images, icons, fonts
├── screenshots/       # README preview images
└── app.json          # Expo configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

---

## 📬 Contact

**Amaad Ali** — [LinkedIn](https://www.linkedin.com/in/amaad-ali-77217b207) · [Fiverr](https://www.fiverr.com/users/amaad_ali) · [amaadali.inbox@gmail.com](mailto:amaadali.inbox@gmail.com)
