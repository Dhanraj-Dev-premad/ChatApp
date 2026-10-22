
import React, { useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from '@react-native-firebase/firestore';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Validation', 'Please enter email and password.');
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore();

      // Find the user using their email.
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', email.trim()),
      );

      const snapshot = await getDocs(usersQuery);

      if (snapshot.empty) {
        Alert.alert('Login Failed', 'User not found.');
        return;
      }

      const userDocument = snapshot.docs[0];
      const userData = userDocument.data();

      // Check the password.
      if (userData.password !== password) {
        Alert.alert('Login Failed', 'Incorrect password.');
        return;
      }

      // Prepare the data to save locally.
      const loggedInUser = {
        userId: userDocument.id,
        email: userData.email,
      };

      // Save the user in AsyncStorage.
      await AsyncStorage.setItem(
        'loggedInUser',
        JSON.stringify(loggedInUser),
      );

      

      console.log('Login successful:', loggedInUser);

      Alert.alert('Success', 'Login successful!');

      // Navigate to Main.
      navigation.replace('Main', {
        userId: userDocument.id,
      });
    } catch (error) {
      console.log('Firestore login error:', error);

      Alert.alert(
        'Error',
        'Unable to check user details. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.TextContainer}>
        <TextInput
          placeholder="Enter Email"
          placeholderTextColor="gray"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          placeholder="Enter Password"
          placeholderTextColor="gray"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, loading && styles.disabledBtn]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? 'Checking...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <Pressable
        onPress={() => navigation.navigate('SignUpScreen')}
      >
        <Text style={styles.orLogin}>Or SignUp</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  title: {
    fontSize: 30,
    color: 'purple',
    alignSelf: 'center',
    marginTop: 50,
    fontWeight: 'bold',
  },

  TextContainer: {
    gap: 20,
    marginTop: 50,
  },

  input: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    borderRadius: 11,
    borderColor: 'gray',
    alignSelf: 'center',
    paddingLeft: 20,
    color: 'black',
  },

  btn: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    marginTop: 50,
    backgroundColor: 'purple',
  },

  disabledBtn: {
    opacity: 0.6,
  },

  btnText: {
    color: 'white',
    fontSize: 18,
  },

  orLogin: {
    alignSelf: 'center',
    marginTop: 30,
    fontSize: 20,
    textDecorationLine: 'underline',
    fontWeight: '600',
    color: 'purple',
    opacity: 0.6,
  },
});









// import React, { useState } from 'react';

// import {
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Alert,
// } from 'react-native';

// import { useNavigation } from '@react-navigation/native';

// import {
//   getFirestore,
//   collection,
//   getDocs,
//   query,
//   where,
// } from '@react-native-firebase/firestore';

// const LoginScreen = () => {
//   const navigation = useNavigation();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email.trim() || !password) {
//       Alert.alert('Validation', 'Please enter email and password.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const db = getFirestore();

//       // Find the user document with the entered email
//       const usersQuery = query(
//         collection(db, 'users'),
//         where('email', '==', email.trim()),
//       );

//       const snapshot = await getDocs(usersQuery);

//       if (snapshot.empty) {
//         Alert.alert('Login Failed', 'User not found.');
//         return;
//       }

//       const userDocument = snapshot.docs[0];
//       const userData = userDocument.data();

      
//       if (userData.password !== password) {
//         Alert.alert('Login Failed', 'Incorrect password.');
//         return;
//       }

//       console.log('Login successful:', userDocument.id);
//       console.log('User data:', userData);

//       Alert.alert('Success', 'Login successful!');

//       // Replace with your actual destination route if needed.
//        navigation.replace('Main', {
//          userId: userDocument.id,
//        });
//     } catch (error) {
//       console.log('Firestore login error:', error);

//       Alert.alert('Error', 'Unable to check user details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <View style={styles.TextContainer}>
//         <TextInput
//           placeholder="Enter Email"
//           placeholderTextColor="gray"
//           style={styles.input}
//           onChangeText={setEmail}
//           value={email}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           autoCorrect={false}
//         />

//         <TextInput
//           placeholder="Enter Password"
//           placeholderTextColor="gray"
//           style={styles.input}
//           onChangeText={setPassword}
//           value={password}
//           secureTextEntry
//         />
//       </View>

//       <TouchableOpacity
//         style={styles.btn}
//         onPress={handleLogin}
//         disabled={loading}
        
//       >
//         <Text style={styles.btnText}>
//           {loading ? 'Checking...' : 'Login'}
//         </Text>
//       </TouchableOpacity>

//       <Pressable onPress={() => navigation.navigate('SignUpScreen')}>
//         <Text style={styles.orLogin}>Or SignUp</Text>
//       </Pressable>
//     </View>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   title: {
//     fontSize: 30,
//     color: 'purple',
//     alignSelf: 'center',
//     marginTop: 50,
//     fontWeight: 'bold',
//   },
//   TextContainer: {
//     gap: 20,
//     marginTop: 50,
//   },
//   input: {
//     width: '90%',
//     height: 50,
//     borderWidth: 0.5,
//     borderRadius: 11,
//     borderColor: 'gray',
//     alignSelf: 'center',
//     paddingLeft: 20,
//     color: 'black',
//   },
//   btn: {
//     width: '90%',
//     height: 50,
//     alignSelf: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 11,
//     marginTop: 50,
//     backgroundColor: 'purple',
//   },
//   btnText: {
//     color: 'white',
//     fontSize: 18,
//   },
//   orLogin: {
//     alignSelf: 'center',
//     marginTop: 30,
//     fontSize: 20,
//     textDecorationLine: 'underline',
//     fontWeight: '600',
//     color: 'purple',
//     opacity: 0.6,
//   },
// });






















