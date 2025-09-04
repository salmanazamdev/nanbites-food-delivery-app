import React, { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const { height } = Dimensions.get("window");

type RootStackParamList = {
  Welcome: undefined;
};

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Welcome"); // goes to WelcomeScreen
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "600", color: "#000000" }}>
        🍽️ NanBites
      </Text>

      <LottieView
        source={require("../../assets/lottie/loader.json")}
        autoPlay
        loop
        style={{
          position: "absolute",
          bottom: height * 0.09,
          width: 90,
          height: 90,
        }}
      />
    </View>
  );
}
