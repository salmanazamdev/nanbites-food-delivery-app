// src/screens/auth/SignupScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeBiometrics from "react-native-biometrics";
import { useAuth } from "../../context/AuthContext";
import Colors from "@/utils/constants/colors";

type RootStackParamList = {
  LoginScreen: undefined;
  Main: undefined;
};

export default function SignupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fingerprint states
  const [fingerprintRegistered, setFingerprintRegistered] = useState(false);
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = useState<"idle" | "success" | "fail">("idle");

  // Handle signup
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password);

      if (error) {
        Alert.alert("Signup Failed", error.message);
      } else {
        await AsyncStorage.setItem("userEmail", email);
        await AsyncStorage.setItem("userPassword", password);
        await AsyncStorage.setItem("hasLaunched", "true"); // skip onboarding next time

        Alert.alert("Success", "Account created! Please log in.");
        navigation.replace("LoginScreen");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle fingerprint registration
  const handleRegisterFingerprint = async () => {
    setShowFingerprintModal(true);
    setFingerprintStatus("idle");

    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        setFingerprintStatus("fail");
        return;
      }

      const result = await rnBiometrics.simplePrompt({
        promptMessage: "Register your fingerprint",
      });

      if (result.success) {
        await AsyncStorage.setItem("fingerprintRegistered", "true");
        setFingerprintRegistered(true);
        setFingerprintStatus("success");
      } else {
        setFingerprintStatus("fail");
      }
    } catch (error) {
      console.log(error);
      setFingerprintStatus("fail");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={26} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.formBox}>
        <Text style={styles.title}>Register</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={Colors.secondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor={Colors.secondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor={Colors.secondary}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.disabledBtn]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.loginBtnText}>Register</Text>
          )}
        </TouchableOpacity>

        {/* Fingerprint Button */}
        <TouchableOpacity
          style={[
            styles.loginBtn,
            { backgroundColor: fingerprintRegistered ? "#4CAF50" : Colors.secondary, marginTop: 10 },
          ]}
          onPress={handleRegisterFingerprint}
        >
          <Text style={styles.loginBtnText}>
            {fingerprintRegistered ? "Fingerprint Registered" : "Register Fingerprint"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Social login buttons */}
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require("@/assets/images/onboarding/google.png")} style={styles.icon} />
          <Text style={styles.socialText}>Sign up with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtn}>
          <Image source={require("@/assets/images/onboarding/apple.png")} style={styles.icon} />
          <Text style={styles.socialText}>Sign up with Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("LoginScreen")}>
            Login
          </Text>
        </Text>
      </View>

      {/* Fingerprint Modal */}
      <Modal visible={showFingerprintModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Icon
              name="finger-print"
              size={60}
              color={
                fingerprintStatus === "success"
                  ? "#4CAF50"
                  : fingerprintStatus === "fail"
                  ? "#F44336"
                  : "#fff"
              }
              style={{ alignSelf: "center", marginBottom: 16 }}
            />
            {fingerprintStatus === "idle" && (
              <Text style={styles.modalText}>
                Please hold your finger at the scanner to verify your identity
              </Text>
            )}
            {fingerprintStatus === "success" && (
              <Text style={[styles.modalText, { color: "#4CAF50" }]}>
                Fingerprint registered successfully!
              </Text>
            )}
            {fingerprintStatus === "fail" && (
              <Text style={[styles.modalText, { color: "#F44336" }]}>
                Your fingerprint did not match. Please try again later.
              </Text>
            )}
            <TouchableOpacity onPress={() => setShowFingerprintModal(false)}>
              <Text style={styles.cancelBtn}>Close</Text>
            </TouchableOpacity>
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
  title: { fontSize: 28, fontWeight: "bold", color: Colors.primary, marginBottom: 20 },
  label: { color: Colors.secondary, fontSize: 16, marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    color: Colors.secondary,
    backgroundColor: Colors.background,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  disabledBtn: { backgroundColor: Colors.secondary, opacity: 0.6 },
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
  socialText: { color: Colors.secondary },
  footer: { alignItems: "center", marginTop: 20 },
  footerText: { color: Colors.secondary },
  link: { color: Colors.primary, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000a",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#232323",
    borderRadius: 16,
    padding: 32,
    width: "85%",
    alignItems: "center",
  },
  modalText: { color: "#fff", fontSize: 16, textAlign: "center", marginBottom: 12 },
  cancelBtn: { color: "#aaa", fontSize: 16, marginTop: 16 },
});
