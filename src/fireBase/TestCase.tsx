import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import {
  collection,
  getFirestore,
  doc,
  getDoc,
} from '@react-native-firebase/firestore';

const DataScreen = () => {

  useEffect(() => {

    const fetchData = async () => {
      const db = getFirestore();

      const userDocument = doc(
        collection(db, 'testing'),
        '4Gs6nHqHJvMWxRb7Q6Iv'
      );

      const documentSnapshot = await getDoc(userDocument);

      if (documentSnapshot.exists()) {
        console.log('Printing the document:', documentSnapshot.data());
      } else {
        console.log('Document not found');
      }
    };

    fetchData();

  }, []);

  return (
    <View>
      <Text>DataScreen</Text>
    </View>
  );
};

export default DataScreen;

const styles = StyleSheet.create({});
