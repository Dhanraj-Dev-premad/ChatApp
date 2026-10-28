
import React, { useCallback, useEffect, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import { KeyboardController } from 'react-native-keyboard-controller';
import { useHeaderHeight } from '@react-navigation/elements';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from '@react-native-firebase/firestore';

type ChatRouteParams = {
  id?: string;
  data?: {
    userId?: string;
    id?: string;
    name?: string;
    userName?: string;
  };
};

const getConversationId = (userA: string, userB: string) =>
  [userA, userB].sort().join('_');

const Chats = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const headerHeight = useHeaderHeight();

  const { id, data } = (route.params as ChatRouteParams) || {};

  const currentUserId = getAuth().currentUser?.uid || id || '';
  const otherUserId = data?.userId || data?.id || '';
  const otherUserName = data?.name || data?.userName || 'Chat';

  const [messages, setMessages] = useState<IMessage[]>([]);

  const db = getFirestore();

  const conversationId =
    currentUserId &&
    otherUserId &&
    currentUserId !== otherUserId
      ? getConversationId(currentUserId, otherUserId)
      : '';

  // Set chat header title.
  useEffect(() => {
    navigation.setOptions({ title: otherUserName });
  }, [navigation, otherUserName]);

  // Online while the chat screen is focused and the app is active.
  useFocusEffect(
    useCallback(() => {
      if (!currentUserId) return;

      let isScreenFocused = true;

      const userRef = doc(db, 'users', currentUserId);

      const updateActiveStatus = async (active: boolean) => {
        try {
          await setDoc(userRef, { active }, { merge: true });
          console.log(
            'User status:',
            active ? 'Online' : 'Offline',
          );
        } catch (error) {
          console.error('Failed to update user status:', error);
        }
      };

      // Screen is focused: check whether app is in foreground.
      updateActiveStatus(AppState.currentState === 'active');

      const appStateSubscription = AppState.addEventListener(
        'change',
        nextAppState => {
          if (isScreenFocused) {
            updateActiveStatus(nextAppState === 'active');
          }
        },
      );

      return () => {
        isScreenFocused = false;
        appStateSubscription.remove();

        // Chat screen lost focus or was closed.
        updateActiveStatus(false);
      };
    }, [currentUserId, db]),
  );

  // Listen to messages in real time.
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(
      db,
      'chats',
      conversationId,
      'messages',
    );

    const messagesQuery = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(50),
    );

    return onSnapshot(
      messagesQuery,
      snapshot => {
        const loadedMessages: IMessage[] = snapshot.docs.map(
          messageDoc => {
            const value = messageDoc.data();

            return {
              _id: messageDoc.id,
              text: value.text ?? '',
              createdAt: value.createdAt?.toDate?.() ?? new Date(),
              user: {
                _id: value.senderId ?? '',
                name: value.senderName ?? '',
              },
            };
          },
        );

        setMessages(loadedMessages);
      },
      error => {
        console.error('Failed to listen for messages:', error);
      },
    );
  }, [conversationId, db]);

  // Send a message and update conversation metadata.
  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const message = newMessages[0];
      const text = message?.text?.trim();

      if (!text || !currentUserId || !otherUserId || !conversationId) {
        return;
      }

      const conversationRef = doc(db, 'chats', conversationId);

      const messagesRef = collection(
        db,
        'chats',
        conversationId,
        'messages',
      );

      const messageRef = doc(messagesRef);

      const senderName =
        getAuth().currentUser?.displayName ?? 'You';

      try {
        const batch = writeBatch(db);

        batch.set(messageRef, {
          text,
          senderId: currentUserId,
          senderName,
          receiverId: otherUserId,
          createdAt: serverTimestamp(),
        });

        batch.set(
          conversationRef,
          {
            participants: [currentUserId, otherUserId].sort(),
            lastMessage: text,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );

        await batch.commit();
      } catch (error) {
        console.error('Failed to send message:', error);
        return;
      }

      // Send notification only if recipient is inactive.
      try {
        const recipientSnapshot = await getDoc(
          doc(db, 'users', otherUserId),
        );

        if (!recipientSnapshot.exists()) {
          console.warn('Recipient user document was not found');
          return;
        }

        const recipient = recipientSnapshot.data();

        if (recipient.active === true) {
          return;
        }

        if (!recipient.fcmToken) {
          console.warn('Recipient has no saved FCM token');
          return;
        }

        const response = await fetch(
          'http://192.168.29.175:3000/send-notification',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // For production, keep the API key on your backend.
              'x-api-key': 'my-secret-key-123',
            },
            body: JSON.stringify({
              token: recipient.fcmToken,
              title: senderName,
              type: 'chat_message',
              notificationType: 'tokens',
              projectId: 'godnextin',
              body: text,
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            'Notification API failed:',
            response.status,
            errorText,
          );
        }
      } catch (error) {
        // Message is already saved if notification sending fails.
        console.error('Could not send notification:', error);
      }
    },
    [currentUserId, otherUserId, conversationId, db],
  );

  const dismissKeyboard = useCallback(() => {
    KeyboardController.dismiss();
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: currentUserId,
          name: getAuth().currentUser?.displayName ?? 'You',
        }}
        onPressAvatar={dismissKeyboard}
        keyboardAvoidingViewProps={{
          keyboardVerticalOffset: headerHeight,
        }}
      />
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});















// import React, { useCallback, useEffect, useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
// import { KeyboardController } from 'react-native-keyboard-controller';
// import { useHeaderHeight } from '@react-navigation/elements';
// import { useNavigation, useRoute } from '@react-navigation/native';

// import { getAuth } from '@react-native-firebase/auth';
// import {
//   collection,
//   doc,
//   getDoc,
//   getFirestore,
//   limit,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   updateDoc,
//   writeBatch,
// } from '@react-native-firebase/firestore';

// type ChatRouteParams = {
//   id?: string;
//   data?: {
//     userId?: string;
//     id?: string;
//     name?: string;
//     userName?: string;
//   };
// };

// const getConversationId = (userA: string, userB: string) =>
//   [userA, userB].sort().join('_');

// const Chats = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const headerHeight = useHeaderHeight();

//   const { id, data } = (route.params as ChatRouteParams) || {};

//   const currentUserId = getAuth().currentUser?.uid || id || '';
//   const otherUserId = data?.userId || data?.id || '';
//   const otherUserName = data?.name || data?.userName || 'Chat';

//   const [messages, setMessages] = useState<IMessage[]>([]);

//   const conversationId =
//     currentUserId && otherUserId && currentUserId !== otherUserId
//       ? getConversationId(currentUserId, otherUserId)
//       : '';

//   useEffect(() => {
//     navigation.setOptions({ title: otherUserName });
//   }, [navigation, otherUserName]);

//   // Mark the current user active while this screen is open.
//   useEffect(() => {
//     if (!currentUserId) return;

//     const userRef = doc(getFirestore(), 'users', currentUserId);

//     updateDoc(userRef, { active: true }).catch(error => {
//       console.error('Failed to set active status:', error);
//     });

//     return () => {
//       updateDoc(userRef, { active: false }).catch(error => {
//         console.error('Failed to set inactive status:', error);
//       });
//     };
//   }, [currentUserId]);

//   // Listen for messages in real time.
//   useEffect(() => {
//     if (!conversationId) {
//       setMessages([]);
//       return;
//     }

//     const messagesRef = collection(
//       getFirestore(),
//       'chats',
//       conversationId,
//       'messages',
//     );

//     const messagesQuery = query(
//       messagesRef,
//       orderBy('createdAt', 'desc'),
//       limit(50),
//     );

//     return onSnapshot(
//       messagesQuery,
//       snapshot => {
//         const loadedMessages: IMessage[] = snapshot.docs.map(messageDoc => {
//           const value = messageDoc.data();

//           return {
//             _id: messageDoc.id,
//             text: value.text ?? '',
//             createdAt: value.createdAt?.toDate?.() ?? new Date(),
//             user: {
//               _id: value.senderId ?? '',
//               name: value.senderName ?? '',
//             },
//           };
//         });

//         setMessages(loadedMessages);
//       },
//       error => {
//         console.error('Failed to listen for messages:', error);
//       },
//     );
//   }, [conversationId]);

//   const onSend = useCallback(
//     async (newMessages: IMessage[] = []) => {
//       const message = newMessages[0];
//       const text = message?.text?.trim();

//       if (!text || !currentUserId || !otherUserId || !conversationId) {
//         return;
//       }

//       const db = getFirestore();
//       const conversationRef = doc(db, 'chats', conversationId);
//       const messagesRef = collection(
//         db,
//         'chats',
//         conversationId,
//         'messages',
//       );
//       const messageRef = doc(messagesRef);

//       try {
//         const batch = writeBatch(db);

//         batch.set(messageRef, {
//           text,
//           senderId: currentUserId,
//           senderName: getAuth().currentUser?.displayName ?? 'You',
//           receiverId: otherUserId,
//           createdAt: serverTimestamp(),
//         });

//         batch.set(
//           conversationRef,
//           {
//             participants: [currentUserId, otherUserId].sort(),
//             lastMessage: text,
//             updatedAt: serverTimestamp(),
//           },
//           { merge: true },
//         );

//         await batch.commit();
//       } catch (error) {
//         console.error('Failed to send message:', error);
//         return;
//       }

//       // Notify only when the recipient is inactive.
//       try {
//         const recipientSnapshot = await getDoc(
//           doc(db, 'users', otherUserId),
//         );

//         if (!recipientSnapshot.exists()) {
//           console.warn('Recipient user document was not found');
//           return;
//         }

//         const recipient = recipientSnapshot.data();

//         if (recipient.active === true) return;

//         if (!recipient.fcmToken) {
//           console.warn('Recipient has no saved FCM token');
//           return;
//         }
//         console.log();
        

//         const response = await fetch(
//           'http://192.168.29.175:3000/send-notification',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               // Do not put a production API key in the React Native app.
//               'x-api-key': 'my-secret-key-123',
//             },
//             body: JSON.stringify({
//               token: recipient.fcmToken,
//                //token: 'csHilgmrRNSXL5LRmr-p9B:APA91bHHNNFcrrhsiSfZpG3g0gYdLI2HEGqy5vO_Ouoixruq4i_i6jo02jsznFtKrq-SO3zfX6qRRYDiBxLtm0DMD6CfyDUl7boM0AQxh2FI4uT-3KRCHG8',

//               title: getAuth().currentUser?.displayName ?? 'New message',
             
//               type: 'chat_message',
//               notificationType: 'tokens',
//               projectId: 'godnextin',
//               body: text,
              
//             }),
//           },
//         );

//         if (!response.ok) {
//           console.log("check that message is sen dor not",response);
          
//           console.error('Notification API failed:', response.status);

//         }
//       } catch (error) {
//         // The chat message is already saved even if notification sending fails.
//         console.error('Could not send notification:', error);
//       }
//     },
//     [currentUserId, otherUserId, conversationId],
//   );

//   const dismissKeyboard = useCallback(() => {
//     KeyboardController.dismiss();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <GiftedChat
//         messages={messages}
//         onSend={onSend}
//         user={{
//           _id: currentUserId,
//           name: getAuth().currentUser?.displayName ?? 'You',
//         }}
//         onPressAvatar={dismissKeyboard}
//         keyboardAvoidingViewProps={{
//           keyboardVerticalOffset: headerHeight,
//         }}
//       />
//     </View>
//   );
// };

// export default Chats;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });


















// import React, { useCallback, useEffect, useState } from 'react';
// import { StyleSheet, View } from 'react-native';
// import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
// import { KeyboardController } from 'react-native-keyboard-controller';
// import { useHeaderHeight } from '@react-navigation/elements';
// import { useNavigation, useRoute } from '@react-navigation/native';

// import { getAuth } from '@react-native-firebase/auth';
// import {
//   collection,
//   doc,
//   getFirestore,
//   limit,
//   onSnapshot,
//   orderBy,
//   query,
//   updateDoc,
//   serverTimestamp,
//   writeBatch,
// } from '@react-native-firebase/firestore';

// type ChatRouteParams = {
//   id?: string;
//   data?: {
//     userId?: string;
//     id?: string;
//     name?: string;
//     userName?: string;
//   };
// };

// // Generate the same conversation ID for both users.
// const getConversationId = (userA: string, userB: string) => {
//   return [userA, userB].sort().join('_');
// };

// const Chats = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const headerHeight = useHeaderHeight();

//   const { id, data } = (route.params as ChatRouteParams) || {};

//   const currentUserId = getAuth().currentUser?.uid || id || '';
//   const otherUserId = data?.userId || data?.id || '';
//   const otherUserName = data?.name || data?.userName || 'Chat';

//   const [messages, setMessages] = useState<IMessage[]>([]);

//   const conversationId =
//     currentUserId &&
//     otherUserId &&
//     currentUserId !== otherUserId
//       ? getConversationId(currentUserId, otherUserId)
//       : '';

//   // Set the chat header title.
//   useEffect(() => {
//     navigation.setOptions({ title: otherUserName });
//   }, [navigation, otherUserName]);
// //   useEffect(() => {
// //   if (!currentUserId) return;

// //   const userRef = doc(getFirestore(), 'users', currentUserId);

// //   updateDoc(userRef, { active: true }).catch(error => {
// //     console.error('Failed to update active status:', error);
// //   });
// // }, [currentUserId]);
//   // Handle User Presence Status (Online / Offline)
//   useEffect(() => {
//     if (!currentUserId) return;

//     const db = getFirestore();
//     const userRef = doc(db, 'users', currentUserId);

//     // 1.   for online
//     updateDoc(userRef, { 
//       active: true,
     
//     }).catch(error => {
//       console.error('Failed to set active status:', error);
//     });
//     //for offline

//     return () => {
//       updateDoc(userRef, { 
//         active: false,
      
//       }).catch(error => {
//         console.error('Failed to set offline status:', error);
//       });
//     };
//   }, [currentUserId]);


//   // Listen to messages in real time.
//   useEffect(() => {
//     if (!conversationId) {

//       setMessages([]);
//       return;
//     }

//     const db = getFirestore();
   

//     const messagesRef = collection(
//       db,
//       'chats',
//       conversationId,
//       'messages',
//     );

//     const messagesQuery = query(
//       messagesRef,
//       orderBy('createdAt', 'desc'),
//       limit(50),
//     );

//     return onSnapshot(
//       messagesQuery,
//       snapshot => {
//         const loadedMessages: IMessage[] = snapshot.docs.map(
//           messageDoc => {
//             const value = messageDoc.data();

//             return {
//               _id: messageDoc.id,
//               text: value.text ?? '',
//               createdAt:
//                 value.createdAt?.toDate?.() ?? new Date(),
//               user: {
//                 _id: value.senderId ?? '',
//                 name: value.senderName ?? '',
//               },
//             };
//           },
//         );

//         setMessages(loadedMessages);
//       },
//       error => {
//         console.error('Failed to listen for messages:', error);
//       },
//     );
//   }, [conversationId]);

//   // Send a message to the shared conversation.
//   const onSend = useCallback(
//     async (newMessages: IMessage[] = []) => {
//       const message = newMessages[0];
//       const text = message?.text?.trim();

//       if (!text || !currentUserId || !otherUserId || !conversationId) {
//         return;
//       }

//       const db = getFirestore();

//       const conversationRef = doc(
//         db,
//         'chats',
//         conversationId,
//       );

//       const messagesRef = collection(
//         db,
//         'chats',
//         conversationId,
//         'messages',
//       );

//       const messageRef = doc(messagesRef);

//       try {
//         const batch = writeBatch(db);

//         batch.set(messageRef, {
//           text,
//           senderId: currentUserId,
//           senderName: getAuth().currentUser?.displayName ?? 'You',
//           receiverId: otherUserId,
//           createdAt: serverTimestamp(),
//         });

//         batch.set(
//           conversationRef,
//           {
//             participants: [currentUserId, otherUserId].sort(),
//             lastMessage: text,
//             updatedAt: serverTimestamp(),
//           },
//           { merge: true },
//         );

//         await batch.commit();
//       } catch (error) {
//         console.error('Failed to send message:', error);
//       }
//     },
//     [currentUserId, otherUserId, conversationId],
//   );

//   const dismissKeyboard = useCallback(() => {
//     KeyboardController.dismiss();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <GiftedChat
//         messages={messages}
//         onSend={onSend}
//         user={{
//           _id: currentUserId,
//           name: getAuth().currentUser?.displayName ?? 'You',
//         }}
//         onPressAvatar={dismissKeyboard}
//         keyboardAvoidingViewProps={{
//           keyboardVerticalOffset: headerHeight,
//         }}
//       />
//     </View>
//   );
// };

// export default Chats;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });




