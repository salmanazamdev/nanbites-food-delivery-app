# 🍕 NanBites Food Delivery App

A comprehensive full-stack food delivery mobile application built with React Native CLI, featuring modern UI/UX, real-time tracking, secure payments, and seamless user experience.

## 📱 Features

### 🔐 Authentication & Onboarding
- Google OAuth integration
- Email/Password authentication
- Fingerprint authentication
- Multi-step onboarding flow
- Profile management with photo uploads

### 🏠 Core Food Delivery Features
- Browse restaurants and menus
- Advanced search and filtering
- Real-time order tracking with Mapbox
- Multiple payment options via Stripe
- Order history and favorites

### 📱 Enhanced Mobile Features
- Push notifications for order updates
- QR code scanner for restaurant promos
- Photo uploads for reviews and profiles
- Offline mode support
- Dark/Light theme toggle

### 💳 Payment & Security
- Stripe payment integration
- Secure card storage
- Multiple payment methods
- Order receipt generation

### 🗺️ Location Services
- Real-time GPS tracking
- Delivery route optimization
- Restaurant location mapping
- Address management

## 🛠️ Tech Stack

### Frontend
- **React Native CLI** - Native mobile development
- **TypeScript** - Type safety and better development experience
- **React Navigation v6** - Navigation and routing
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Reanimated 3** - Smooth animations

### Backend & Services
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Database migrations
- **Stripe** - Payment processing
- **Mapbox** - Maps and location services
- **Firebase Cloud Messaging** - Push notifications

<!-- ### Development Tools
- **ESLint & Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework
- **Flipper** - Debugging
- **CodePush** - Over-the-air updates -->

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Input, etc.)
│   ├── forms/           # Form-specific components
│   └── ui/              # UI-specific components
├── screens/             # Screen components
│   ├── auth/            # Authentication screens
│   ├── onboarding/      # Onboarding flow
│   ├── home/            # Home and main screens
│   ├── restaurant/      # Restaurant related screens
│   ├── order/           # Order management screens
│   └── profile/         # User profile screens
├── navigation/          # Navigation configuration
│   ├── AuthNavigator.tsx
│   ├── AppNavigator.tsx
│   └── TabNavigator.tsx
├── services/            # API and external services
│   ├── api/             # API calls and endpoints
│   ├── auth/            # Authentication services
│   ├── storage/         # Local storage utilities
│   └── notifications/   # Push notification setup
├── store/               # Redux store configuration
│   ├── slices/          # Redux slices
│   └── index.ts         # Store setup
├── utils/               # Utility functions
│   ├── constants/       # App constants
│   ├── helpers/         # Helper functions
│   └── validation/      # Form validation schemas
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── types/               # TypeScript type definitions
├── assets/              # Images, fonts, and static files
│   ├── images/
│   ├── icons/
│   └── fonts/
└── supabase/            # Database migrations and configuration
    ├── migrations/      # Database migration files
    ├── config.toml      # Supabase configuration
    └── seed.sql         # Database seed data
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- React Native CLI
- Android Studio / Xcode
- Supabase CLI (for database management)
- Docker Desktop (for local database development)
- Supabase account
- Stripe account
- Mapbox account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/salmanazamdev/nanbites-food-delivery-app.git
   cd nanbites-food-delivery-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Supabase CLI**
   ```bash
   # Windows (using Scoop)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   
   # macOS
   brew install supabase/tap/supabase
   
   # Alternative: Use npx for each command
   npx supabase --version
   ```

4. **iOS Setup** (if developing for iOS)
   ```bash
   cd ios && pod install && cd ..
   ```

5. **Database Setup**
   ```bash
   # Login to Supabase
   supabase login
   
   # Link to the project (replace with your project ref)
   supabase link --project-ref your-project-ref
   
   # Pull latest database schema
   supabase db pull
   ```

6. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   en.example are just to understand the logic

   Fill in your environment variables:
   ```env
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # Mapbox
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

7. **Run the application**
   ```bash
   # Start Metro bundler
   npx react-native start
   
   # Run on Android
   npx react-native run-android
   
   # Run on iOS
   npx react-native run-ios
   ```

## 🗄️ Database Management

### Migration Commands
```bash
# Create a new migration
supabase migration new migration_name

# Apply migrations to remote database
supabase db push

# Check migration status
supabase migration list

# Reset local database (development only)
supabase db reset
```

### Common Migration Issues
If you encounter "migration history mismatch" errors:
```bash
# Repair migration history
supabase migration repair --status applied MIGRATION_ID

# Then pull the schema
supabase db pull
```

**Note**: The global npm install method (`npm install -g supabase`) is deprecated as of 2025. Use platform-specific installation methods above.

## 📊 Database Schema (Supabase)

### Key Tables
- `users` - User profiles and authentication
- `restaurants` - Restaurant information and details
- `menu_items` - Food items and pricing
- `orders` - Order management and tracking
- `order_items` - Individual items in orders
- `reviews` - User reviews and ratings
- `addresses` - User delivery addresses
- `payments` - Payment transaction records

All schema changes are version-controlled through migration files in `supabase/migrations/`.

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#FF6B35)
- **Secondary**: Dark Blue (#2D3748)
- **Success**: Green (#48BB78)
- **Warning**: Yellow (#ED8936)
- **Error**: Red (#E53E3E)
- **Background**: Light Gray (#F7FAFC)

### Typography
- **Primary Font**: Inter
- **Headings**: Bold weights (600-800)
- **Body Text**: Regular (400) and Medium (500)

## 🔧 Key Integrations

### Authentication Flow
```typescript
// Google OAuth + Supabase Auth
// Email/Password with email verification
// Secure token management
```

### Payment Integration
```typescript
// Stripe payment processing
// Card tokenization
// Secure payment flow
```

### Real-time Features
```typescript
// Supabase real-time subscriptions
// Live order tracking
// Push notifications
```

## 📱 Screens Overview

### Authentication Flow
1. **Splash Screen** - App loading with branding
2. **Onboarding** - 3-step feature introduction
3. **Login/Signup** - Multiple authentication options
4. **Email Verification** - Account confirmation

### Main Application
1. **Home** - Restaurant discovery and featured items
2. **Search** - Advanced filtering and search
3. **Restaurant Detail** - Menu browsing and customization
4. **Cart** - Order review and modification
5. **Checkout** - Payment and delivery details
6. **Order Tracking** - Real-time delivery tracking
7. **Profile** - User settings and order history

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build & Deployment

### Development Build
```bash
# Android
npx react-native run-android --variant=debug

# iOS
npx react-native run-ios --configuration Debug
```

### Production Build
```bash
# Android
cd android && ./gradlew assembleRelease

# iOS
# Use Xcode for production builds
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. If making database changes, create migrations:
   ```bash
   supabase migration new feature_amazing_feature
   ```
4. Test your changes locally:
   ```bash
   supabase db reset  # Reset local DB with migrations
   ```
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Database Changes
- **Never edit existing migration files** - create new ones
- **Test migrations locally** before pushing
- **Include both schema and data changes** in migration files
- **Add rollback instructions** in migration comments when possible

## 👨‍💻 Author

**Salman Azam**
- GitHub: [@salmanazamdev](https://github.com/salmanazamdev)
- [LinkedIn](https://www.linkedin.com/in/salmanazamdev)

## 🙏 Acknowledgments

- Built during internship program
- Inspired by modern food delivery applications
- Special thanks to mentors and the development team

## 🔮 Roadmap

### Phase 1 (Current) - Core Features ✅
- [x] Authentication system
- [x] Basic food ordering
- [x] Payment integration
- [x] Map integration
- [x] Database migrations setup

### Phase 2 - Enhanced Features 🚧
- [ ] Real-time chat with delivery partners
- [ ] Advanced analytics dashboard
- [ ] Loyalty program integration
- [ ] Multi-language support

### Phase 3 - Advanced Features 📋
- [ ] AI-powered food recommendations
- [ ] Voice ordering capabilities
- [ ] Augmented reality menu previews
- [ ] Social features and food sharing

---

**Made with ❤️ using React Native & Supabase**