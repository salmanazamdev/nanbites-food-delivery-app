import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingNavigator from "./OnboardingNavigator";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

const AppNavigator = ({ isFirstLaunch, isAuthenticated }: { isFirstLaunch: boolean, isAuthenticated: boolean }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : !isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
