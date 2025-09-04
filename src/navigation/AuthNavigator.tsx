// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/onboarding/Splash';
import WelcomeScreen from '../screens/onboarding/Welcome';
import WalkthroughOne from '../screens/onboarding/WalkOne';
import WalkthroughTwo from '../screens/onboarding/WalkTwo';
import WalkthroughThree from '../screens/onboarding/WalkThree';
// Later: import Login, Signup, etc.

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  WalkthroughOne: undefined;
  WalkthroughTwo: undefined;
  WalkthroughThree: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="WalkthroughOne" component={WalkthroughOne} />
      <Stack.Screen name="WalkthroughTwo" component={WalkthroughTwo} />
      <Stack.Screen name="WalkthroughThree" component={WalkthroughThree} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
