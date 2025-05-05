// /screens/ViewMessagesScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function ViewMessagesScreen() {
  const { activeUser } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const stored = await AsyncStorage.getItem('messages');
    const allMessages = stored ? JSON.parse(stored) : [];

    let filtered = [];

    if (activeUser.role === 'GC') {
      filtered = allMessages;
    } else {
      filtered = allMessages.filter((msg) => {
        return (
          msg.toId === activeUser.id ||
          msg.toId === activeUser.site // site-based messages
        );
      });
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setMessages(filtered);
  };

  const handleBack = () => {
    const role = activeUser?.role?.toLowerCase();
    const screen =
      role === 'gc'
        ? 'HomeGC'
        : role === 'supervisor'
        ? 'HomeSupervisor'
        : 'HomeLaborer';

    navigation.reset({
      index: 0,
      routes: [{ name: screen }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Messages</Text>

      {messages.length === 0 ? (
        <Text style={styles.noMessages}>No messages to display.</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageBox}>
              <Text style={styles.from}>From: {item.from}</Text>
              <Text style={styles.body}>{item.message}</Text>
              <Text style={styles.time}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.spacer} />
      <Button title="Back to Dashboard" onPress={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  noMessages: { textAlign: 'center', marginTop: 40 },
  messageBox: {
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 15,
  },
  from: { fontWeight: 'bold', marginBottom: 5 },
  body: { fontSize: 16 },
  time: { fontSize: 12, marginTop: 5, color: '#555' },
  spacer: { height: 20 },
});
