import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
} from '@react-native-firebase/firestore';

const UpdateAndDeleteDoc = () => {
    const db =getFirestore();

    const deleteTask=async()=>{
        try{
    const taskRef=doc(db,'tasks','yFzStBFvSqVp8FuSIHOz');
    await deleteDoc(taskRef);
                console.log('Task deleted successfully')

        }catch(error)
        {
            console.log('Error in deleting task ',error);
            

        }


    }
    deleteTask();


   







    // const updateTask= async()=>{
    //     try{
    //         const taskRef=doc(db,'tasks','yFzStBFvSqVp8FuSIHOz');
    //         await updateDoc(taskRef,{
    //             completed:true,
    //         });
    //         console.log('Task updated successfully');
            

    //     }catch(error){
    //         console.log('Error updating task :',error);
            
    //     }
    // }
    // updateTask();

  return (
    <View>
      <Text>UpdateAndDeleteDoc</Text>
    </View>
  )
}

export default UpdateAndDeleteDoc

const styles = StyleSheet.create({})