// /screens/SendMessageScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function SendMessageScreen() {
  const { activeUser } = useContext(AppContext);
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await AsyncStorage.getItem('employees');
    if (data) {
      const parsed = JSON.parse(data);
      const visible = parsed.filter((e) => !e.archived);
      setEmployees(visible);
    }
  };

  const handleSend = async () => {
    if (!selectedRecipientId || !messageText.trim()) {
      Alert.alert('Error', 'Select a recipient and type a message.');
      return;
    }

    const newMessage = {
      id: uuidv4(),
      from: activeUser.name,
      fromId: activeUser.id,
      toId: selectedRecipientId,
      message: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    const stored = await AsyncStorage.getItem('messages');
    const allMessages = stored ? JSON.parse(stored) : [];
    await AsyncStorage.setItem(
      'messages',
      JSON.stringify([...allMessages, newMessage])
    );

    setMessageText('');
    setSelectedRecipientId('');
    Alert.alert('Success', 'Message sent!');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Send a Message</Text>

      <Text style={styles.label}>Select Recipient:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedRecipientId}
          onValueChange={(itemValue) => setSelectedRecipientId(itemValue)}
        >
          <Picker.Item label="Choose an employee..." value="" />
          {employees
            .filter((emp) => {
              const sender = activeUser;
              if (sender.role === 'GC') return true;
              if (sender.role === 'Supervisor')
                return emp.role === 'Laborer' && emp.site === sender.site;
              if (sender.role === 'Laborer')
                return emp.role === 'Supervisor' && emp.site === sender.site;
              return false;
            })
            .map((emp) => (
              <Picker.Item
                key={emp.id}
                label={`${emp.name} (${emp.role})`}
                value={emp.id}
              />
            ))}
        </Picker>
      </View>

      <Text style={styles.label}>Message:</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Type your message here..."
        value={messageText}
        onChangeText={setMessageText}
      />

      <Button title="Send Message" onPress={handleSend} />
      <View style={styles.spacer} />
      <Button title="Back to Dashboard" onPress={handleBack} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10 },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    minHeight: 80,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  spacer: { height: 20 },
});
