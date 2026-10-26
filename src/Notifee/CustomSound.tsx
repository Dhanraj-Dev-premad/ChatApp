import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import notifee, { AndroidCategory,
  AndroidImportance,  AndroidStyle } from '@notifee/react-native';

export default function CustomSound() {
  const showNotification = async () => {
    try {
      // Step 1: Request notification permission
      await notifee.requestPermission();

      // Step 2: Create the notification channel 
      const channelId = await notifee.createChannel({
        id: 'sound_Test_3',
        name: 'Sound Notification',
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'hollow2', // Sound needs to be mapped to the channel for Android 8.0+
      });
     

      // Step 3: Display the notification
      await notifee.displayNotification({
        title: 'Rahul',
        body: 'Custom sound',
        android: {
           ongoing: true,
          channelId, 
          sound: 'hollow2', 
          color: '#FF0000',
          largeIcon: require('../ChatApp/assets/images/settings.png'),
          circularLargeIcon: true,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: 'Hey! Are you available? I wanted to discuss our React Native project. Let me know when you are free so we can work on it together.',
          },
          pressAction: {
            id: 'default',
          },
        },
      });
         // Step 3: Display the notification
      await notifee.displayNotification({
        title: 'Raj',
        body: 'Custom sound1',
        android: {
           ongoing: true,
          channelId, 
          sound: 'hollow2', 
          color: '#FF0000',
          largeIcon: require('../ChatApp/assets/images/settings.png'),
          circularLargeIcon: true,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: 'Hey! Are you available? I wanted to discuss our React Native project. Let me know when you are free so we can work on it together.',
          },
          pressAction: {
            id: 'default',
          },
        },
      });
         // Step 3: Display the notification
      await notifee.displayNotification({
        title: 'Rishi',
        body: 'Custom sound2',
        android: {
           ongoing: true,
          channelId, 
          sound: 'hollow2', 
          color: '#FF0000',
          largeIcon: require('../ChatApp/assets/images/settings.png'),
          circularLargeIcon: true,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: 'Hey! Are you available? I wanted to discuss our React Native project. Let me know when you are free so we can work on it together.',
          },
          pressAction: {
            id: 'default',
          },
        },
      });
         // Step 3: Display the notification
      await notifee.displayNotification({
        title: 'Loki',
        body: 'Custom sound3',
        android: {
           ongoing: true,
          channelId, 
          sound: 'hollow2', 
          color: '#FF0000',
          largeIcon: require('../ChatApp/assets/images/settings.png'),
          circularLargeIcon: true,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: 'Hey! Are you available? I wanted to discuss our React Native project. Let me know when you are free so we can work on it together.',
          },
          pressAction: {
            id: 'default',
          },
        },
      });

       await notifee.displayNotification({
  title: 'Incoming call',
  body: 'Rahul is calling',
  android: {
    channelId,
    category: AndroidCategory.CALL,
    importance: AndroidImportance.HIGH,
    fullScreenAction: {
      id: 'default',
    },
  },
});

    } catch (error) {
      console.log('Notification error:', error);
      Alert.alert('Error', 'Could not display the notification.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifee Notification</Text>
      <TouchableOpacity style={styles.button} onPress={showNotification}>
        <Text style={styles.buttonText}>Show Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0857A0',
    marginBottom: 50, 
  },
  button: {
    backgroundColor: '#0857A0',
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
