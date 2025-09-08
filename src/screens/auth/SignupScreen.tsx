import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/utils/constants/colors';

const SignupScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup Screen</Text>
      <Text style={styles.subtitle}>Coming Soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
  },
});

export default SignupScreen;