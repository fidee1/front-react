import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Keyboard, 
  Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisibility1, setPasswordVisibility1] = useState(false);
  const [passwordVisibility2, setPasswordVisibility2] = useState(false);

  const handleResetPassword = () => {
    console.log('Reset Password Button Pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>

        <View style={styles.iconContainer}>
          <Icon name="lock-reset" size={40} color="#FFFFFF" />
        </View>

        <Text style={styles.subtitle}>Let's secure your account</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
          />
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!passwordVisibility1}
            />
            <TouchableOpacity 
              onPress={() => setPasswordVisibility1(!passwordVisibility1)}
            >
              <Icon 
                name={passwordVisibility1 ? "visibility" : "visibility-off"} 
                size={22} 
                color="#161C24" 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!passwordVisibility2}
            />
            <TouchableOpacity 
              onPress={() => setPasswordVisibility2(!passwordVisibility2)}
            >
              <Icon 
                name={passwordVisibility2 ? "visibility" : "visibility-off"} 
                size={22} 
                color="#161C24" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleResetPassword}
        >
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>

        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5F9',
  },
  scrollViewContent: {
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4C0B67BC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#161C24',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  input: {
    height: 50,
    borderColor: '#E0E3E7',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E0E3E7',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#2797FF',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#161C24',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2797FF',
  },
});

export default ForgetPasswordScreen;
