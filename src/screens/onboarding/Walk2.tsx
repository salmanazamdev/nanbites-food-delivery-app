import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Colors from "../../utils/constants/colors"; 

type RootStackParamList = {
  Walk3: undefined;
};

export default function Walk2() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/onboarding/order.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Easy Payment</Text>
        <Text style={styles.description}>
          Pay for your orders seamlessly with just a few taps.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Walk3")}
      >
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
    color: Colors.primary, //  using brand orange
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.accent, //  using accent green
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
