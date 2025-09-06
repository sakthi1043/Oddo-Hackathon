import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";

// Save user to storage
export const registerUser = async (displayName, email, password) => {
  const existingUser = await AsyncStorage.getItem(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = { displayName, email, password: hashedPassword };

  await AsyncStorage.setItem(email, JSON.stringify(userData));
  return userData;
};

// Validate login
export const loginUser = async (email, password) => {
  const userData = await AsyncStorage.getItem(email);
  if (!userData) {
    throw new Error("User not found");
  }

  const parsedUser = JSON.parse(userData);
  const isPasswordValid = await bcrypt.compare(password, parsedUser.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return parsedUser;
};
