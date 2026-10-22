
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import { KeyboardController } from 'react-native-keyboard-controller';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation, useRoute } from '@react-navigation/native';

import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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

// Generate the same conversation ID for both users.
const getConversationId = (userA: string, userB: string) => {
  return [userA, userB].sort().join('_');
};

const Chats = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const headerHeight = useHeaderHeight();

  const { id, data } = (route.params as ChatRouteParams) || {};

  const currentUserId = getAuth().currentUser?.uid || id || '';
  const otherUserId = data?.userId || data?.id || '';
  const otherUserName = data?.name || data?.userName || 'Chat';

  const [messages, setMessages] = useState<IMessage[]>([]);

  const conversationId =
    currentUserId &&
    otherUserId &&
    currentUserId !== otherUserId
      ? getConversationId(currentUserId, otherUserId)
      : '';

  // Set the chat header title.
  useEffect(() => {
    navigation.setOptions({ title: otherUserName });
  }, [navigation, otherUserName]);

  // Listen to messages in real time.
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const db = getFirestore();

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
              createdAt:
                value.createdAt?.toDate?.() ?? new Date(),
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
  }, [conversationId]);

  // Send a message to the shared conversation.
  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const message = newMessages[0];
      const text = message?.text?.trim();

      if (!text || !currentUserId || !otherUserId || !conversationId) {
        return;
      }

      const db = getFirestore();

      const conversationRef = doc(
        db,
        'chats',
        conversationId,
      );

      const messagesRef = collection(
        db,
        'chats',
        conversationId,
        'messages',
      );

      const messageRef = doc(messagesRef);

      try {
        const batch = writeBatch(db);

        batch.set(messageRef, {
          text,
          senderId: currentUserId,
          senderName: getAuth().currentUser?.displayName ?? 'You',
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
      }
    },
    [currentUserId, otherUserId, conversationId],
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
// import { GiftedChat, IMessage } from 'react-native-gifted-chat';
// import { KeyboardController } from 'react-native-keyboard-controller';
// import { useHeaderHeight } from '@react-navigation/elements';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import {
//   addDoc,
//   collection,
//   getFirestore,
//   onSnapshot,
//   orderBy,
//   query,
//   Timestamp,
// } from '@react-native-firebase/firestore';

// type ChatRouteParams = {
//   id: string;
//   data: {
//     userId?: string;
//     id?: string;
//     name?: string;
//     userName?: string;
//     email?: string;
//   };
// };

// const Chats = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { id, data } = (route.params as ChatRouteParams) || {};
//   const otherUserId = data?.userId || data?.id || '';
//   const otherUserName = data?.name || data?.userName || 'Chat';
//   const headerHeight = useHeaderHeight();

//   const [messages, setMessages] = useState<IMessage[]>([]);

//   const chatId = id && otherUserId ? `${id}${otherUserId}` : '';
//   const reverseChatId = id && otherUserId ? `${otherUserId}${id}` : '';

//   useEffect(() => {
//     navigation.setOptions({
//       title: otherUserName,
//     });
//   }, [navigation, otherUserName]);

//   useEffect(() => {
//     if (!chatId) return;

//     const messagesRef = collection(
//       getFirestore(),
//       'chats',
//       chatId,
//       'messages',
//     );
//     const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'));

//     return onSnapshot(
//       messagesQuery,
//       snapshot => {
//         const loadedMessages: IMessage[] = snapshot.docs.map(document => {
//           const value = document.data();

//           return {
//             _id: document.id,
//             text: value.text ?? '',
//             createdAt: value.createdAt?.toDate?.() ?? new Date(),
//             user: value.user ?? { _id: value.sendBy },
//           };
//         });

//         setMessages(loadedMessages);
//       },
//       error => {
//         console.error('Could not load chat messages:', error);
//       },
//     );
//   }, [chatId]);

//   const onSend = useCallback(
//     async (newMessages: IMessage[] = []) => {
//       const message = newMessages[0];
//       if (!message || !id || !otherUserId || !chatId) return;

//       setMessages(previousMessages =>
//         GiftedChat.append(previousMessages, [message]),
//       );

//       const messageToSave = {
//         _id: message._id,
//         text: message.text || '',
//         sendBy: id,
//         sendTo: otherUserId,
//         createdAt: Timestamp.fromDate(new Date(message.createdAt)),
//         user: {
//           _id: id,
//           name: 'You',
//         },
//       };

//       try {
//         const db = getFirestore();
//         const writes = [
//           addDoc(
//             collection(db, 'chats', chatId, 'messages'),
//             messageToSave,
//           ),
//         ];

//         if (reverseChatId && reverseChatId !== chatId) {
//           writes.push(
//             addDoc(
//               collection(db, 'chats', reverseChatId, 'messages'),
//               messageToSave,
//             ),
//           );
//         }

//         await Promise.all(writes);
//       } catch (error) {
//         console.error('Could not save chat message:', error);
//       }
//     },
//     [chatId, id, otherUserId, reverseChatId],
//   );

//   const dismissKeyboard = useCallback(() => {
//     KeyboardController.dismiss();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <GiftedChat
//         messages={messages}
//         onSend={onSend}
//         user={{ _id: id, name: 'You' }}
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



