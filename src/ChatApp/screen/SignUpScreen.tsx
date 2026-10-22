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

import { useNavigation } from '@react-navigation/native';

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from '@react-native-firebase/firestore';

const SignUpScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phoneNo.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Validation', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore();
      const usersRef = collection(db, 'users');

      // Check whether the email is already in the collection
      const emailQuery = query(
        usersRef,
        where('email', '==', email.trim()),
      );

      const existingUsers = await getDocs(emailQuery);

      if (!existingUsers.empty) {
        Alert.alert(
          'Account Exists',
          'This email is already registered.',
        );
        return;
      }

     
      const userData = {
        name: name.trim(),
        email: email.trim(),
        phoneNo: phoneNo.trim(),
        password: password,
      };

      const userRef = await addDoc(usersRef, userData);
      await updateDoc(userRef, { userId: userRef.id });

      console.log('User saved with document ID:', userRef.id);

      Alert.alert('Success', 'Your details have been saved.');

      navigation.navigate('LoginScreen');

     
      setName('');
      setEmail('');
      setPhoneNo('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.log('Signup error:', error);

      Alert.alert('Error', 'Unable to save your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SignUp</Text>

      <View style={styles.TextContainer}>
        <TextInput
          placeholder="Enter Name"
          placeholderTextColor="gray"
          style={styles.input}
          onChangeText={setName}
          value={name}
        />

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
          placeholder="Enter Phone No"
          placeholderTextColor="gray"
          style={styles.input}
          onChangeText={setPhoneNo}
          value={phoneNo}
          keyboardType="phone-pad"
        />

        <TextInput
          placeholder="Enter Password"
          placeholderTextColor="gray"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, loading && styles.disabledBtn]}
        onPress={registerUser}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? 'Saving...' : 'SignUp'}
        </Text>
      </TouchableOpacity>

      <Pressable onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.orLogin}>Or Login</Text>
      </Pressable>
    </View>
  );
};

export default SignUpScreen;

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
//   getAuth,
//   createUserWithEmailAndPassword,
// } from '@react-native-firebase/auth';

// import {
//   getFirestore,
//   doc,
//   setDoc,
// } from '@react-native-firebase/firestore';

// const SignUpScreen = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNo, setPhoneNo] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigation = useNavigation();

//   const registerUser = async () => {
//     if (
//       !name.trim() ||
//       !email.trim() ||
//       !phoneNo.trim() ||
//       !password ||
//       !confirmPassword
//     ) {
//       Alert.alert('Validation', 'Please fill in all fields.');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Validation', 'Passwords do not match.');
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert(
//         'Validation',
//         'Password must contain at least 6 characters.',
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       // Step 1: Create the Firebase Authentication account
//       const userCredential = await createUserWithEmailAndPassword(
//         getAuth(),
//         email.trim(),
//         password,
//       );

//       const user = userCredential.user;

//       // Step 2: Save profile information in Firestore
//       const db = getFirestore();

//       await setDoc(doc(db, 'users', user.uid), {
//         name: name.trim(),
//         email: user.email,
//         phoneNo: phoneNo.trim(),
//         userId: user.uid,
//       });

//       Alert.alert('Success', 'Account created successfully!');

//       // Replace with your actual destination route if required.
//       // navigation.replace('HomeScreen');
//     } catch (error) {
//       console.log('Registration error:', error.code, error.message);

//       Alert.alert(
//         'Registration Failed',
//         error.code === 'auth/email-already-in-use'
//           ? 'This email is already registered. Please log in.'
//           : error.message || 'Something went wrong.',
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>SignUp</Text>

//       <View style={styles.TextContainer}>
//         <TextInput
//           placeholder="Enter Name"
//           placeholderTextColor="gray"
//           style={styles.input}
//           onChangeText={setName}
//           value={name}
//         />

//         <TextInput
//           placeholder="Enter Email"
//           placeholderTextColor="gray"
//           style={styles.input}
//           onChangeText={setEmail}
//           value={email}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <TextInput
//           placeholder="Enter Phone No"
//           placeholderTextColor="gray"
//           keyboardType="phone-pad"
//           style={styles.input}
//           onChangeText={setPhoneNo}
//           value={phoneNo}
//         />

//         <TextInput
//           placeholder="Enter Password"
//           placeholderTextColor="gray"
//           style={styles.input}
//           onChangeText={setPassword}
//           value={password}
//           secureTextEntry
//         />

//         <TextInput
//           placeholder="Confirm Password"
//           placeholderTextColor="gray"
//           style={styles.input}
//           onChangeText={setConfirmPassword}
//           value={confirmPassword}
//           secureTextEntry
//         />
//       </View>

//       <TouchableOpacity
//         style={[styles.btn, loading && styles.disabledBtn]}
//         onPress={registerUser}
//         disabled={loading}
//       >
//         <Text style={styles.btnText}>
//           {loading ? 'Creating Account...' : 'SignUp'}
//         </Text>
//       </TouchableOpacity>

//       <Pressable
//         onPress={() => navigation.navigate('LoginScreen')}
//       >
//         <Text style={styles.orLogin}>Or Login</Text>
//       </Pressable>
//     </View>
//   );
// };

// export default SignUpScreen;

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
//   disabledBtn: {
//     opacity: 0.6,
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

























// import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
// import React, { useState } from 'react';
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from '@react-native-firebase/auth';


// const SignUpScreen = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleEmailLogin = () => {
//     console.log('Email value:', email);
//     console.log('Password value:', password);
//   };

//   const SignUp =async ()=>
//   {
//      try {
//     const userCredential = await signInWithEmailAndPassword(
//       getAuth(),
//       email.trim(),
//       password
//     );
//     console.log("signinCredential", userCredential);
    

//     console.log(
//       'User registered successfully:',
//       userCredential.user.email
//     );
//   } catch (error) {
//     console.log('Registration error:', error.code, error.message);
//   }
    
//   }



//   const registerWithEmail = async () => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       getAuth(),
//       email.trim(),
//       password
//     );
//     console.log("signinCredential", userCredential);
    

//     console.log(
//       'User registered successfully:',
//       userCredential.user.email
//     );
//   } catch (error) {
//     console.log('Registration error:', error.code, error.message);
//   }
// };

//   return (
//     <View
//       style={{
//         flex: 1,
//         padding: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 20,
//       }}
//     >
//       <TextInput
//         value={email}
//         onChangeText={setEmail}
//         placeholder="Enter your email"
//         placeholderTextColor="black"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         style={{
//           height: 50,
//           width: 200,
//           borderWidth: 1,
//           borderColor: 'gray',
//           color: 'black',
//         }}
//       />

//       <TextInput
//         value={password}
//         onChangeText={setPassword}
//         placeholder="Enter your password"
//         placeholderTextColor="black"
//         secureTextEntry
//         style={{
//           height: 50,
//           width: 200,
//           borderWidth: 1,
//           borderColor: 'gray',
//           color: 'black',
//         }}
//       />

//       <Button
//         onPress={registerWithEmail}
//         title="Email sign up"
//       />
//       <Button
//         onPress={signinWithEmail}
//         title="Email Sign in"
//       />
//     </View>



//   );
// };

// export default SignUpScreen;

// const styles = StyleSheet.create({});







// import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import React, { useState } from 'react'
// import { useNavigation } from '@react-navigation/native';
// import {
  
//    getAuth,
//    createUserWithEmailAndPassword,
//    signInWithEmailAndPassword,
//  } from '@react-native-firebase/auth';
//  import uuid from 'react-native-uuid';
//  import firestore from '@react-native-firebase/firestore'

// const SignUpScreen = () => {
//   const [name,setName]=useState('');
//   const[email,setEmail]=useState('');
//   const[phoneNo,setPhoneNo]=useState('');
//   const[password,setPassword]=useState('');
//   const[confirmPassword, setConfirmPassword]=useState('');
//   const naviagtion=useNavigation();
//   const registerUser=()=>{
//     const userId=uuid.v4();
//     firestore().collection('users').doc(userId).set({
//       name:name,
//       email:email,
//       password:password,
//       phoneNo:phoneNo,
//       userId:userId
//     }).then(res=>{
//       console.log('user created');
      
//     }).catch(error=>{
//       console.log(error);
      
//     })


//   };
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>SignUp</Text>
//       <View style={styles.TextContainer}>

//       <TextInput 
//       placeholder='Enter Name'
//       placeholderTextColor={'gray'}
//        style={styles.input}
//        onChangeText={(text)=>{setName(text)}}
//        value={name}
//        />

//       <TextInput 
//       placeholder='Enter Email'
//       placeholderTextColor={'gray'}
//       style={styles.input}
//       onChangeText={(text)=>{setEmail(text)}}
//       value={email}
//       />

//       <TextInput 
//       placeholder='Enter Phone No'
//       placeholderTextColor={'gray'}
//       keyboardType='number-pad' 
//       style={styles.input}
//       onChangeText={(text)=>{setPhoneNo(text)}}
//       value={phoneNo}
//       />

//       <TextInput
//        placeholder='Enter Password'
//        placeholderTextColor={'gray'}
//         style={styles.input}
//         onChangeText={(text)=>{setPassword(text)}}
//         value={password}
//         />
//       <TextInput
//        placeholder='Confirm Password'
//        placeholderTextColor={'gray'}
//         style={styles.input}
//         onChangeText={(text)=>{setConfirmPassword(text)}}
//         value={confirmPassword}
//         />


//       </View>
//       <TouchableOpacity
//       style={styles.btn}
//       onPress={()=>{registerUser()}}
//       >
//         <Text style={styles.btnText}>SignUp</Text>

//       </TouchableOpacity>
//       <Pressable
//       onPress={()=>{
       
        
//         naviagtion.navigate('LoginScreen')}}
//       >
//          <Text style={styles.orLogin}>Or Login</Text>

//       </Pressable>
     
     

//     </View>
//   )
// }

// export default SignUpScreen

// const styles = StyleSheet.create(
//   {
//     container:{
//       flex:1,
//       backgroundColor:'white'
//     },
//     title:{
//       fontSize:30,
//       color:'purple',
//       alignSelf:'center',
//       marginTop:50,
//       fontWeight:'bold'
//     },
//     TextContainer:{
//       gap:20,
//       marginTop:50,

//     },
//     input:{
//       width:'90%',
//       height:'50',
//       borderWidth:0.5,
//       borderRadius:11,
//       alignSelf:'center',
//       paddingLeft:20
      

//     },
//     btn:{
//       width:'90%',
//       height:50,
//       alignSelf:'center',
//       justifyContent:'center',
//       alignItems:'center',
//       borderRadius:11,
//       marginTop:50,
//       backgroundColor:'purple',



//     },
//     btnText:{
//       color:'white',
//       fontSize:18,

//     },
//     orLogin:{
//       alignSelf:'center',
//     marginTop:30,
//     fontSize:20,
//     textDecorationLine:'underline',
//     fontWeight:'600',
//     color:'purple',
//     opacity:0.6


//     }
//   })








