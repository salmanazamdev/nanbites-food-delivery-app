import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingNavigator from "./OnboardingNavigator";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";
import { useAuth } from "../context/AuthContext";
import Colors from "@/utils/constants/colors";
import CartScreen from "@/screens/main/cart/CartScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      setIsFirstLaunch(hasLaunched === null);
    };
    checkLaunch();

    // Listen for changes to "hasLaunched"
    const interval = setInterval(checkLaunch, 500);
    return () => clearInterval(interval);
  }, []);

  if (loading || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
  {isFirstLaunch ? (
    <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
  ) : user ? (
    <>
      <Stack.Screen name="Main" component={TabNavigator} />

      {/* Cart modal accessible from anywhere */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ presentation: "modal", headerShown: false }}
      />
    </>
  ) : (
    <Stack.Screen name="Auth" component={AuthNavigator} />
  )}
</Stack.Navigator>

  );
};

export default AppNavigator;
