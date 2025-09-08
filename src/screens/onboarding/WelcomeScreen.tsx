import React from "react";
import { View, Text, ImageBackground, StyleSheet, Button } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Walk1: undefined;
};

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require("@/assets/images/onboarding/welcomebg.jpg")}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to NanBites 👋</Text>
        <Text style={styles.subtitle}>Delicious meals, faster than ever 🍕</Text>
        <Button title="Next" onPress={() => navigation.navigate("Walk1")} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: "cover" },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 100,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  title: {
    color: "#1a974e",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    marginTop: 7,
    marginBottom: 20,
  },
});
