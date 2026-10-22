import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const tasks = [
  { id: '1', title: 'Learn Firebase' },
  { id: '2', title: 'Practice React Native' },
  { id: '3', title: 'Build Task App' },
];

const displayFlatlistData = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ padding: 15, fontSize: 18 }}>
            {item.title}
          </Text>
        )}
      />
    </View>
  );
};

export default displayFlatlistData

const styles = StyleSheet.create({})