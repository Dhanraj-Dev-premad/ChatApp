import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const ApiBasics = () => {
    useEffect(()=>{
        async function getProduct(){
            const response =await fetch(
            'https://dummyjson.com/products',
            );
            const data =await response.json();
            console.log(data);
            

        } 
        getProduct();
      },[]

    );
  return (
   <View>
      <Text>Check your console for products</Text>
    </View>
  )
}

export default ApiBasics

const styles = StyleSheet.create({})