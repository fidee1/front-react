import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgetPassword from './ForgetPassword';
import Profile from './Profile';
import acceuilScreen from './acceuilScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
            

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgetPassword}/>
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name="acceuilScreen" component={acceuilScreen}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;