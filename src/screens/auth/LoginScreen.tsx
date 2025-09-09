import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "react-native-local-auth";
import { supabase } from "@/utils/supabase/supabaseClient"; // You'll need to create this
import Colors from "@/utils/constants/colors";

type RootStackParamList = {
  Signup: undefined;
  Main: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = 
    useState<"idle" | "success" | "fail">("idle");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }

      if (data.user) {
        // Store user data for offline access
        await AsyncStorage.setItem("userId", data.user.id);
        await AsyncStorage.setItem("userEmail", data.user.email || "");
        
        // Navigate to main app
        navigation.replace("Main");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprintLogin = async () => {
    setShowFingerprintModal(true);
    setFingerprintStatus("idle");

    try {
      // Check if fingerprint is registered for this device
      const registered = await AsyncStorage.getItem("fingerprintRegistered");
      if (!registered) {
        setFingerprintStatus("fail");
        setTimeout(() => {
          setShowFingerprintModal(false);
          Alert.alert("Error", "Fingerprint not registered. Please login with email/password first.");
        }, 1500);
        return;
      }

      // Check hardware compatibility
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        setFingerprintStatus("fail");
        setTimeout(() => {
          setShowFingerprintModal(false);
          Alert.alert("Error", "Biometric hardware not available");
        }, 1500);
        return;
      }

      // Check if biometrics are enrolled
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        setFingerprintStatus("fail");
        setTimeout(() => {
          setShowFingerprintModal(false);
          Alert.alert("Error", "No biometrics enrolled on this device");
        }, 1500);
        return;
      }

      // Authenticate with biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with your biometric",
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Get stored credentials
        const storedEmail = await AsyncStorage.getItem("userEmail");
        const userId = await AsyncStorage.getItem("userId");
        
        if (storedEmail && userId) {
          // Verify session is still valid
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            setFingerprintStatus("success");
            setTimeout(() => {
              setShowFingerprintModal(false);
              navigation.replace("Main");
            }, 1000);
          } else {
            // Session expired, need to login again
            setFingerprintStatus("fail");
            setTimeout(() => {
              setShowFingerprintModal(false);
              Alert.alert("Session Expired", "Please login with your email and password");
            }, 1500);
          }
        } else {
          setFingerprintStatus("fail");
          setTimeout(() => {
            setShowFingerprintModal(false);
            Alert.alert("Error", "No stored credentials found");
          }, 1500);
        }
      } else {
        setFingerprintStatus("fail");
        setTimeout(() => setShowFingerprintModal(false), 1500);
      }
    } catch (error) {
      console.error("Fingerprint login error:", error);
      setFingerprintStatus("fail");
      setTimeout(() => setShowFingerprintModal(false), 1500);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      
      // Handle OAuth redirect - this might need platform-specific handling
      console.log("Google login initiated:", data);
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("Error", "Google login failed");
    }
  };

  const handleAppleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
      });
      
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      
      console.log("Apple login initiated:", data);
    } catch (error) {
      console.error("Apple login error:", error);
      Alert.alert("Error", "Apple login failed");
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
          placeholder="Email"
          placeholderTextColor={Colors.secondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.secondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={[styles.loginBtn, { opacity: loading ? 0.7 : 1 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: Colors.secondary }]}
          onPress={handleFingerprintLogin}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>Login with Biometric</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleLogin}>
          <Ionicons name="logo-google" size={20} color="#4285F4" style={styles.socialIcon} />
          <Text style={styles.socialText}>Login with Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialBtn} onPress={handleAppleLogin}>
          <Ionicons name="logo-apple" size={20} color="#000" style={styles.socialIcon} />
          <Text style={styles.socialText}>Login with Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Signup")}
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
            
            {fingerprintStatus === "fail" && (
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setShowFingerprintModal(false)}
              >
                <Text style={styles.modalBtnText}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background, 
    padding: 24 
  },
  backBtn: { 
    position: "absolute", 
    top: 50, 
    left: 24, 
    zIndex: 2 
  },
  formBox: { 
    marginTop: 80 
  },
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
    color: Colors.secondary,
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  loginBtnText: { 
    color: "white", 
    fontWeight: "bold",
    fontSize: 16,
  },
  dividerRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 18 
  },
  divider: { 
    flex: 1, 
    height: 1, 
    backgroundColor: "#ddd" 
  },
  orText: { 
    marginHorizontal: 10, 
    color: Colors.secondary 
  },
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
  socialIcon: { 
    marginRight: 10 
  },
  socialText: { 
    color: Colors.secondary,
    fontSize: 16,
  },
  footer: { 
    alignItems: "center", 
    marginTop: 20 
  },
  footerText: { 
    color: Colors.secondary 
  },
  link: { 
    color: Colors.primary, 
    fontWeight: "bold" 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  modalText: { 
    color: Colors.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
  modalBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalBtnText: {
    color: "white",
    fontWeight: "bold",
  },
});