# 🚀 NanBites Complete Setup Guide

-- Just in case, you are starting fresh, else no need to rebuild this process. Already done.

## 📦 Essential Dependencies Installation

### Core React Native Packages
```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer
npm install react-native-screens react-native-safe-area-context

# State Management
npm install @reduxjs/toolkit react-redux
npm install react-redux @types/react-redux

# Forms & Validation
npm install react-hook-form @hookform/resolvers yup

# UI & Styling
npm install react-native-vector-icons
npm install react-native-linear-gradient
npm install react-native-svg react-native-svg-transformer

# Animations
npm install react-native-reanimated
npm install react-native-gesture-handler

# Async Storage
npm install @react-native-async-storage/async-storage
```

### Supabase & Backend
```bash
# Supabase Client
npm install @supabase/supabase-js

# HTTP Client
npm install axios

# Real-time & WebSocket
npm install react-native-url-polyfill
```

### Payment Integration
```bash
# Stripe
npm install @stripe/stripe-react-native
```

### Maps & Location
```bash
# Mapbox
npm install @rnmapbox/maps

# Location Services
npm install react-native-geolocation-service
npm install @react-native-community/geolocation
```

### Authentication & Social Login
```bash
# Google Sign-In
npm install @react-native-google-signin/google-signin

# Apple Sign-In (for iOS)
npm install @invertase/react-native-apple-authentication
```

### Camera & Media
```bash
# Image Picker
npm install react-native-image-picker

# Camera (for QR scanning)
npm install react-native-vision-camera
npm install vision-camera-code-scanner

# Permissions
npm install react-native-permissions
```

### Push Notifications
```bash
# Firebase Messaging
npm install @react-native-firebase/app @react-native-firebase/messaging

# Local Notifications
npm install @react-native-community/push-notification-ios
npm install react-native-push-notification
```

### Utilities & Helpers
```bash
# Date/Time
npm install date-fns

# UUID
npm install react-native-uuid

# Device Info
npm install react-native-device-info

# NetInfo
npm install @react-native-community/netinfo

# Splash Screen
npm install react-native-splash-screen

# Status Bar
npm install expo-status-bar
```

### Development Dependencies
```bash
# TypeScript
npm install --save-dev typescript @types/react @types/react-native

# Testing
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Linting & Formatting
npm install --save-dev eslint prettier eslint-plugin-react eslint-plugin-react-native

# Husky for Git Hooks
npm install --save-dev husky lint-staged
```

## 📁 Complete Folder Structure Setup

### 1. Create Main Source Structure
```bash
mkdir -p src/{components,screens,navigation,services,store,utils,hooks,context,types,assets}
```

### 2. Components Structure
```bash
mkdir -p src/components/{common,forms,cards,ui,modals}
```

### 3. Screens Structure
```bash
mkdir -p src/screens/{auth,onboarding,main,profile,restaurant,order}
```

### 4. Services Structure
```bash
mkdir -p src/services/{api,auth,payment,location,notifications,storage}
```

### 5. Store Structure
```bash
mkdir -p src/store/{slices,middleware}
```

### 6. Utils Structure
```bash
mkdir -p src/utils/{constants,helpers,validation,formatters}
```

### 7. Assets Structure
```bash
mkdir -p src/assets/{images,icons,fonts,animations}
mkdir -p src/assets/images/{onboarding,restaurants,categories,general}
```

### 8. Additional Folders
```bash
mkdir -p docs
mkdir -p __tests__/{components,screens,utils,services}
mkdir -p .github/workflows
```

## 🔧 Configuration Files to Create

### 1. Environment Configuration
Create `.env.example`:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Mapbox Configuration
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token

# Google OAuth
GOOGLE_CLIENT_ID_ANDROID=your_android_client_id
GOOGLE_CLIENT_ID_IOS=your_ios_client_id

# Firebase (for push notifications)
FIREBASE_PROJECT_ID=your_firebase_project_id

# API Configuration
API_BASE_URL=https://your-supabase-url.supabase.co
```

### 2. TypeScript Configuration
Update `tsconfig.json`:
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@store/*": ["store/*"],
      "@types/*": ["types/*"],
      "@assets/*": ["assets/*"]
    },
    "resolveJsonModule": true
  },
  "include": ["src/**/*", "index.js"],
  "exclude": ["node_modules", "android", "ios"]
}
```

### 3. Metro Configuration
Update `metro.config.js`:
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'mp4', 'ttf'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'svg'],
  },
};

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
);
```

### 4. Babel Configuration
Update `babel.config.js`:
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@services': './src/services',
          '@utils': './src/utils',
          '@store': './src/store',
          '@types': './src/types',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
```

## 🔗 Platform-Specific Setup

### Android Setup
1. **Add to `android/app/build.gradle`**:
```gradle
android {
    ...
    packagingOptions {
        pickFirst '**/libc++_shared.so'
        pickFirst '**/libjsc.so'
    }
}
```

2. **Add permissions to `android/app/src/main/AndroidManifest.xml`**:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.VIBRATE" />
```

### iOS Setup
```bash
cd ios && pod install && cd ..
```

## 📋 Initial Files to Create

### 1. Constants Files
Create `src/utils/constants/`:
- `colors.ts` - App color palette
- `fonts.ts` - Typography system
- `dimensions.ts` - Screen dimensions and spacing
- `api.ts` - API endpoints and configuration

### 2. Service Files
Create `src/services/api/`:
- `supabase.ts` - Supabase client configuration
- `auth.ts` - Authentication methods
- `restaurants.ts` - Restaurant API calls
- `orders.ts` - Order management API

### 3. Type Definitions
Create `src/types/`:
- `user.ts` - User-related types
- `restaurant.ts` - Restaurant and menu types
- `order.ts` - Order and cart types
- `navigation.ts` - Navigation parameter types

### 4. Store Setup
Create `src/store/`:
- `index.ts` - Redux store configuration
- `slices/authSlice.ts` - Authentication state
- `slices/cartSlice.ts` - Shopping cart state
- `slices/orderSlice.ts` - Order management state

## 🚀 Installation Command Summary

Run this complete installation command:
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer react-native-screens react-native-safe-area-context @reduxjs/toolkit react-redux react-hook-form @hookform/resolvers yup react-native-vector-icons react-native-linear-gradient react-native-svg react-native-svg-transformer react-native-reanimated react-native-gesture-handler @react-native-async-storage/async-storage @supabase/supabase-js axios react-native-url-polyfill @stripe/stripe-react-native @rnmapbox/maps react-native-geolocation-service @react-native-community/geolocation @react-native-google-signin/google-signin react-native-image-picker react-native-vision-camera vision-camera-code-scanner react-native-permissions @react-native-firebase/app @react-native-firebase/messaging date-fns react-native-uuid react-native-device-info @react-native-community/netinfo react-native-splash-screen expo-status-bar
```

```bash
npm install --save-dev typescript @types/react @types/react-native jest @testing-library/react-native @testing-library/jest-native eslint prettier eslint-plugin-react eslint-plugin-react-native husky lint-staged
```

## ✅ Next Steps Priority:

1. **Install all packages** ✅
2. **Create folder structure** ✅
3. **Set up Supabase client** 🎯
4. **Configure navigation** 🎯
5. **Create basic components** 🎯
