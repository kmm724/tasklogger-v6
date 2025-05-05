// /screens/PayrollExportScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';

export default function PayrollExportScreen() {
  const [exportText, setExportText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    generateExportText();
  }, []);

  const generateExportText = async () => {
    const sessionData = await AsyncStorage.getItem('sessions');
    const sessions = sessionData ? JSON.parse(sessionData) : [];

    const employeeData = await AsyncStorage.getItem('employees');
    const employees = employeeData ? JSON.parse(employeeData) : [];

    const summary = {};

    sessions.forEach((session) => {
      if (!session.clockOut) return;

      const clockIn = new Date(session.clockIn);
      const clockOut = new Date(session.clockOut);
      const duration = (clockOut - clockIn) / (1000 * 60 * 60); // in hours

      const employee = employees.find((e) => e.id === session.userId);
      if (!employee) return;

      if (!summary[employee.name]) {
        summary[employee.name] = {
          rate: parseFloat(employee.rate || 0),
          totalHours: 0,
          totalPay: 0,
        };
      }

      summary[employee.name].totalHours += duration;
      summary[employee.name].totalPay =
        summary[employee.name].totalHours * summary[employee.name].rate;
    });

    let output = `TaskLogger Payroll Export\n========================\n`;

    for (const name in summary) {
      const entry = summary[name];
      output += `\nName: ${name}\n`;
      output += `Total Hours: ${entry.totalHours.toFixed(2)}\n`;
      output += `Rate: $${entry.rate.toFixed(2)} / hr\n`;
      output += `Total Pay: $${entry.totalPay.toFixed(2)}\n`;
      output += `------------------------\n`;
    }

    setExportText(output);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(exportText);
    Alert.alert('Copied', 'Payroll summary copied to clipboard.');
  };

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeGC' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payroll Export</Text>
      <ScrollView style={styles.scrollBox}>
        <Text style={styles.exportText}>{exportText}</Text>
      </ScrollView>

      <View style={styles.spacer} />
      <Button title="Copy to Clipboard" onPress={copyToClipboard} />
      <View style={styles.spacer} />
      <Button title="Back to GC Dashboard" onPress={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  scrollBox: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  exportText: { fontFamily: 'monospace', fontSize: 14 },
  spacer: { height: 20 },
});
