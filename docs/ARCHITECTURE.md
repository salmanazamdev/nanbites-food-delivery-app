# 🏗️ NanBites Architecture Guide

## Project Structure Philosophy

### Folder Organization Principle
src/
├── components/     # Reusable UI building blocks
├── screens/        # Full-screen components
├── navigation/     # App routing and navigation
├── services/       # External API interactions
├── store/          # Global state management
├── utils/          # Pure functions and helpers
├── hooks/          # Custom React hooks
├── context/        # React Context providers
├── types/          # TypeScript definitions
└── assets/         # Static files

## Data Flow Architecture

### Authentication Flow
LoginScreen → authService → Supabase Auth → Redux Store → Navigation

### Order Flow
RestaurantScreen → Cart → Checkout → Stripe → Supabase → OrderTracking

### Real-time Updates
Supabase Real-time → Redux Middleware → Component Updates

## Component Hierarchy

### Screen Components
- **Auth Screens**: Login, Signup, ForgotPassword
- **Main Screens**: Home, Search, RestaurantDetail
- **Order Screens**: Cart, Checkout, Tracking
- **Profile Screens**: Profile, Settings, OrderHistory

### Reusable Components
- **Common**: Button, Input, LoadingSpinner
- **Cards**: RestaurantCard, FoodItemCard, OrderCard
- **Forms**: LoginForm, AddressForm, ReviewForm

## State Management Strategy

<!-- ### Redux Slices
- `authSlice` - User authentication and profile
- `cartSlice` - Shopping cart state
- `orderSlice` - Order management
- `restaurantSlice` - Restaurant data and search
- `uiSlice` - UI states (loading, modals, theme)

### Context Usage
- `ThemeContext` - Dark/Light mode
- `LocationContext` - GPS and location services
- `NotificationContext` - Push notification handling -->

## API Layer Structure

### Service Organization
services/
├── api/
│   ├── supabase.ts      # Client configuration
│   ├── auth.ts          # Authentication methods
│   ├── restaurants.ts   # Restaurant operations
│   ├── orders.ts        # Order management
│   └── users.ts         # User profile operations
├── payment/
│   └── stripe.ts        # Payment processing
├── location/
│   └── mapbox.ts        # Maps and tracking
└── notifications/
└── pushNotifications.ts

