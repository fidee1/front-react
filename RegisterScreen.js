import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Animated,
  Easing,
  Picker,
} from "react-native";
import Toast from "react-native-toast-message";
import api from "./api";
import Icon from "react-native-vector-icons/FontAwesome";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState(""); // Modification ici
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const showToast = (type, message) => {
    Toast.show({ type, text1: message, position: "top", visibilityTime: 3000 });
  };

  const handleRegister = async () => {
    if (!name || !lastName || !email || !password || !confirmPassword || !role) { // Utilisation de name
      showToast("error", "Please fill in all fields");
      return;
    }
  
    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }
  
    setLoading(true);
    try {
      const response = await api.post("/register", {
        name, // Modification ici
        lastName,
        email,
        password,
        role,
      });
  
      showToast("success", "Registration successful! You can now log in.");
      setTimeout(() => navigation.navigate("LoginScreen"), 1500);
    } catch (error) {
      let errorMessage = "Registration failed";
      if (error.response) {
        errorMessage = error.response.data.error || error.response.statusText;
      }
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.logoContainer}>
        <Icon name="user-plus" size={50} color="#0000FF" />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Welcome to our application</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.card}>
        <View style={styles.inputWrapper}>
          <Icon name="user" size={18} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Name" // Modification ici
            placeholderTextColor="#AAA"
            value={name} // Modification ici
            onChangeText={setName} // Modification ici
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="user" size={18} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#AAA"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="envelope" size={18} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#AAA"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="lock" size={18} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#AAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="lock" size={18} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#AAA"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Role Selection */}
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={role}
            style={[styles.input, { paddingVertical: 0 }]}
            onValueChange={(itemValue) => setRole(itemValue)}
            dropdownIconColor="#888"
          >
            <Picker.Item label="Select your role" value="" enabled={false} />
            <Picker.Item label="Freelancer" value="freelancer" />
            <Picker.Item label="Client" value="client" />
          </Picker>
        </View>

        {/* Register Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.registerText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Already have an account */}
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "#0000FF",
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#0000FF",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    alignSelf: "center",
  },
  linkText: {
    color: "#0000FF",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
