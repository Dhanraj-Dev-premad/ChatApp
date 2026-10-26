
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import notifee, {
  AndroidColor,
  AndroidImportance,
} from '@notifee/react-native';

const ForegroundServices = () => {
  const startService = async () => {
    try {
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
        id: 'foreground_channel',
        name: 'Foreground Service',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        id: 'foreground_service_notification',
        title: 'Foreground Service',
        body: 'Foreground service is running...',
        android: {
          channelId,
          asForegroundService: true,
          color: AndroidColor.RED,
          colorized: true,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.log('Foreground service error:', error);
      Alert.alert('Error', 'Could not start foreground service.');
    }
  };

  const stopService = async () => {
    try {
      await notifee.stopForegroundService();
    } catch (error) {
      console.log('Stop service error:', error);
      Alert.alert('Error', 'Could not stop foreground service.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Foreground Service Demo</Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={startService}
      >
        <Text style={styles.buttonText}>Start Service</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.stopButton}
        onPress={stopService}
      >
        <Text style={styles.buttonText}>Stop Service</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForegroundServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0857A0',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#0857A0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 15,
  },
  stopButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
















// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';

// import notifee, {
//   AndroidColor,
//   AndroidImportance,
// } from '@notifee/react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';

// const COMMAND_KEY = '@foreground_service_command';

// const ForegroundServices = () => {
//   const startService = async () => {
//     try {
//       await notifee.requestPermission();

//       const channelId = await notifee.createChannel({
//         id: 'foreground_channel',
//         name: 'Foreground Service',
//         importance: AndroidImportance.HIGH,
//       });

//       await AsyncStorage.setItem(COMMAND_KEY, 'run');

//       await notifee.displayNotification({
//         id: 'foreground_service_notification',
//         title: 'Foreground Service',
//         body: 'Running — 120 seconds remaining',
//         android: {
//           channelId,
//           asForegroundService: true,
//           ongoing: true,
//           autoCancel: false,
//           onlyAlertOnce: true,
//           color: AndroidColor.RED,
//           colorized: true,
//           pressAction: {
//             id: 'default',
//           },
//           actions: [
//             {
//               title: 'Pause',
//               pressAction: {
//                 id: 'pause',
//               },
//             },
//             {
//               title: 'Stop',
//               pressAction: {
//                 id: 'stop',
//               },
//             },
//           ],
//         },
//       });
//     } catch (error) {
//       console.log('Foreground service error:', error);
//       Alert.alert('Error', 'Could not start foreground service.');
//     }
//   };

//   const stopService = async () => {
//     try {
//       await AsyncStorage.setItem(COMMAND_KEY, 'stop');
//       await notifee.stopForegroundService();
//     } catch (error) {
//       console.log('Stop service error:', error);
//       Alert.alert('Error', 'Could not stop foreground service.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>
//         Foreground Service Demo
//       </Text>

//       <TouchableOpacity
//         style={styles.startButton}
//         onPress={startService}>
//         <Text style={styles.buttonText}>Start Service</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.stopButton}
//         onPress={stopService}>
//         <Text style={styles.buttonText}>Stop Service</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default ForegroundServices;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//     backgroundColor: '#FFFFFF',
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#0857A0',
//     marginBottom: 30,
//   },
//   startButton: {
//     backgroundColor: '#0857A0',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   stopButton: {
//     backgroundColor: '#D32F2F',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });









