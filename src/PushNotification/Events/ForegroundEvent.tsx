import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import notifee, { EventType } from '@notifee/react-native';


const ForegroundEvent = () => {
      useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(
      ({ type, detail }) => {
        switch (type) {
          case EventType.PRESS:
            console.log('Notification pressed');
            console.log(detail.notification);
            break;

          case EventType.DISMISSED:
            console.log('Notification dismissed');
            break;
        }
      },
    );

    return unsubscribe;
  }, []);
    
  return (
    <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
      <Text>ForegroundEvent</Text>
    </View>
  )
}

export default ForegroundEvent

const styles = StyleSheet.create({})










