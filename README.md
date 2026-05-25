# Photo App Prototype (Expo + TypeScript + Zustand + Firebase + Stripe)

Welcome to the **Photo App Prototype**! This is a modern, premium, and highly responsive mobile photo-sharing application prototype built on top of **React Native** and **Expo SDK 54**.

All key development milestones have been fully implemented: the application is completely integrated with **Firebase (Auth & Firestore)**, global state management is handled elegantly via **Zustand**, a beautiful and reactive user interface is styled using **NativeWind (Tailwind CSS)**, a smart interactive **AI Assistant** has been deployed, and a complete subscription/billing model is powered by **Stripe Payment Sheet**.

---

## Key Features

This prototype includes the following fully-working and integrated modules:

### 1. Complete Authentication Flow (Firebase Auth)
*   **Sign In (`Login`) & Sign Up (`Register`)**: Modern landing screen, real-time input validations, and integration with Firebase Authentication.
*   **Step-by-Step Registration**: Split into two user-friendly steps (email/password setup + username and display name customization).
*   **Global Auth State (`useAuthStore`)**: Manages the authenticated user's session, automatically restores sessions on app restart, and includes a functional log-out flow.

### 2. Dynamic Discover Feed (Firestore)
*   **Masonry Grid Layout**: A gorgeous asynchronous photo grid with variable heights for a premium, Pinterest-style experience.
*   **Firestore Integration & Pagination**: Real-time content fetching with cursor-based pagination (`startAfter`) via a custom **"See more"** button.
*   **Pull-to-Refresh**: Seamless gesture-based refresh (`RefreshControl`) to reload the home feed instantly.
*   **Full-Screen Viewer**: Clicking any post opens a beautiful full-screen modal showing the image, author details, and associated tags.

### 3. Post Creation & Optimization (Base64 + ImagePicker)
*   **Native Photo Library**: Select images from your device using `expo-image-picker` with native permissions.
*   **Aggressive Compression & Cropping**: Selected photos are forced into square aspect ratio (`aspect: [1, 1]`) and optimized with `quality: 0.3`. This massively reduces the file size (usually under 50-100 KB), making them perfect for free-tier Firestore storage (1MB document limit).
*   **Base64 Encoding**: Local URIs are converted into a Data URL scheme using `expo-file-system`, ensuring instant offline rendering and successful cloud storage.
*   **Smart Tagging**: Comma-separated tags are parsed, cleaned, and stored in the database.

### 4. Interactive User Profile
*   **Author's Personal Gallery**: Displays exclusively the photos uploaded by the currently authenticated user, fetched dynamically using Firestore queries (`where('userId', '==', uid)`).
*   **Account Settings**: Displays the logged-in user's name, email, and features a functional sign-out button.

### 5. Interactive Chat Rooms
*   **Conversations List**: Displays active dialogs with avatars, user names, and previews of the latest messages.
*   **Chat View**: Fully functional interactive messaging screen with instant, real-time message updates.

### 6. Tag-Based Search
*   **Instant Search**: Filter all discover posts in real time using keywords or specific hashtags via the search bar.

### 7. Smart AI Assistant Chat (`ai-chat.tsx`)
*   **Specialized Agents**: Engage in chat with custom AI assistants (e.g., General AI, Photo Coach).
*   **Real-time Response Streaming**: Features a beautiful typewriter streaming effect as messages are generated, mimicking a live conversation.
*   **State Management (`useAIChatStore`)**: Chat history is synchronized and loaded dynamically in real time.

### 8. Stripe Paywall & Subscriptions (`paywall.tsx`)
*   **Three Tiered Plans**: 
    *   *Free Starter* ($0) — Up to 5 AI messages per day, basic filters.
    *   *Photo Enthusiast* ($4.99 / mo) — Unlimited AI Assistant and access to Photo Coach.
    *   *Pro Studio* ($14.99 / mo) — All features of Enthusiast + 4K Rendering support.
*   **Stripe Payment Sheet**: Secure checkout and checkout processing backed by Stripe. Payments are handled via a local serverless endpoint at `app/api/stripe+api.ts`.
*   **Subscription Synchronization**: Persisted globally via Zustand (`useSubscriptionStore`) and cached locally in `AsyncStorage`.

---

## Tech Stack

*   **Core:** React Native & Expo SDK 54
*   **Routing:** Expo Router v6 (file-based navigation supporting tabs, stacks, and modal paths)
*   **Database & Auth:** Firebase SDK v10 (Authentication & Cloud Firestore)
*   **Payments:** Stripe SDK (`@stripe/stripe-react-native`)
*   **State Management:** Zustand (lightweight, reactive global stores with `AsyncStorage` persistence)
*   **Styling:** NativeWind (Tailwind CSS v3 for React Native) + custom styles for micro-animations
*   **Media Processing:** Expo Image Picker, Expo File System
*   **Type Safety:** TypeScript (fully configured in strict mode)

---

## Project Architecture

```
photo-app-prototype/
├── app/                        # Screens and routing (Expo Router)
│   ├── (auth)/                 # Auth & Welcome screens
│   │   ├── index.tsx           # Entry welcome screen
│   │   ├── login.tsx           # Sign-in page
│   │   ├── register.tsx        # Registration (Step 1)
│   │   └── register-step-2.tsx # Registration (Step 2)
│   ├── (tabs)/                 # Main Navigation Tab Bar
│   │   ├── index.tsx           # Discover Screen (Masonry Grid)
│   │   ├── search.tsx          # Tag search interface
│   │   ├── create.tsx          # Post creation screen (image picker & tags)
│   │   ├── chart.tsx           # List of active chat rooms
│   │   └── profile.tsx         # User Profile & Log Out
│   ├── api/                    # Serverless API routes
│   │   └── stripe+api.ts       # Backend integration endpoint for Stripe
│   ├── chat/
│   │   └── [id].tsx            # Dedicated interactive chat screen
│   ├── ai-chat.tsx             # Interactive AI Assistant Chat screen
│   ├── paywall.tsx             # Stripe Subscriptions & Paywall screen
│   ├── +not-found.tsx          # 404 fallback page
│   └── _layout.tsx             # Root layout and Stripe configuration Provider
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── shared/
│   │   │   └── FullScreenPhotoModal.tsx # Full screen image visualizer modal
│   │   └── ui/
│   │       ├── Button.tsx      # Configurable UI Button
│   │       └── CustomText.tsx  # Customized Typography wrapper
│   ├── config/
│   │   └── firebase.ts         # Firebase initialization and configuration
│   ├── features/               # Feature-specific components and sub-logic (auth, chats, etc.)
│   ├── store/                  # Global Zustand stores
│   │   ├── useAIChatStore.ts   # AI Chat history and streaming state
│   │   ├── useAuthStore.ts     # User sessions and authorization
│   │   ├── useChatStore.ts     # User to user messaging state
│   │   ├── usePostStore.ts     # Feed data and image upload state
│   │   ├── useSearchStore.ts   # Feed filtering by keyword/tag
│   │   └── useSubscriptionStore.ts # Stripe plans state & persistance
│   └── types/                  # General TypeScript interfaces
├── assets/                     # Static files (app icons, custom fonts, splash screens)
├── tailwind.config.js          # NativeWind / Tailwind CSS settings
├── tsconfig.json               # TypeScript compiler config
└── package.json                # Scripts & dependency definitions
```

---

## Environment Variables Config

To connect your project to Firebase and Stripe, create a `.env.local` file in the root of the project and add your credentials:

```env
# Firebase API Credentials
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Publishable Key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

*Note: Expo automatically loads environment variables prefixed with `EXPO_PUBLIC_` and makes them available on the client side at runtime.*

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Metro Bundler
```bash
npm run start
```

Once Metro starts, use these interactive keys:
*   Press **`i`** to open the simulator on **iOS** (requires Xcode).
*   Press **`a`** to open the emulator on **Android** (requires Android Studio).
*   Scan the QR code using the **Expo Go** application on your physical iOS or Android device to test live.

---

## Type Safety & Linting

This project is 100% strictly typed. To run a TypeScript check and ensure that everything is clean and safe from runtime exceptions, run:

```bash
npx tsc --noEmit
```

The command will run successfully without any errors or warnings.

---
*Developed with 💙 using modern React Native and Expo paradigms.*
