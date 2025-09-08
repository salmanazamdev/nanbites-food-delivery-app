import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import Colors from "@/utils/constants/colors";
import { IP_ADDRESS } from "@/constants/endpoint";

type RootStackParamList = {
  SignupScreen: undefined;
  Main: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] =
    useState<"idle" | "success" | "fail">("idle");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }
    try {
      const response = await axios.post(`${IP_ADDRESS}/login`, {
        username,
        password,
      });
      if (response.status === 200) {
        await AsyncStorage.setItem("userId", response.data.userId.toString());
        navigation.replace("Main");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleFingerprintLogin = async () => {
    setShowFingerprintModal(true);
    setFingerprintStatus("idle");

    const registered = await AsyncStorage.getItem("fingerprintRegistered");
    if (!registered) return setFingerprintStatus("fail");

    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return setFingerprintStatus("fail");

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return setFingerprintStatus("fail");

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with your fingerprint",
    });

    if (result.success) {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        setFingerprintStatus("success");
        setTimeout(() => {
          setShowFingerprintModal(false);
          navigation.replace("Main");
        }, 1000);
      } else {
        setFingerprintStatus("fail");
      }
    } else {
      setFingerprintStatus("fail");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.formBox}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={Colors.secondary}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.secondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: Colors.secondary }]}
          onPress={handleFingerprintLogin}
        >
          <Text style={styles.loginBtnText}>Login with Fingerprint</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={require("@/assets/images/onboarding/google.png")}
            style={styles.icon}
          />
          <Text style={styles.socialText}>Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={require("@/assets/images/onboarding/apple.png")}
            style={styles.icon}
          />
          <Text style={styles.socialText}>Login with Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("SignupScreen")}
          >
            Register
          </Text>
        </Text>
      </View>

      {/* Fingerprint Modal */}
      <Modal visible={showFingerprintModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons
              name="finger-print"
              size={60}
              color={
                fingerprintStatus === "success"
                  ? Colors.accent
                  : fingerprintStatus === "fail"
                  ? "red"
                  : Colors.primary
              }
              style={{ alignSelf: "center", marginBottom: 16 }}
            />
            <Text style={styles.modalText}>
              {fingerprintStatus === "idle"
                ? "Place your finger on the scanner"
                : fingerprintStatus === "success"
                ? "Login successful!"
                : "Authentication failed"}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  backBtn: { position: "absolute", top: 50, left: 24, zIndex: 2 },
  formBox: { marginTop: 80 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    color: Colors.text,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  loginBtnText: { color: "white", fontWeight: "bold" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: "#ddd" },
  orText: { marginHorizontal: 10, color: Colors.secondary },
  socialBtn: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: { width: 20, height: 20, marginRight: 10 },
  socialText: { color: Colors.text },
  footer: { alignItems: "center", marginTop: 20 },
  footerText: { color: Colors.secondary },
  link: { color: Colors.primary, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#0008",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalText: { color: Colors.text },
});
