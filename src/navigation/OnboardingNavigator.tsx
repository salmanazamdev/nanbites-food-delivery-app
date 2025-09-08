import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/onboarding/SplashScreen";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import Walk1 from "../screens/onboarding/Walk1";
import Walk2 from "../screens/onboarding/Walk2";
import Walk3 from "../screens/onboarding/Walk3";

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    <Stack.Screen name="Walk1" component={Walk1} />
    <Stack.Screen name="Walk2" component={Walk2} />
    <Stack.Screen name="Walk3" component={Walk3} />
  </Stack.Navigator>
);

export default OnboardingNavigator;
