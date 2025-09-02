# 📦 NanBites Dependencies Guide

## Package Categories & Purposes

### 🧭 Navigation Packages
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-navigation/native | ^6.1.9 | Core navigation library | Always required |
| @react-navigation/native-stack | ^6.9.17 | Stack navigation | Auth flows, detail screens |
| @react-navigation/bottom-tabs | ^6.5.11 | Tab navigation | Main app navigation |
| @react-navigation/drawer | ^6.6.6 | Side drawer | Settings, profile menu |
| react-native-screens | ^3.29.0 | Native screen optimization | Performance improvement |
| react-native-safe-area-context | ^4.8.2 | Safe area handling | iPhone notch, Android nav |

### 🏪 State Management
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @reduxjs/toolkit | ^2.0.1 | State management | Global app state |
| react-redux | ^9.0.4 | React Redux bindings | Connect components to store |

### 📝 Forms & Validation
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | ^7.48.2 | Form handling | All forms in app |
| @hookform/resolvers | ^3.3.2 | Form validation resolvers | Connect yup to react-hook-form |
| yup | ^1.4.0 | Schema validation | Form validation rules |

### 🎨 UI & Styling
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-vector-icons | ^10.0.3 | Icon library | All app icons |
| react-native-linear-gradient | ^2.8.3 | Gradient backgrounds | Card backgrounds, buttons |
| react-native-svg | ^14.1.0 | SVG support | Custom icons, illustrations |
| react-native-svg-transformer | ^1.1.0 | SVG imports | Import SVG as components |

### ✨ Animations
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-reanimated | ^3.6.2 | Smooth animations | Micro-interactions, transitions |
| react-native-gesture-handler | ^2.14.1 | Gesture handling | Swipe actions, pan gestures |

### 🗄️ Storage & Backend
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @supabase/supabase-js | ^2.39.0 | Supabase client | Database, auth, storage |
| @react-native-async-storage/async-storage | ^1.21.0 | Local storage | Cache, user preferences |
| axios | ^1.6.2 | HTTP client | API calls |
| react-native-url-polyfill | ^2.0.0 | URL polyfill for Supabase | Required for Supabase |

### 💳 Payment & Integrations
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @stripe/stripe-react-native | ^0.35.0 | Payment processing | Checkout, payments |
| @rnmapbox/maps | ^10.1.11 | Maps & location | Restaurant locations, tracking |
| react-native-geolocation-service | ^5.3.1 | GPS location | User location, delivery tracking |

### 🔐 Authentication
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-native-google-signin/google-signin | ^10.1.1 | Google OAuth | Social login |
| @invertase/react-native-apple-authentication | ^2.3.0 | Apple Sign-In | iOS social login |

### 📷 Camera & Media
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-image-picker | ^7.1.0 | Image selection | Profile pics, food photos |
| react-native-vision-camera | ^3.6.17 | Camera access | QR scanning, photo capture |
| vision-camera-code-scanner | ^0.2.0 | QR/Barcode scanning | Menu QR codes, promos |
| react-native-permissions | ^4.1.1 | Runtime permissions | Camera, location access |

### 🔔 Notifications
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-native-firebase/app | ^18.7.3 | Firebase core | Push notifications base |
| @react-native-firebase/messaging | ^18.7.3 | Push notifications | Order updates, promos |

### 🛠️ Utilities
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| date-fns | ^3.0.6 | Date formatting | Order timestamps, schedules |
| react-native-uuid | ^2.0.2 | Unique ID generation | Temporary IDs, keys |
| react-native-device-info | ^10.12.0 | Device information | Analytics, debugging |
| @react-native-community/netinfo | ^11.2.1 | Network status | Offline handling |


## Installation Order & Batches

### Batch 1: Core Foundation
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
````

### Batch 2: State & Forms
```bash
npm install @reduxjs/toolkit react-redux react-hook-form @hookform/resolvers yup
```

### Batch 3: UI & Animations
```bash
npm install react-native-vector-icons react-native-linear-gradient react-native-svg react-native-svg-transformer react-native-reanimated react-native-gesture-handler
```

### Batch 4: Backend & Storage
```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage axios react-native-url-polyfill
```

### Batch 5: Integrations
```bash
npm install @stripe/stripe-react-native @rnmapbox/maps react-native-geolocation-service @react-native-google-signin/google-signin
```

### Batch 6: Media & Permissions
```bash
npm install react-native-image-picker react-native-vision-camera vision-camera-code-scanner react-native-permissions
```

### Batch 7: Notifications & Utilities
```bash
npm install @react-native-firebase/app @react-native-firebase/messaging date-fns react-native-uuid react-native-device-info @react-native-community/netinfo
```