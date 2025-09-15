import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/utils/constants/colors";

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📦 Orders coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" },
  text: { color: Colors.text, fontSize: 20, fontWeight: "bold" },
});
