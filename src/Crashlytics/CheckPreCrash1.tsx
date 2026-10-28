
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  getCrashlytics,
  didCrashOnPreviousExecution,
  log,
  setUserId,
  setAttribute,
  setAttributes,
  crash,
} from '@react-native-firebase/crashlytics';

const CheckPreCrash1 = () => {
  const [crashStatus, setCrashStatus] = useState(
    'Checking previous crash...',
  );

  const crashlytics = getCrashlytics();

  // CONCEPT 1: Check whether the previous app session crashed
  useEffect(() => {
    const checkPreviousCrash = async () => {
      try {
        const didCrash = await didCrashOnPreviousExecution(
          crashlytics,
        );

        if (didCrash) {
          console.log('Previous session crashed!');
          setCrashStatus('Previous session crashed!');
          log(crashlytics, 'Previous session crash detected.');
        } else {
          console.log('No previous crash detected.');
          setCrashStatus('No previous crash detected.');
        }
      } catch (error) {
        console.error('Crash check failed:', error);
        setCrashStatus('Unable to check previous crash.');
      }
    };

    log(crashlytics, 'Crashlytics screen mounted.');
    checkPreviousCrash();
  }, [crashlytics]);

  // CONCEPT 2: Add user information to future crash reports
  const handleSignIn = async () => {
    try {
      const user = {
        uid: 'test-user-123',
        username: 'Test User',
        email: 'test@example.com',
        credits: 42,
      };

      log(crashlytics, 'User signed in.');

      await Promise.all([
        setUserId(crashlytics, user.uid),

        setAttribute(
          crashlytics,
          'credits',
          String(user.credits),
        ),

        setAttributes(crashlytics, {
          role: 'admin',
          username: user.username,
          email: user.email,
        }),
      ]);

      Alert.alert(
        'Success',
        'User information added to Crashlytics.',
      );
    } catch (error) {
      console.error('Failed to set Crashlytics user info:', error);

      Alert.alert(
        'Error',
        'Unable to save Crashlytics user information.',
      );
    }
  };

  // CONCEPT 3: Force a crash for testing
  const handleTestCrash = () => {
    log(crashlytics, 'User pressed the Test Crash button.');
    crash(crashlytics);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NextIn Chat App</Text>

      <Text style={styles.heading}>Previous Crash Status</Text>

      <Text style={styles.status}>{crashStatus}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Set Test User"
          onPress={handleSignIn}
        />

        <Button
          title="Test Crash"
          color="red"
          onPress={handleTestCrash}
        />
      </View>

      <Text style={styles.note}>
        Tap Test Crash to force the app to crash.
        Reopen the app to check the previous crash status.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0857A0',
    marginBottom: 24,
  },

  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333333',
  },

  status: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
  },

  buttonContainer: {
    width: '100%',
    gap: 20,
  },

  note: {
    marginTop: 25,
    fontSize: 14,
    textAlign: 'center',
    color: '#555555',
  },
});

export default CheckPreCrash1;

















// import React, {useEffect, useState} from 'react';
// import {View, Text, StyleSheet} from 'react-native';

// import {
//   getCrashlytics,
//   didCrashOnPreviousExecution,
// } from '@react-native-firebase/crashlytics';

// const CheckPreCrash1 = () => {
//   const [crashStatus, setCrashStatus] = useState('Checking previous crash...');

//   useEffect(() => {
//     const checkPreviousCrash = async () => {
//       try {
//         const crashlytics = getCrashlytics();

//         const didCrash = await didCrashOnPreviousExecution(crashlytics);

//         if (didCrash) {
//           console.log('Previous session crashed!');
//           setCrashStatus('Previous session crashed!');
//         } else {
//           console.log('No previous crash detected.');
//           setCrashStatus('No previous crash detected.');
//         }
//       } catch (error) {
//         console.error('Crash check failed:', error);
//         setCrashStatus('Unable to check previous crash.');
//       }
//     };

//     checkPreviousCrash();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>NextIn Chat App</Text>
//       <Text style={styles.status}>{crashStatus}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#F5F7FA',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#0857A0',
//     marginBottom: 16,
//   },
//   status: {
//     fontSize: 16,
//     color: '#333333',
//     textAlign: 'center',
//   },
// });

// export default CheckPreCrash1;
