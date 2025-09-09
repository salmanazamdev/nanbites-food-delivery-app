// src/screens/auth/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useAuth } from '../../context/AuthContext';
import Colors from '@/utils/constants/colors';

type RootStackParamList = {
  SignupScreen: undefined;
  Main: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBiometricLogin();
  }, []);

  // Try biometric login if credentials are stored
  const checkBiometricLogin = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const storedEmail = await AsyncStorage.getItem('userEmail');
    const storedPassword = await AsyncStorage.getItem('userPassword');

    if (storedEmail && storedPassword) {
      rnBiometrics
        .simplePrompt({ promptMessage: 'Login with Biometrics' })
        .then(async (resultObject) => {
          const { success } = resultObject;
          if (success) {
            const { error } = await signIn(storedEmail, storedPassword);
            if (!error) {
              await AsyncStorage.setItem('hasLaunched', 'true');
            }
          }
        })
        .catch(() => {
          console.log('Biometric auth cancelled or failed');
        });
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);

      if (error) {
        Alert.alert('Login Failed', error.message);
      } else {
        // Save credentials for biometric login
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);

        // Mark that user has completed onboarding
        await AsyncStorage.setItem('hasLaunched', 'true');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
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

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={require('@/assets/images/onboarding/google.png')}
            style={styles.icon}
          />
          <Text style={styles.socialText}>Login with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={require('@/assets/images/onboarding/apple.png')}
            style={styles.icon}
          />
          <Text style={styles.socialText}>Login with Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('SignupScreen')}>
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  backBtn: { position: 'absolute', top: 50, left: 24, zIndex: 2 },
  formBox: { marginTop: 80 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginBottom: 20 },
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
    alignItems: 'center',
    marginTop: 20,
  },
  disabledBtn: { backgroundColor: Colors.secondary, opacity: 0.6 },
  loginBtnText: { color: 'white', fontWeight: 'bold' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: '#ddd' },
  orText: { marginHorizontal: 10, color: Colors.secondary },
  socialBtn: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: { width: 20, height: 20, marginRight: 10 },
  socialText: { color: Colors.secondary },
  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { color: Colors.secondary },
  link: { color: Colors.primary, fontWeight: 'bold' },
});
