import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {
    getFirestore,
    doc,
    setDoc,
    addDoc,
    collection
} from '@react-native-firebase/firestore'

const SaveData = () => {
    console.log("enterd in  saveData");
    
    const db =getFirestore();
  

    const saveTask=async()=>{
            const taskRef=collection(db,'tasks')

            const newTaskRef=await addDoc(taskRef,{
                title:'Learn fierstore',
                completed:false,
            })
            console.log("task id",newTaskRef.id);
            


    }
    saveTask();
   

    
















    //   const saveTask =async()=>{
    //     console.log('enteed in save task');
        
    //      const taskRef=doc(db,'tasks','task004');
    //     await setDoc(taskRef,{
    //         title:'play football',
    //         completed:'true',
    //         time:'4hr'
    //     },{ merge: true });


    //   }
    //   saveTask();

  return (
    <View>
      <Text>SaveData</Text>
    </View>
  )
}

export default SaveData

const styles = StyleSheet.create({})


