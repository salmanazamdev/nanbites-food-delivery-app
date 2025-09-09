import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../utils/constants/colors";

export default function Walk3() {
  const handleFinishOnboarding = async () => {
    // Save that onboarding is done
    await AsyncStorage.setItem("hasLaunched", "true");
    // Do NOT navigate manually — AppNavigator will re-render and show Auth
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/onboarding/delivery.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Fast Delivery</Text>
        <Text style={styles.description}>
          Get your food delivered to you in no time.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFinishOnboarding}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 50,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.accent,
    width: "70%",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 40,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
