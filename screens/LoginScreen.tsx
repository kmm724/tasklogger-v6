// /screens/LoginScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

export default function LoginScreen() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const { setActiveUser } = useContext(AppContext);
  const navigation = useNavigation();

  const GC_PIN = '2468';

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await AsyncStorage.getItem('employees');
    if (data) {
      const parsed = JSON.parse(data);
      const active = parsed.filter((e) => !e.archived);
      setEmployees(active);
    }
  };

  const handleLogin = () => {
    const user = employees.find((e) => e.id === selectedId);
    if (user) {
      setActiveUser(user);
      setModalVisible(false);

      const routeName =
        user.role.toLowerCase() === 'gc'
          ? 'HomeGC'
          : user.role.toLowerCase() === 'supervisor'
          ? 'HomeSupervisor'
          : 'HomeLaborer';

      navigation.reset({
        index: 0,
        routes: [{ name: routeName }],
      });
    }
  };

  const handlePinSubmit = () => {
    if (enteredPin === GC_PIN) {
      const gcUser = {
        id: 'gc-admin',
        name: 'GC Admin',
        role: 'GC',
        site: 'all',
      };
      setActiveUser(gcUser);
      setModalVisible(false);
      setEnteredPin('');
      setShowPinPrompt(false);

      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeGC' }],
      });
    } else {
      Alert.alert('Incorrect PIN', 'Please try again.');
      setEnteredPin('');
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select Your Profile</Text>

          <Picker
            selectedValue={selectedId}
            onValueChange={(itemValue) => setSelectedId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Choose your name..." value="" />
            {employees.map((emp) => (
              <Picker.Item
                key={emp.id}
                label={`${emp.name} (${emp.role})`}
                value={emp.id}
              />
            ))}
          </Picker>

          <Button title="Login" onPress={handleLogin} disabled={!selectedId} />
          <View style={styles.spacer} />

          <Button
            title="Log in as GC (PIN)"
            onPress={() => setShowPinPrompt(true)}
          />

          {showPinPrompt && (
            <View style={styles.pinContainer}>
              <Text style={styles.label}>Enter GC PIN:</Text>
              <TextInput
                value={enteredPin}
                onChangeText={setEnteredPin}
                secureTextEntry
                keyboardType="number-pad"
                style={styles.pinInput}
                placeholder="Enter PIN"
              />
              <Button title="Submit PIN" onPress={handlePinSubmit} />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  spacer: { height: 20 },
  pinContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: { fontSize: 16, marginBottom: 10 },
  pinInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '60%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
});
