import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const Splash = () => {
  const navigation =useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('LoginScreen' as never);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);



  return (
    <View style={styles.container}>
       <Text style={styles.logo}>{'Fierbase Chat\nApp'}</Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create(
  {

         container:{
            flex:1,
             backgroundColor:'purple',
             justifyContent:'center',
             alignItems:'center'

         },
         logo:{
           fontSize:40,
           color:'white',
           textAlign:'center'
         }
  })