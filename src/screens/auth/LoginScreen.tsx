// src/screens/auth/LoginScreen.tsx
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
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeBiometrics from "react-native-biometrics";
import { useAuth } from "../../context/AuthContext";
import Colors from "@/utils/constants/colors";

type RootStackParamList = {
  SignupScreen: undefined;
  Main: undefined;
};

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fingerprint modal states
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = useState<
    "idle" | "success" | "fail"
  >("idle");

  // Normal login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert("Login Failed", error.message);
      } else {
        await AsyncStorage.setItem("userEmail", email);
        await AsyncStorage.setItem("userPassword", password);
        await AsyncStorage.setItem("hasLaunched", "true");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fingerprint login
  const handleFingerprintLogin = async () => {
    setShowFingerprintModal(true);
    setFingerprintStatus("idle");

    try {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedPassword = await AsyncStorage.getItem("userPassword");
      if (!storedEmail || !storedPassword) {
        setFingerprintStatus("fail");
        return;
      }

      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        setFingerprintStatus("fail");
        return;
      }

      const result = await rnBiometrics.simplePrompt({
        promptMessage: "Login with your fingerprint",
      });

      if (result.success) {
        const { error } = await signIn(storedEmail, storedPassword);
        if (!error) {
          await AsyncStorage.setItem("hasLaunched", "true");
          setFingerprintStatus("success");
          setTimeout(() => setShowFingerprintModal(false), 1000);
        } else {
          setFingerprintStatus("fail");
        }
      } else {
        setFingerprintStatus("fail");
      }
    } catch (err) {
      console.error(err);
      setFingerprintStatus("fail");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        Alert.alert(
          "Google Sign-In Failed",
          error.message || "Something went wrong"
        );
      } else {
        await AsyncStorage.setItem("hasLaunched", "true");
      }
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("Error", "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={26} color={Colors.primary} />
          </TouchableOpacity>

          <View style={styles.formBox}>
            <Text style={styles.title}>Login</Text>

            {/* Email */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.secondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.secondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.disabledBtn]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.loginBtnText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Fingerprint Button */}
            <TouchableOpacity
              style={[styles.loginBtn, { backgroundColor: Colors.secondary }]}
              onPress={handleFingerprintLogin}
            >
              <Text style={styles.loginBtnText}>Login with Fingerprint</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Old style social buttons */}
            <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleLogin}>
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

          {/* Footer */}
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
        </View>
      </ScrollView>

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
                Place your finger on the scanner to continue
              </Text>
            )}
            {fingerprintStatus === "success" && (
              <Text style={[styles.modalText, { color: "#4CAF50" }]}>
                Login successful!
              </Text>
            )}
            {fingerprintStatus === "fail" && (
              <Text style={[styles.modalText, { color: "#F44336" }]}>
                Fingerprint did not match. Try again.
              </Text>
            )}
            <TouchableOpacity onPress={() => setShowFingerprintModal(false)}>
              <Text style={styles.cancelBtn}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  backBtn: { alignSelf: "flex-start" },

  formBox: { marginTop: 40 },
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
    backgroundColor: Colors.background,
  },

  loginBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  disabledBtn: { backgroundColor: Colors.secondary, opacity: 0.6 },
  loginBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },

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
    alignItems: "center",
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
  cancelBtn: { color: Colors.primary, fontSize: 16, marginTop: 16 },
});
