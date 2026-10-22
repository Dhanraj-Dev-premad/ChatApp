import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import{
   getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  DocumentSnapshot,
  
} from '@react-native-firebase/firestore'

const DataScreen = () => {
  console.log("enterd in DataScreen");
  

  const db=getFirestore();
 // const taskRef =doc(db,'tasks','task001')
 

  const fetchTask= async()=>{
    const taskRef=collection(db,'tasks');
    console.log('in fetchTask');
const querySnapshort =await getDocs(taskRef);
querySnapshort.forEach(documentSnapshort =>{
  console.log(documentSnapshort.id);
  console.log(documentSnapshort.data());
})



    
  //     const snapshot= await getDoc(taskRef);
  //      if(snapshot.exists()){
  // console.log(snapshot.data());

  // }else{
  //   console.log('Task not found')
  // }


  }
  fetchTask();
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text>DataScreen</Text>
    </View>
  )

 
 
}

export default DataScreen

const styles = StyleSheet.create({})