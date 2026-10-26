import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import notifee, {
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';

export default function CustomNoti() {
  const showNotification = async () => {
    try {
      // Step 1: Request notification permission
      await notifee.requestPermission();

      // Step 2: Create an Android channel
      const channelId = await notifee.createChannel({
        id: 'lesson_channel',
        name: 'Lesson Notifications',
        importance: AndroidImportance.HIGH,
        vibration: true,
      });

      // Step 3: Display the notification
      await notifee.displayNotification({
      //  title: 'Rahul',
    // body: 'Hey! Are you available?',
    title: '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
 
  body:
    'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
        



        //  title: '<h1style="color: #0857A0;">Rahul</h1>',
        // body: '<p style="color: #0857A0;">Hey! Are you available?</p>',

        android: {
          channelId,
          
  color: '#FF0000',
        largeIcon: require('../ChatApp/assets/images/settings.png'),
          circularLargeIcon: true,
          style:{
            type:AndroidStyle.BIGTEXT,
            text: 'Hey! Are you available? I wanted to discuss our React Native project. Let me know when you are free so we can work on it together.',

            //  type:AndroidStyle.INBOX,
            // lines: ['Order placed', 'Payment received'],

          },


          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.log('Notification error:', error);
      Alert.alert(
        'Error',
        'Could not display the notification.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Notifee Notification
      </Text>


      <TouchableOpacity
        style={styles.button}
        onPress={showNotification}
      >
        <Text style={styles.buttonText}>
          Show Notification
        </Text>
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
    bottom:50,
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
