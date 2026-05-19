# 📸 Photo App Prototype (Expo + TypeScript + NativeWind + Zustand)

Welcome to the **Photo App Prototype**! This project is a premium, modern, and highly responsive mobile application prototype designed for viewing, searching, adding photos, and simulated chatting.

Built using the latest industry standards, this repository is pre-configured and 100% ready for the implementation of the Figma design.

---

## 🛠️ Stack & Configuration Status

Here is the current checklist of what is fully configured and ready to run:

*   **⚡ Expo SDK 54 (expo-router v6)**: Pre-configured with file-based routing.
*   **🔷 TypeScript**: 100% typed, strict-ready, type-checking passes cleanly (`npx tsc --noEmit` is clean).
*   **🎨 NativeWind (Tailwind CSS v3)**: Fully integrated with Babel and PostCSS configurations, optimized for native component styling.
*   **🧠 Zustand State Management**: Installed and ready to manage the application state globally.
*   **🔥 Firebase / Auth Integration**: SDK installed (`firebase` v10) and ready for backend hookups.
*   **🛡️ ESLint & Prettier**: Configured with strict style-matching rules. All files are fully formatted and formatted automatically on saves.

---

## 📂 Project Architecture & Folders

The project follows a standard Expo Router setup:

```
photo-app-prototype/
├── app/                  # File-based Navigation Router
│   ├── (tabs)/           # Main Application Tab-bar Screens
│   │   ├── _layout.tsx   # Tabs layout & customized icons
│   │   ├── index.tsx     # Tab 1: Discover / Home Feed
│   │   └── two.tsx       # Tab 2: Profile / Chats
│   ├── _layout.tsx       # Application root layout with ThemeProviders
│   └── modal.tsx         # Popup screens (e.g. Add Photo)
├── components/           # Reusable & Base Custom UI Elements
├── constants/            # Styled design tokens, sizes, and colors
├── assets/               # Typography, local assets, and images
├── tailwind.config.js    # Tailwind scanner paths & design customizations
├── tsconfig.json         # TypeScript compiler configurations
├── .eslintrc.js          # ESLint legacy config for Expo rules
└── .prettierrc           # Prettier rules with tailwind sorting integration
```

---

## 🚀 Getting Started

Follow these steps to run the application on your machine.

### 1. Install Dependencies
Dependencies are already installed, but to make sure everything is completely synced:
```bash
npm install
```

### 2. Start the Development Server
Run the Expo development server:
```bash
npm run start
```
*   Press **`i`** to open the simulator on **iOS** (requires Xcode).
*   Press **`a`** to open the simulator on **Android** (requires Android Studio).
*   Scan the QR code in the terminal using the **Expo Go** app on your physical device.

### 3. Run Linter & Typechecks
Ensure that your code style and type safety remain pristine during development:
```bash
# Run ESLint + Prettier check
npx eslint .

# Fix all auto-fixable formatting errors
npx eslint . --fix

# Run TypeScript type check
npx tsc --noEmit
```

---

## 🎯 Next Implementation Steps (To-Do)

To complete the prototype successfully according to the Figma specification, follow this roadmap:

### Step 1: Base Design System & UI Elements
*   [ ] Define custom color palette in `constants/Colors.ts` matching Figma's styles.
*   [ ] Implement a unified **`<Text>`** component with variants (`title`, `subtitle`, `body`).
*   [ ] Implement a highly customizable **`<Button>`** component with modern ripple & press effects.

### Step 2: Auth Screens (Log In & Sign Up)
*   [ ] Create `app/auth/login.tsx` & `app/auth/register.tsx`.
*   [ ] Build beautiful input fields with validations and a responsive login flow.
*   [ ] Save session state via a Zustand store.

### Step 3: Discover (Home Grid Feed)
*   [ ] Transform `app/(tabs)/index.tsx` into a responsive 2 or 3-column photo grid.
*   [ ] Integrate local mocks or Firebase data.
*   [ ] Create a swipeable full-screen viewer (`app/photo/[id].tsx`).

### Step 4: Photo Addition
*   [ ] Integrate `expo-image-picker` to select photos from the gallery.
*   [ ] Add URL-based upload and instantly append to the Discover feed.

### Step 5: Profile & Chats
*   [ ] Implement Profile screen (`app/(tabs)/profile.tsx`) showing follower count and mock interactions.
*   [ ] Implement simulated live-chat interface with mock message exchanges.

---
*Developed with 💙 using Expo & React Native.*
