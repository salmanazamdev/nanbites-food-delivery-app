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
        // Save credentials for biometric login
        await AsyncStorage.setItem("userEmail", email);
        await AsyncStorage.setItem("userPassword", password);
        await AsyncStorage.setItem("hasLaunched", "true"); // skip onboarding next time

        // Ask user if they want to enable biometrics now
        const rnBiometrics = new ReactNativeBiometrics();
        rnBiometrics
          .simplePrompt({ promptMessage: "Enable Biometric Login?" })
          .then((resultObject) => {
            const { success } = resultObject;
            if (success) {
              Alert.alert("Success", "Biometric login has been enabled!");
            } else {
              Alert.alert("Notice", "You can enable biometrics later in settings.");
            }
          })
          .catch(() => {
            console.log("Biometric setup skipped");
          });

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

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Social login buttons (future Supabase OAuth) */}
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
});
