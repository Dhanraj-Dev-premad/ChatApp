
import React, { useState, useRef } from 'react';

import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  getAuth,
  signInWithPhoneNumber,
} from '@react-native-firebase/auth';

const LoginDemo = () => {
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');

  // Prevent multiple OTP requests at the same time
  const isSendingOtp = useRef(false);

  console.log('[LoginDemo] Component rendered');

  // Send OTP
  const handleSignInWithPhoneNumber = async (
    phoneNumber: string,
  ) => {
    // Stop if an OTP request is already running
    if (isSendingOtp.current) {
      console.log('[OTP] Request already in progress');
      return;
    }

    // Lock before starting the request
    isSendingOtp.current = true;

    console.log('[OTP] Sign-in button pressed');
    console.log('[Firebase] Requesting OTP...');

    // try {
    //   const confirmation = await signInWithPhoneNumber(
    //     getAuth(),
    //     phoneNumber,
    //   );

    //   console.log('[Firebase] OTP sent successfully');

    //   setConfirm(confirmation);

    //   console.log('[React] Confirmation object saved');
    // } catch (error: any) {
    //   console.log('[Firebase Error] Code:', error.code);
    //   console.log('[Firebase Error] Message:', error.message);
    // } finally {
    //   // Unlock after success or failure
    //   isSendingOtp.current = false;

    //   console.log('[OTP] Send OTP function completed');
    // }

    try {
  console.log('[Firebase] Calling signInWithPhoneNumber...');

  const confirmation = await signInWithPhoneNumber(
    getAuth(),
    phoneNumber,
  );

  console.log('[Firebase] OTP sent successfully');

  setConfirm(confirmation);
} catch (error: any) {
  console.log('[Firebase Error] Code:', error.code);
  console.log('[Firebase Error] Message:', error.message);
} finally {
  isSendingOtp.current = false;
  console.log('[OTP] Send OTP function completed');
}



  };

  // Verify OTP
  const confirmCode = async () => {
    console.log('[OTP] Confirm button pressed');

    if (!confirm) {
      console.log('[Validation] Confirmation object not found');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      console.log(
        '[Validation] Please enter a valid 6-digit OTP',
      );
      return;
    }

    try {
      console.log('[Firebase] Verifying OTP...');

      const result = await confirm.confirm(code);

      console.log('[Firebase] OTP verified successfully');
      console.log('[Firebase] User UID:', result.user.uid);
      console.log(
        '[Firebase] Phone number:',
        result.user.phoneNumber,
      );
    } catch (error: any) {
      console.log('[OTP Error] Code:', error.code);
      console.log('[OTP Error] Message:', error.message);
    }

    console.log('[OTP] Verification function completed');
  };

  // Phone number screen
  if (!confirm) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Firebase Phone Login
        </Text>

        <Text style={styles.subtitle}>
          Sign in using your phone number
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() =>
            handleSignInWithPhoneNumber('+916367412579')
          }
        >
          <Text style={styles.buttonText}>
            Phone Number Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // OTP verification screen
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Verify Your Phone
      </Text>

      <Text style={styles.subtitle}>
        Enter the 6-digit verification code
      </Text>

      <TextInput
        value={code}
        onChangeText={text => {
          setCode(text.replace(/\D/g, '').slice(0, 6));
          console.log('[Input] OTP input changed');
        }}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="Enter OTP"
        placeholderTextColor="#888888"
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={confirmCode}
      >
        <Text style={styles.buttonText}>
          Confirm Code
        </Text>
      </TouchableOpacity>

      <Button
        title="Back"
        onPress={() => {
          console.log('[Navigation] Returning to phone login');

          setConfirm(null);
          setCode('');
        }}
      />
    </View>
  );
};

export default LoginDemo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F7FB',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0857A0',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 25,
    textAlign: 'center',
  },

  loginButton: {
    width: 280,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0857A0',
    borderRadius: 10,
    marginBottom: 20,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  input: {
    width: 280,
    height: 55,
    borderWidth: 1,
    borderColor: '#0857A0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 20,
    color: '#222222',
    textAlign: 'center',
    letterSpacing: 6,
  },
});

















// import React, {useState} from 'react';

// import {
//   Button,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import {
//   getAuth,
//   signInWithPhoneNumber,
// } from '@react-native-firebase/auth';

// const LoginDemo = () => {
//   const [confirm, setConfirm] = useState<any>(null);
//   const [code, setCode] = useState('');

//   console.log('[LoginDemo] Component rendered');

//   // Send OTP
//   const handleSignInWithPhoneNumber = async (phoneNumber: string) => {
//     console.log('[OTP] Sign-in button pressed');
//     console.log('[Firebase] Requesting OTP...');

//     try {
//       const confirmation = await signInWithPhoneNumber(
//         getAuth(),
//         phoneNumber,
//       );

//       console.log('[Firebase] OTP sent successfully');

//       setConfirm(confirmation);

//       console.log('[React] Confirmation object saved');
//     } catch (error: any) {
//       console.log('[Firebase Error] Code:', error.code);
//       console.log('[Firebase Error] Message:', error.message);
//     }

//     console.log('[OTP] Send OTP function completed');
//   };

//   // Verify OTP
//   const confirmCode = async () => {
//     console.log('[OTP] Confirm button pressed');

//     if (!confirm) {
//       console.log('[Validation] Confirmation object not found');
//       return;
//     }

//     if (!/^\d{6}$/.test(code)) {
//       console.log('[Validation] Please enter a valid 6-digit OTP');
//       return;
//     }

//     try {
//       console.log('[Firebase] Verifying OTP...');

//       const result = await confirm.confirm(code);

//       console.log('[Firebase] OTP verified successfully');
//       console.log('[Firebase] User UID:', result.user.uid);
//       console.log(
//         '[Firebase] Phone number:',
//         result.user.phoneNumber,
//       );
//     } catch (error: any) {
//       console.log('[OTP Error] Code:', error.code);
//       console.log('[OTP Error] Message:', error.message);
//     }

//     console.log('[OTP] Verification function completed');
//   };

//   // Phone number screen
//   if (!confirm) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Firebase Phone Login</Text>

//         <Text style={styles.subtitle}>
//           Sign in using your phone number
//         </Text>

//         <TouchableOpacity
//           style={styles.loginButton}
//           onPress={() =>
//             handleSignInWithPhoneNumber('+916367412579')
//           }>
//           <Text style={styles.buttonText}>
//             Phone Number Sign In
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // OTP verification screen
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Verify Your Phone</Text>

//       <Text style={styles.subtitle}>
//         Enter the 6-digit verification code
//       </Text>

//       <TextInput
//         value={code}
//         onChangeText={text => {
//           setCode(text.replace(/\D/g, '').slice(0, 6));
//           console.log('[Input] OTP input changed');
//         }}
//         keyboardType="number-pad"
//         maxLength={6}
//         placeholder="Enter OTP"
//         placeholderTextColor="#888888"
//         style={styles.input}
//       />

//       <TouchableOpacity
//         style={styles.loginButton}
//         onPress={confirmCode}>
//         <Text style={styles.buttonText}>Confirm Code</Text>
//       </TouchableOpacity>

//       <Button
//         title="Back"
//         onPress={() => {
//           console.log('[Navigation] Returning to phone login');
//           setConfirm(null);
//           setCode('');
//         }}
//       />
//     </View>
//   );
// };

// export default LoginDemo;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//     backgroundColor: '#F5F7FB',
//   },

//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#0857A0',
//     marginBottom: 10,
//   },

//   subtitle: {
//     fontSize: 15,
//     color: '#555555',
//     marginBottom: 25,
//     textAlign: 'center',
//   },

//   loginButton: {
//     width: 280,
//     height: 52,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#0857A0',
//     borderRadius: 10,
//     marginBottom: 20,
//   },

//   buttonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },

//   input: {
//     width: 280,
//     height: 55,
//     borderWidth: 1,
//     borderColor: '#0857A0',
//     borderRadius: 10,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     fontSize: 20,
//     color: '#222222',
//     textAlign: 'center',
//     letterSpacing: 6,
//   },
// });






