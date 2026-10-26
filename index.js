
// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import App from './App';
// import {name as appName} from './app.json';

// import notifee, {EventType} from '@notifee/react-native';
// import {
//   getMessaging,
//   setBackgroundMessageHandler,
// } from '@react-native-firebase/messaging';

// const messaging = getMessaging();

// const CHANNEL_ID = 'foreground_channel';
// const NOTIFICATION_ID = 'foreground_service_notification';
// const COMMAND_KEY = '@foreground_service_command';

// let remainingSeconds = 120;

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// const updateNotification = async paused => {
//   await notifee.displayNotification({
//     id: NOTIFICATION_ID,
//     title: 'Foreground Service',
//     body: paused
//       ? `Paused — ${remainingSeconds} seconds remaining`
//       : `Running — ${remainingSeconds} seconds remaining`,
//     android: {
//       channelId: CHANNEL_ID,
//       asForegroundService: true,
//       ongoing: true,
//       onlyAlertOnce: true,
//       color: '#D32F2F',
//       colorized: true,
//       pressAction: {
//         id: 'default',
//       },
//       actions: [
//         {
//           title: paused ? 'Resume' : 'Pause',
//           pressAction: {
//             id: 'pause',
//           },
//         },
//         {
//           title: 'Stop',
//           pressAction: {
//             id: 'stop',
//           },
//         },
//       ],
//     },
//   });
// };

// const handleNotificationAction = async ({type, detail}) => {
//   if (type !== EventType.ACTION_PRESS) {
//     return;
//   }

//   const actionId = detail.pressAction?.id;

//   if (actionId === 'pause') {
//     const currentCommand = await AsyncStorage.getItem(COMMAND_KEY);

//     if (currentCommand === 'run') {
//       await AsyncStorage.setItem(COMMAND_KEY, 'pause');
//     } else if (currentCommand === 'pause') {
//       await AsyncStorage.setItem(COMMAND_KEY, 'run');
//     }
//   }

//   if (actionId === 'stop') {
//     await AsyncStorage.setItem(COMMAND_KEY, 'stop');
//     await notifee.stopForegroundService();
//   }
// };

// // Register the foreground service before AppRegistry.
// notifee.registerForegroundService(async () => {
//   remainingSeconds = 120;

//   try {
//     while (remainingSeconds > 0) {
//       const command = await AsyncStorage.getItem(COMMAND_KEY);

//       if (command === 'stop' || command == null) {
//         break;
//       }

//       if (command === 'pause') {
//         await updateNotification(true);
//         await sleep(1000);
//         continue;
//       }

//       await updateNotification(false);
//       await sleep(1000);

//       const latestCommand = await AsyncStorage.getItem(COMMAND_KEY);

//       if (latestCommand === 'stop') {
//         break;
//       }

//       if (latestCommand === 'run') {
//         remainingSeconds = Math.max(0, remainingSeconds - 1);
//       }
//     }
//   } catch (error) {
//     console.log('Foreground service error:', error);
//   } finally {
//     await AsyncStorage.setItem(COMMAND_KEY, 'stop');
//   }
// });

// // Register both event handlers at the application entry point.
// notifee.onForegroundEvent(handleNotificationAction);
// notifee.onBackgroundEvent(handleNotificationAction);

// // Preserve Firebase background-message handling.
// setBackgroundMessageHandler(messaging, async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

// AppRegistry.registerComponent(appName, () => App);
















/** * @format */ 

import { AppRegistry } from 'react-native'; 
import App from './App'; 
import { name as appName } from './app.json'; 
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging'; 

const messaging = getMessaging(); 

// Handle background messages
setBackgroundMessageHandler(messaging, async remoteMessage => { 
  console.log('Message handled in the background!', remoteMessage); 
});

// Always register the main component at the top level
AppRegistry.registerComponent(appName, () => App);
