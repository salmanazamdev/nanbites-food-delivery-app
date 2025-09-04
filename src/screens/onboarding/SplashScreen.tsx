import { View, Text, Dimensions, Image } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import Colors from "@/utils/constants/colors"; // 🎨 central theme

const { height } = Dimensions.get("window");

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding/walk1");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background, // ✅ from theme
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* App Logo */}
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 140, height: 140, marginBottom: 20 }}
        resizeMode="contain"
      />

      {/* App Name */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: "700",
          color: Colors.primary, // ✅ Orange brand color
          letterSpacing: 1,
        }}
      >
        NanBites
      </Text>

      {/* Loader Animation */}
      <LottieView
        source={require("@/assets/lottie/loader.json")}
        autoPlay
        loop
        style={{
          position: "absolute",
          bottom: height * 0.08,
          width: 90,
          height: 90,
        }}
      />
    </View>
  );
}
