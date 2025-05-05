import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgetPassword from './ForgetPassword';
import Profile from './Profile';
import acceuilScreen from './acceuilScreen';
import ListOfOffers from './ListOfOffers';
import MyProject from './MyProject';
import Claim from './Claim';
import Invoices from './Invoices';
import Inbox from './Inbox';
import SplashScreen from './SplashScreen';
import ProfilClient from './ProfilClient';
import ProfilClient from "../ProfilClient";
import projectlist from "../projectlist";
import Freelancers from '../Freelancers';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
            

      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgetPassword}/>
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name="acceuilScreen" component={acceuilScreen}/>
      <Stack.Screen name="ListOfOffers" component={ListOfOffers} />
      <Stack.Screen name="MyProject" component={MyProject} />
      <Stack.Screen name="Claim" component={Claim} />
      <Stack.Screen name="Invoices" component={Invoices} />
      <Stack.Screen name="Inbox" component={Inbox} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="ProfilClient"component={ProfilClient}/>
      <Stack.Screen name="ProjectManagement"component={ProjectManagement}/>
      <Stack.Screen name="projectlist"component={projectlist}/>
      <Stack.Screen name="Freelancers" component={Freelancers} />
    </Stack.Navigator>
  );
};

export default AppNavigator;