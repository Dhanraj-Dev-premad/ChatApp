import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  collection,
  getDocs,
  getFirestore,
} from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

type User = {
  id: string;
  userId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  gmail?: string;
  phoneNo?: string;
  phone?: string;
};

type UsersProps = {
  currentUserId?: string;
  activeStatus?: boolean;
};

const Users = ({
  currentUserId,
  activeStatus,
}: UsersProps) => {
  const navigation = useNavigation();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setError('');

      const snapshot = await getDocs(
        collection(getFirestore(), 'users'),
      );

      const userList: User[] = snapshot.docs.map(document => ({
        id: document.id,
        ...document.data(),
      }));

      const displayUsers = currentUserId
        ? userList.filter(
            user =>
              user.id !== currentUserId &&
              user.userId !== currentUserId,
          )
        : userList;

      setUsers(displayUsers);
    } catch (err) {
      console.error('Firestore error:', err);
      setError('Unable to load users. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const getInitials = (user: User) => {
    const name =
      user.name ||
      [user.firstName, user.lastName].filter(Boolean).join(' ') ||
      user.userName ||
      'User';

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  };

  const renderUser = ({ item, index }: { item: User; index: number }) => {
    const name =
      item.name ||
      [item.firstName, item.lastName].filter(Boolean).join(' ') ||
      item.userName ||
      'Unnamed User';

    const email = item.email || item.gmail || 'No email provided';
    const phone = item.phoneNo || item.phone || '';

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => {
          navigation.navigate(
            'Chats' as never,
            {
              id: currentUserId,
              data: item,
              activeStatus,
            } as never,
          );
        }}
      >
        <View
          style={[
            styles.avatar,
            index % 2 === 0 ? styles.purpleAvatar : styles.blueAvatar,
          ]}
        >
          <Text style={styles.avatarText}>{getInitials(item)}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {email}
          </Text>
          {phone ? <Text style={styles.userPhone}>{phone}</Text> : null}
        </View>

        <View style={styles.statusDot} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C4DFF" />
        <Text style={styles.message}>Loading users...</Text>
      </View>
    );
  }

  if (error && users.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Something went wrong</Text>
        <Text style={styles.message}>{error}</Text>
        <Text style={styles.retry} onPress={handleRefresh}>
          Try again
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR COMMUNITY</Text>
        <Text style={styles.heading}>Users</Text>
        <Text style={styles.subtitle}>
          Manage and view your registered users.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryIconText}>U</Text>
          </View>
          <View>
            <Text style={styles.summaryLabel}>Total registered users</Text>
            <Text style={styles.summaryCount}>
              {users.length} {users.length === 1 ? 'User' : 'Users'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>All users</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderUser}
        contentContainerStyle={[
          styles.listContent,
          users.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#6C4DFF']}
            tintColor="#6C4DFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No users yet</Text>
            <Text style={styles.message}>
              Add user documents to your Firestore users collection.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  eyebrow: {
    color: '#6C4DFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#25213D',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#85849A',
    marginTop: 5,
  },
  summaryCard: {
    backgroundColor: '#6C4DFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#8972FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  summaryIconText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#E5DFFF',
    fontSize: 12,
  },
  summaryCount: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#25213D',
    marginTop: 26,
    marginBottom: 14,
  },
  listContent: {
    paddingHorizontal: 22,
    paddingBottom: 125,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#25213D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 7,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purpleAvatar: {
    backgroundColor: '#EAE4FF',
  },
  blueAvatar: {
    backgroundColor: '#DDF2FF',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6044D8',
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#25213D',
  },
  userEmail: {
    fontSize: 12,
    color: '#85849A',
    marginTop: 5,
  },
  userPhone: {
    fontSize: 12,
    color: '#85849A',
    marginTop: 4,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#6C4DFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#F7F7FC',
  },
  message: {
    fontSize: 13,
    color: '#85849A',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retry: {
    color: '#6C4DFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 18,
    padding: 10,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 45,
    paddingHorizontal: 15,
  },
  emptyTitle: {
    color: '#25213D',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
  },
});













// import React, { useCallback, useEffect, useState } from 'react';

// import {
//   ActivityIndicator,
//   FlatList,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import {
//   collection,
//   getDocs,
//   getFirestore,
// } from '@react-native-firebase/firestore';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const Users = ({ currentUserId: propUserId }: { currentUserId?: string } = {}) => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const currentUserId =
//     propUserId ||
//     (route.params as any)?.currentUserId ||
//     (route.params as any)?.userId;

//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState('');
//   const [active,setActive]=useState(false)
  
//   const Users = ({
//   currentUserId,
//   activeStatus,
// }: {
//   currentUserId?: string;
//   activeStatus?: boolean;
// }) => {

//   // Fetch users from Firestore
//   const fetchUsers = useCallback(async () => {
//     try {
//       setError('');

//       const db = getFirestore();

//       // Correct collection name: users (lowercase)
//       const snapshot = await getDocs(collection(db, 'users'));

//       console.log('Total users:', snapshot.size);

//       const userList = snapshot.docs.map(document => ({
//         id: document.id,
//         ...document.data(),
//       }));

//       console.log('Fetched users:', userList);

//       const displayUsers = currentUserId
//         ? userList.filter(
//             u => u.id !== currentUserId && (u as any).userId !== currentUserId,
//           )
//         : userList;

//       setUsers(displayUsers);
//     } catch (err) {
//       console.log('Firestore error:', err.code, err.message);
//       setError('Unable to load users. Please try again.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [currentUserId]);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   // Pull-to-refresh
//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchUsers();
//   };

//   // Generate initials for the avatar
//   const getInitials = user => {
//     const name =
//       user.name ||
//       [user.firstName, user.lastName].filter(Boolean).join(' ') ||
//       user.userName ||
//       'User';

//     return name
//       .trim()
//       .split(/\s+/)
//       .slice(0, 2)
//       .map(part => part.charAt(0).toUpperCase())
//       .join('');
//   };

//   // Render each user
//   const renderUser = ({ item, index }) => {
//     const name =
//       item.name ||
//       [item.firstName, item.lastName].filter(Boolean).join(' ') ||
//       item.userName ||
//       'Unnamed User';

//     const email = item.email || item.gmail || 'No email provided';
//     const phone = item.phoneNo || item.phone || '';

//     return (
//       <TouchableOpacity 
//       onPress={() => {
//         navigation.navigate('Chats' as never, { id: currentUserId, data: item,activeStatus: } as never);
//       }}
//       style={styles.userCard}>
//         <View
//           style={[
//             styles.avatar,
//             index % 2 === 0
//               ? styles.purpleAvatar
//               : styles.blueAvatar,
//           ]}
//         >
//           <Text style={styles.avatarText}>
//             {getInitials(item)}
//           </Text>
//         </View>

//         <View style={styles.userInfo}>
//           <Text style={styles.userName} numberOfLines={1}>
//             {name}
//           </Text>

//           <Text style={styles.userEmail} numberOfLines={1}>
//             {email}
//           </Text>

//           {phone ? (
//             <Text style={styles.userPhone}>
//               {phone}
//             </Text>
//           ) : null}
//         </View>

//         <View style={styles.statusDot} />
//       </TouchableOpacity>
//     );
//   };

//   // Loading screen
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#6C4DFF" />
//         <Text style={styles.message}>Loading users...</Text>
//       </View>
//     );
//   }

//   // Error screen
//   if (error && users.length === 0) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.emptyIcon}>!</Text>
//         <Text style={styles.emptyTitle}>
//           Something went wrong
//         </Text>
//         <Text style={styles.message}>{error}</Text>

//         <Text style={styles.retry} onPress={handleRefresh}>
//           Try again
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.eyebrow}>YOUR COMMUNITY</Text>

//         <Text style={styles.heading}>Users</Text>

//         <Text style={styles.subtitle}>
//           Manage and view your registered users.
//         </Text>

//         <View style={styles.summaryCard}>
//           <View style={styles.summaryIcon}>
//             <Text style={styles.summaryIconText}>U</Text>
//           </View>

//           <View>
//             <Text style={styles.summaryLabel}>
//               Total registered users
//             </Text>

//             <Text style={styles.summaryCount}>
//               {users.length} {users.length === 1 ? 'User' : 'Users'}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.sectionTitle}>All users</Text>
//       </View>

//       <FlatList
//         data={users}
//         keyExtractor={item => item.id}
//         renderItem={renderUser}
//         contentContainerStyle={[
//           styles.listContent,
//           users.length === 0 && styles.emptyList,
//         ]}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             colors={['#6C4DFF']}
//             tintColor="#6C4DFF"
//           />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyIcon}>U</Text>

//             <Text style={styles.emptyTitle}>
//               No users yet
//             </Text>

//             <Text style={styles.message}>
//               Add user documents to your Firestore users collection.
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// export default Users;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F7FC',
//   },
//   header: {
//     paddingHorizontal: 22,
//     paddingTop: 24,
//   },
//   eyebrow: {
//     color: '#6C4DFF',
//     fontSize: 11,
//     fontWeight: '800',
//     letterSpacing: 2,
//   },
//   heading: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: '#25213D',
//     marginTop: 6,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#85849A',
//     marginTop: 5,
//   },
//   summaryCard: {
//     backgroundColor: '#6C4DFF',
//     borderRadius: 20,
//     padding: 20,
//     marginTop: 24,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   summaryIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 16,
//     backgroundColor: '#8972FF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 14,
//   },
//   summaryIconText: {
//     color: '#FFFFFF',
//     fontSize: 23,
//     fontWeight: '800',
//   },
//   summaryLabel: {
//     color: '#E5DFFF',
//     fontSize: 12,
//   },
//   summaryCount: {
//     color: '#FFFFFF',
//     fontSize: 23,
//     fontWeight: '800',
//     marginTop: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#25213D',
//     marginTop: 26,
//     marginBottom: 14,
//   },
//   listContent: {
//     paddingHorizontal: 22,
//     paddingBottom: 125,
//   },
//   userCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 18,
//     padding: 15,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: '#25213D',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 7,
//   },
//   avatar: {
//     width: 52,
//     height: 52,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   purpleAvatar: {
//     backgroundColor: '#EAE4FF',
//   },
//   blueAvatar: {
//     backgroundColor: '#DDF2FF',
//   },
//   avatarText: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#6044D8',
//   },
//   userInfo: {
//     flex: 1,
//     marginLeft: 14,
//     marginRight: 8,
//   },
//   userName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#25213D',
//   },
//   userEmail: {
//     fontSize: 12,
//     color: '#85849A',
//     marginTop: 5,
//   },
//   userPhone: {
//     fontSize: 12,
//     color: '#85849A',
//     marginTop: 4,
//   },
//   statusDot: {
//     width: 9,
//     height: 9,
//     borderRadius: 5,
//     backgroundColor: '#6C4DFF',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 25,
//     backgroundColor: '#F7F7FC',
//   },
//   message: {
//     fontSize: 13,
//     color: '#85849A',
//     marginTop: 8,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   retry: {
//     color: '#6C4DFF',
//     fontSize: 15,
//     fontWeight: '700',
//     marginTop: 18,
//     padding: 10,
//   },
//   emptyList: {
//     flexGrow: 1,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 45,
//     paddingHorizontal: 15,
//   },
//   emptyIcon: {
//     width: 58,
//     height: 58,
//     lineHeight: 58,
//     textAlign: 'center',
//     overflow: 'hidden',
//     borderRadius: 29,
//     backgroundColor: '#EAE4FF',
//     color: '#6C4DFF',
//     fontSize: 25,
//     fontWeight: '800',
//   },
//   emptyTitle: {
//     color: '#25213D',
//     fontSize: 18,
//     fontWeight: '700',
//     marginTop: 15,
//   },
// });

// }