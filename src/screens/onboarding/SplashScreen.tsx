import { View, Text, Dimensions, Image } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";
import Colors from "@/utils/constants/colors"; 

const { height } = Dimensions.get("window");

type RootStackParamList = {
  WelcomeScreen: undefined;
};

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("WelcomeScreen"); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background, 
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* App Logo */}
      <Image
        source={require("@/assets/images/onboarding/nanlogobg.png")}
        style={{ width: 240, height: 240, marginBottom: 20 }}
        resizeMode="contain"
      />

      {/* App Name
      <Text
        style={{
          fontSize: 32,
          fontWeight: "700",
          color: Colors.primary,
          letterSpacing: 1,
        }}
      >
        NanBites
      </Text> */}

      {/* Loader Animation */}
      <LottieView
        source={require("@/assets/animations/lottie/loader.json")}
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