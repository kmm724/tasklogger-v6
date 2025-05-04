// /screens/LoginScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

export default function LoginScreen() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const { setActiveUser } = useContext(AppContext);
  const navigation = useNavigation();

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
              <Picker.Item key={emp.id} label={`${emp.name} (${emp.role})`} value={emp.id} />
            ))}
          </Picker>
          <Button title="Login" onPress={handleLogin} disabled={!selectedId} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  picker: { height: 50, width: '100%' },
});
