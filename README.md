# Chat App - Frontend

A real-time chat application built with React Native and Expo, featuring user authentication and instant messaging capabilities.

## 📱 About

This is the frontend for a comprehensive chat application that enables users to communicate in real-time. The app is built with modern technologies including Expo, React Native, and TypeScript for a seamless cross-platform experience on iOS, Android, and web.

## ✨ Features

- **User Authentication**: Secure login and registration with session management.
- **Real-time Messaging**: Send and receive messages instantly via Socket.io.
- **Modern UI/UX**: Clean design using custom components and theme system.
- **File-based Routing**: Easy navigation powered by Expo Router.
- **State Management**: Authentication state handled via React Context.
- **Cross-platform**: Optimized for iOS, Android, and Web.

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based)
- **HTTP Client**: Axios for API communication
- **Authentication**: JWT with `jwt-decode`
- **Storage**: `AsyncStorage` for local persistence
- **Icons**: `phosphor-react-native` and `Expo Vector Icons`
- **Animations**: `react-native-reanimated`

## 📂 Project Structure

- `app/`: Application screens and routing logic (`(auth)`, `(main)`).
- `components/`: Reusable UI components (Button, Input, ScreenWrapper, etc.).
- `context/`: React Context providers (e.g., AuthContext).
- `services/`: API service layers (e.g., authService).
- `constants/`: App constants and theme definitions.
- `hooks/`: Custom React hooks.
- `utils/`: Helper functions and styling utilities.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app (on mobile) or Android/iOS emulator

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the App

```bash
npx expo start
```

### 3. Open the App

- Scan the QR code with **Expo Go** (Android) or **Camera App** (iOS).
- Press `a` for Android emulator.
- Press `i` for iOS simulator.
- Press `w` for Web.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
# whats-app-chat-app-frontend
# whats-app-chat-app-frontend
# whats-app-chat-app-frontend
