import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const PhonrScreen = () => {
  return (

    <SafeAreaView style={styles.satfeConatiner}>
        <View style={styles.MainContainer}>
            <View>
                <View>
                    <View>
                        
                    </View>

                </View>

            </View>
            <View>

            </View>

      
    </View>

    </SafeAreaView>
  )
}

export default PhonrScreen

const styles = StyleSheet.create(
    {

        satfeConatiner:{
            flex:1,
            padding:10,

            
            
        },
        MainContainer:{
            flex:1,
            backgroundColor:'#c1edfa',

        }
    })