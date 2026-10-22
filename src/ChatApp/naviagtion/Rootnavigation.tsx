import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import StackNavigation from './StackNavigation'

const RootNavigation = () => {
  return (
     <NavigationContainer>
      <StackNavigation/>
        
    </NavigationContainer>
  )
}

export default RootNavigation

const styles = StyleSheet.create({})