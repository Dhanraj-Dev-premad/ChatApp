import React, { useEffect } from 'react';
import RootNavigation from './src/ChatApp/naviagtion/Rootnavigation';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {Alert, PermissionsAndroid, View} from 'react-native';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import ForegroundEvent from './src/PushNotification/Events/ForegroundEvent';




const App = () => {
  useEffect(()=>{
    requestPermissionAndroid();

  },[])
  const requestPermissionAndroid=async()=>{
    const granted=await   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,);
if(granted===PermissionsAndroid.RESULTS.GRANTED){
  
 // Alert.alert("Permission Granted")
 getToken();
}else{
   // Alert.alert("Permission Denied")


}

  };

  
  useEffect(() => {
    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, async remoteMessage => {
     // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

const  onDisplayNotification=async(remoteMessage)=> {
   

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.boby,
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }


  const getToken =async()=>{
    const token =await getMessaging().getToken();
    console.log("token :- ", token);
    
  }

  useEffect(() => {
  console.log('Registering notification listener');

  const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.PRESS:
        console.log('Notification pressed', detail.notification);
        break;

      case EventType.DISMISSED:
        console.log('Notification dismissed');
        break;
    }
  });

  return () => {
    console.log('Removing notification listener');
    unsubscribe();
  };
}, []);

  
  
  return (
    <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
      <RootNavigation />
    </KeyboardProvider>




    // <View style={{flex:1}}>
    //        <ForegroundEvent/>


    // </View>
  );
};

export default App;