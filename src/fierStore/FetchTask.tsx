import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc } from '@react-native-firebase/firestore';

const FetchTask = () => {
  const db = getFirestore();
  const [tasks, setTasks] = useState([]); 

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, 'Users'));
    const taskList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTasks(taskList);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (ID) => {
    try {
      await deleteDoc(doc(db, 'Users', ID));
      console.log('Task deleted successfully');
      fetchTasks(); 
    } catch (error) {
      console.log('Error deleting task ', error);
    }
  };

  return (
    <View style={styles.container}>


         {/* <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item.name || 'No name'}</Text>
            <Button title="Delete" color="red" onPress={() => deleteTask(item.id)} />
          </View>
        )}
      /> */}

        <View style={styles.table1}>

            <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item.name || 'No name'}</Text>
            <Button title="Delete" color="red" onPress={() => deleteTask(item.id)} />
          </View>
        )}
      />

        </View>

        <View style={styles.table2}>

            <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item.name || 'No name'}</Text>
            <Button title="Delete" color="red" onPress={() => deleteTask(item.id)} />
          </View>
        )}
      />
            
        </View>
      
    </View>
  );
};

export default FetchTask;

const styles = StyleSheet.create(
{
  container: { flex: 1, padding: 20, backgroundColor: '#fff',flexDirection:'row',gap:10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee',borderRadius:11 },
  text: { fontSize: 18 ,color:'black'},
  table1:{ width:200,},
  table2:{width:200}

}

);
