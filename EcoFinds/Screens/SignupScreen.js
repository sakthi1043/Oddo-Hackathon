import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";

export default function SignupScreen({ navigation }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !displayName) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const existingUser = await AsyncStorage.getItem(email);
      if (existingUser) {
        Alert.alert("Error", "User already exists");
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = { displayName, email, password: hashedPassword };

      await AsyncStorage.setItem(email, JSON.stringify(userData));
      Alert.alert("Success", "Account created! Please login.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Display Name" value={displayName} onChangeText={setDisplayName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#121212" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "white" },
  input: { backgroundColor: "#1e1e1e", color: "white", padding: 12, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  link: { marginTop: 15, textAlign: "center", color: "#4CAF50" },
});
