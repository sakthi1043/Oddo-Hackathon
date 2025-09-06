import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const userData = await AsyncStorage.getItem(email);
      if (!userData) {
        Alert.alert("Error", "User not found");
        return;
      }

      const parsedUser = JSON.parse(userData);
      const isPasswordValid = await bcrypt.compare(password, parsedUser.password);

      if (isPasswordValid) {
        Alert.alert("Success", "Login successful");
        navigation.replace("Dashboard", { user: parsedUser });
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
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
