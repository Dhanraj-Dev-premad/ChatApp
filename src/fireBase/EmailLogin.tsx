import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';


const EmailLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = () => {
    console.log('Email value:', email);
    console.log('Password value:', password);
  };

  const signinWithEmail =async ()=>
  {
     try {
    const userCredential = await signInWithEmailAndPassword(
      getAuth(),
      email.trim(),
      password
    );
    console.log("signinCredential", userCredential);
    

    console.log(
      'User registered successfully:',
      userCredential.user.email
    );
  } catch (error) {
    console.log('Registration error:', error.code, error.message);
  }
    
  }



  const registerWithEmail = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      getAuth(),
      email.trim(),
      password
    );
    console.log("signinCredential", userCredential);
    

    console.log(
      'User registered successfully:',
      userCredential.user.email
    );
  } catch (error) {
    console.log('Registration error:', error.code, error.message);
  }
};

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor="black"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          height: 50,
          width: 200,
          borderWidth: 1,
          borderColor: 'gray',
          color: 'black',
        }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor="black"
        secureTextEntry
        style={{
          height: 50,
          width: 200,
          borderWidth: 1,
          borderColor: 'gray',
          color: 'black',
        }}
      />

      <Button
        onPress={registerWithEmail}
        title="Email sign up"
      />
      <Button
        onPress={signinWithEmail}
        title="Email Sign in"
      />
    </View>



  );
};

export default EmailLogin;

const styles = StyleSheet.create({});