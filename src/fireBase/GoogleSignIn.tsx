import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  GoogleOneTapSignIn,
  isSuccessResponse,
  isNoSavedCredentialFoundResponse,
} from 'react-native-nitro-google-signin';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';

// Configure Google Sign-In before using any sign-in method
GoogleOneTapSignIn.configure({
  webClientId: 'autoDetect',
});

const GoogleSignIn = () => {
  console.log('entered in Google sign in ');
  
  const signIn = async () => {
    try {
      await GoogleOneTapSignIn.checkPlayServices();

      let response = await GoogleOneTapSignIn.signIn();

      if (isNoSavedCredentialFoundResponse(response)) {
        response = await GoogleOneTapSignIn.createAccount();
      }

      if (isNoSavedCredentialFoundResponse(response)) {
        response = await GoogleOneTapSignIn.presentExplicitSignIn();
      }

      if (isSuccessResponse(response)) {
        const { user, idToken } = response.data;

        if (!idToken) {
          throw new Error('Google ID token not found');
        }

        // Create Firebase credential using Google ID token
         console.log(" entered in googleCredential");
        const googleCredential =
       
        
          GoogleAuthProvider.credential(idToken);

        // Sign in to Firebase
        const firebaseResult = await signInWithCredential(
          getAuth(),
          googleCredential,
        );
         console.log(" existed in googleCredential");


        // Firebase authenticated user
        const firebaseUser = firebaseResult.user;

        console.log('Firebase UID:', firebaseUser.uid);
        console.log('Firebase Email:', firebaseUser.email);
        console.log('Firebase Name:', firebaseUser.displayName);
        console.log('Google User:', user);

        console.log('Firebase Google sign-in successful!');
      } else {
        console.log('Google sign-in was cancelled or did not complete.');
      }
    } catch (error) {
      console.log('Google/Firebase Sign-In Error:', error.code, error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleSignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});





