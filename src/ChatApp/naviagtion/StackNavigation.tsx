import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Component Imports
import Splash from '../screen/Splash';
import SignUpScreen from '../screen/SignUpScreen';
import LoginScreen from '../screen/LoginScreen';
import Main from '../screen/Main';
import Settings from '../screen/Settings';
import Users from '../screen/Users';
import Chats from '../screen/Chats';


// 1. Correct function name is createNativeStackNavigator (or createStackNavigator)
// 2. Component names should always use PascalCase (Stack instead of stack)
const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Splash" 
        component={Splash} 
        options={{ headerShown: false }} 
      />
    
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
        <Stack.Screen 
        name="SignUpScreen" 
        component={SignUpScreen} 
        options={{ headerShown: false }} 
      />
       <Stack.Screen 
        name="Main" 
        component={Main} 
        options={{ headerShown: false }} 
      />
       <Stack.Screen 
        name="Settings" 
        component={Settings} 
        options={{ headerShown: false }} 
      />
       <Stack.Screen 
        name="Users" 
        component={Users} 
        options={{ headerShown: false }} 
      />
       <Stack.Screen 
        name="Chats" 
        component={Chats} 
        options={{ headerShown: true }} 
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
