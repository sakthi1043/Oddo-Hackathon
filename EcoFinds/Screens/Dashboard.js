import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Dashboard({ route }) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user.displayName} 🎉</Text>
      <Text style={styles.email}>Email: {user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  welcome: { fontSize: 24, color: "white", fontWeight: "bold" },
  email: { fontSize: 16, color: "lightgray", marginTop: 10 },
});
