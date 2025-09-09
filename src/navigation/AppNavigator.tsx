// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import OnboardingNavigator from './OnboardingNavigator';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { useAuth } from '../context/AuthContext';
import Colors from '@/utils/constants/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ isFirstLaunch }: { isFirstLaunch: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        // Show onboarding if it's the very first app launch
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : user ? (
        // If user exists → go to main app
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        // Else → go to auth screens
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
