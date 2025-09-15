import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/utils/constants/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Profile coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" },
  text: { color: Colors.text, fontSize: 20, fontWeight: "bold" },
});
