import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // fake timeout for splash
    setTimeout(() => setIsLoading(false), 1500);

    // later: check async storage for firstLaunch
    // later: check auth state
  }, []);

  if (isLoading) {
    return null; // or custom loader
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NavigationContainer>
        <AppNavigator
          isFirstLaunch={isFirstLaunch}
          isAuthenticated={isAuthenticated}
        />
      </NavigationContainer>
    </>
  );
};

export default App;
