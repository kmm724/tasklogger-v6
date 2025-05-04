// /screens/ManageEmployeesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface Employee {
  id: string;
  name: string;
  role: string;
  site: string;
  supervisor: string;
  rate: string;
  archived?: boolean;
}

export default function ManageEmployeesScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [site, setSite] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [rate, setRate] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await AsyncStorage.getItem('employees');
    if (data) setEmployees(JSON.parse(data));
  };

  const saveEmployees = async (updated: Employee[]) => {
    await AsyncStorage.setItem('employees', JSON.stringify(updated));
    setEmployees(updated);
  };

  const addEmployee = () => {
    if (!name || !role) return;
    const newEmployee: Employee = {
      id: uuidv4(),
      name,
      role,
      site,
      supervisor,
      rate,
    };
    const updated = [...employees, newEmployee];
    saveEmployees(updated);
    setName('');
    setRole('');
    setSite('');
    setSupervisor('');
    setRate('');
  };

  const archiveEmployee = (id: string) => {
    const updated = employees.map((emp) =>
      emp.id === id ? { ...emp, archived: true } : emp
    );
    saveEmployees(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Employees</Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Role" value={role} onChangeText={setRole} style={styles.input} />
      <TextInput placeholder="Site" value={site} onChangeText={setSite} style={styles.input} />
      <TextInput placeholder="Supervisor" value={supervisor} onChangeText={setSupervisor} style={styles.input} />
      <TextInput placeholder="Hourly Rate" value={rate} onChangeText={setRate} style={styles.input} keyboardType="numeric" />
      <Button title="Add Employee" onPress={addEmployee} />

      <FlatList
        data={employees.filter((e) => !e.archived)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} — {item.role} — {item.site}</Text>
            <TouchableOpacity onPress={() => archiveEmployee(item.id)}>
              <Text style={styles.archive}>Archive</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd', flexDirection: 'row', justifyContent: 'space-between' },
  archive: { color: 'red' },
});
