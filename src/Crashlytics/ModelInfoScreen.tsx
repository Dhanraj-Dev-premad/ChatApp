import { Button, StyleSheet, Text, TextInput, View, } from 'react-native'
import React, { useState } from 'react'
import { log } from '@react-native-firebase/crashlytics';

const ModelInfoScreen = () => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [description,setDescription]=useState('');
    const saveinfo= ()=>{
    console.log(name);
    console.log(email);
    console.log(description);
    
    
    


    }


    
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white',
        gap: 20,
    }}>

        <Text>User Info</Text>
        <TextInput
        placeholder='Enter your Name'
        placeholderTextColor={'gray'}
        style={{backgroundColor:'#ded4d4',height:55,width:300,color:'black',borderRadius:11}}
        value={name}
        onChangeText={(text)=>{setName(text)}}

        ></TextInput>
        <TextInput
        placeholder='Enter your Email'
        placeholderTextColor={'gray'}
        style={{backgroundColor:'#ded4d4',height:55,width:300,color:'black',borderRadius:11}}
        onChangeText={(text)=>{setEmail(text)}}
        value={email}

        ></TextInput>
        <TextInput
        placeholder='Enter your Description '
        placeholderTextColor={'gray'}
        style={{backgroundColor:'#ded4d4',height:55,width:300,color:'black',borderRadius:11}}
        onChangeText={(text)=>{setDescription(text)}}
        value={description}

        ></TextInput>

        <Button
        title='Save Info'
        onPress={saveinfo}
    
        />

      
    </View>
  )
}

export default ModelInfoScreen

const styles = StyleSheet.create({})