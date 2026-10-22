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
