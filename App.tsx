
import React, {useEffect, useState} from 'react';
import {
  AppState,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import RootNavigation from './src/ChatApp/naviagtion/Rootnavigation';
import {KeyboardProvider} from 'react-native-keyboard-controller';

import {
  getMessaging,
  getToken,
  onMessage,
} from '@react-native-firebase/messaging';

import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';

import CheckPreCrash1 from './src/Crashlytics/CheckPreCrash1';
import CrashDemo from './src/Crashlytics/CrashDemo';
import ModelInfoScreen from './src/Crashlytics/ModelInfoScreen';
import DemoModeil from './src/Crashlytics/DemoModeil';

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  // 1. App lifecycle + notification permission + FCM token
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        if (
          Platform.OS === 'android' &&
          Number(Platform.Version) >= 33
        ) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission denied');
            return;
          }
        }

        const token = await getToken(getMessaging());
        console.log('FCM Token:', token);
      } catch (error) {
        console.log('Permission / token error:', error);
      }
    };

    initializeNotifications();

    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('App state changed:', nextAppState);
        setAppState(nextAppState);
      },
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  // 2. Display a local notification
  const onDisplayNotification = async (remoteMessage: any) => {
    try {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: remoteMessage.notification?.title ?? 'New message',
        body:
          remoteMessage.notification?.body ??
          'You received a message',
        android: {
          channelId,
          smallIcon: 'ic_notification',
          sound: 'hollow2',
          color: '#FF0000',
          style: {
            type: AndroidStyle.BIGTEXT,
            text:
              remoteMessage.notification?.body ??
              'You received a new message.',
          },
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.log('Display notification error:', error);
    }
  };

  // 3. FCM foreground messages
  useEffect(() => {
    const messaging = getMessaging();

    const unsubscribe = onMessage(
      messaging,
      async remoteMessage => {
        await onDisplayNotification(remoteMessage);
      },
    );

    return unsubscribe;
  }, []);

  // 4. Notification press / dismiss events
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(
      ({type, detail}) => {
        switch (type) {
          case EventType.PRESS:
            console.log(
              'Notification pressed:',
              detail.notification,
            );
            break;

          case EventType.DISMISSED:
            console.log('Notification dismissed');
            break;
        }
      },
    );

    return unsubscribe;
  }, []);

  // 5. App state changes
  useEffect(() => {
    console.log('Current app state:', appState);
  }, [appState]);

  return (
    //<CrashDemo/>

    <DemoModeil />

    // For your normal app, replace the line above with:
    // <KeyboardProvider
    //   statusBarTranslucent
    //   navigationBarTranslucent>
    //   <RootNavigation />
    // </KeyboardProvider>
  );
};

export default App;
























// import React, {useEffect, useState} from 'react';
// import {
//   AppState,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';

// import RootNavigation from './src/ChatApp/naviagtion/Rootnavigation';
// import {KeyboardProvider} from 'react-native-keyboard-controller';

// import {
//   getMessaging,
//   getToken,
//   onMessage,
// } from '@react-native-firebase/messaging';

// import notifee, {
//   AndroidStyle,
//   EventType,
// } from '@notifee/react-native';
// import CheckPreCrash from './src/Crashlytics/CheckPreCrash1';



// const App = () => {
//   const [appState, setAppState] = useState(AppState.currentState);

//   // 1. App lifecycle listener + notification permission
//   useEffect(() => {
//     const requestPermissionAndroid = async () => {
//       try {
//         if (
//           Platform.OS === 'android' &&
//           Number(Platform.Version) >= 33
//         ) {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//           );

//           if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//             console.log('Notification permission denied');
//             return;
//           }
//         }

//         const token = await getToken(getMessaging());
//         console.log('FCM Token:', token);
//       } catch (error) {
//         console.log('Permission / token error:', error);
//       }
//     };

//     requestPermissionAndroid();

//     const appStateListener = AppState.addEventListener(
//       'change',
//       nextAppState => {
//         console.log('App state changed:', nextAppState);
//         setAppState(nextAppState);
//       },
//     );

//     return () => {
//       appStateListener.remove();
//     };
//   }, []);

//   // 2. FCM foreground messages
//   useEffect(() => {
//     const messaging = getMessaging();

//     const unsubscribe = onMessage(messaging, async remoteMessage => {
//       await onDisplayNotification(remoteMessage);
//     });

//     return unsubscribe;
//   }, []);

//   // 3. Display local notification
//   const onDisplayNotification = async (remoteMessage: any) => {
//     try {
//       const channelId = await notifee.createChannel({
//         id: 'default',
//         name: 'Default Channel',
//       });

//       await notifee.displayNotification({
//         title: remoteMessage.notification?.title ?? 'New message',
//         body: remoteMessage.notification?.body ?? 'You received a message',
//         android: {
//           channelId,
//           smallIcon: 'ic_notification',
//           sound: 'hollow2',
//           color: '#FF0000',

//           // Use this only if you want a persistent notification.
//           // ongoing: true,

//           style: {
//             type: AndroidStyle.BIGTEXT,
//             text:
//               remoteMessage.notification?.body ??
//               'You received a new message.',
//           },

//           pressAction: {
//             id: 'default',
//           },
//         },
//       });
//     } catch (error) {
//       console.log('Display notification error:', error);
//     }
//   };

//   // 4. Notification press / dismiss events
//   useEffect(() => {
//     const unsubscribe = notifee.onForegroundEvent(
//       ({type, detail}) => {
//         switch (type) {
//           case EventType.PRESS:
//             console.log('Notification pressed:', detail.notification);
//             break;

//           case EventType.DISMISSED:
//             console.log('Notification dismissed');
//             break;
//         }
//       },
//     );

//     return unsubscribe;
//   }, []);

//   // appState can be used for app-level lifecycle logic.
//   // This alone does not update a user's Firestore online status.
//   useEffect(() => {
//     console.log('Current app state:', appState);
//   }, [appState]);

//   return (
//     // <KeyboardProvider
//     //   statusBarTranslucent
//     //   navigationBarTranslucent>
//     //   <RootNavigation />
//     // </KeyboardProvider>

//     <CheckPreCrash/>
//   );
// };

// export default App;


























// import React, { useEffect, useState } from 'react';
// import RootNavigation from './src/ChatApp/naviagtion/Rootnavigation';
// import { KeyboardProvider } from 'react-native-keyboard-controller';
// import {Alert, PermissionsAndroid, View,AppState} from 'react-native';
// import { getMessaging, onMessage } from '@react-native-firebase/messaging';
// import notifee, { AndroidStyle, EventType } from '@notifee/react-native';





// const App = () => {
//   const [appState, setAppState]=useState(AppState.currentState);
//   useEffect(()=>{
//     requestPermissionAndroid();
//     const appStateListener =AppState.addEventListener(
//       'change',
//       nextAppState =>{
//         console.log("next ApppSate is :", nextAppState);
//         setAppState(nextAppState);
        
//       },
    
//     )
//     return()=>{
//       appStateListener?.remove();
//     };


//   },[])
//   const requestPermissionAndroid=async()=>{
//     const granted=await   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,);
// if(granted===PermissionsAndroid.RESULTS.GRANTED){
  
//  // Alert.alert("Permission Granted")
//  getToken();
// }else{
//    // Alert.alert("Permission Denied")


// }

//   };

  
//   useEffect(() => {
//     const messaging = getMessaging();
//     const unsubscribe = onMessage(messaging, async remoteMessage => {
//      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//       onDisplayNotification(remoteMessage);
//     });
//     return unsubscribe;
//   }, []);

// const  onDisplayNotification=async(remoteMessage)=> {
   

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//     });

//     // Display a notification
//     await notifee.displayNotification({
//       title: remoteMessage.notification.title,
//       body: remoteMessage.notification.boby,
//       android: {
//                  ongoing: true,
//                 channelId, 
//                 sound: 'hollow2', 
//                 color: '#FF0000',
//                 largeIcon: require('../NextIn/src/ChatApp/assets/images/'),
//                 circularLargeIcon: true,
//                 style: {
//                   type: AndroidStyle.BIGTEXT,
//                   text: 'Hey! Are you available? I wanted to discuss our React Native project. Let me know when you are free so we can work on it together.',
//                 },
//                 pressAction: {
//                   id: 'default',
//                 },
//               },
//     });
//   }


//   const getToken =async()=>{
//     const token =await getMessaging().getToken();
//     console.log("token :- ", token);    
    
//   }

//   useEffect(() => {
//   console.log('Registering notification listener');

//   const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
//     switch (type) {
//       case EventType.PRESS:
//         console.log('Notification pressed', detail.notification);
//         break;

//       case EventType.DISMISSED:
//         console.log('Notification dismissed');
//         break;
//     }
//   });

//   return () => {
//     console.log('Removing notification listener');
//     unsubscribe();
//   };
// }, []);

  
  
//   return (
//     <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
//       <RootNavigation />
//     </KeyboardProvider>
//     // <ApiBasics/>

       


//     // <View style={{flex:1}}>
//     //        <ForegroundEvent/>


//     // </View>
//   );
// };

// export default App;