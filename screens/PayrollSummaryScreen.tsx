// /screens/PayrollSummaryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function PayrollSummaryScreen() {
  const [payrollData, setPayrollData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    calculatePayroll();
  }, []);

  const calculatePayroll = async () => {
    const sessionData = await AsyncStorage.getItem('sessions');
    const sessions = sessionData ? JSON.parse(sessionData) : [];

    const employeeData = await AsyncStorage.getItem('employees');
    const employees = employeeData ? JSON.parse(employeeData) : [];

    const summary = {};

    sessions.forEach((session) => {
      if (session.clockOut) {
        const start = new Date(session.clockIn);
        const end = new Date(session.clockOut);
        const duration = (end - start) / (1000 * 60 * 60); // hours
        const id = session.userId;

        if (!summary[id]) {
          const employee = employees.find((e) => e.id === id);
          summary[id] = {
            name: employee?.name || 'Unknown',
            rate: parseFloat(employee?.rate || 0),
            totalHours: 0,
            totalPay: 0,
          };
        }

        summary[id].totalHours += duration;
        summary[id].totalPay = summary[id].totalHours * summary[id].rate;
      }
    });

    const formatted = Object.values(summary).map((entry) => ({
      ...entry,
      totalHours: entry.totalHours.toFixed(2),
      totalPay: entry.totalPay.toFixed(2),
    }));

    setPayrollData(formatted);
  };

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeGC' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payroll Summary</Text>

      {payrollData.length === 0 ? (
        <Text style={styles.empty}>No payroll data available.</Text>
      ) : (
        <FlatList
          data={payrollData}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Total Hours: {item.totalHours}</Text>
              <Text>Rate: ${item.rate.toFixed(2)} / hr</Text>
              <Text>Total Pay: ${item.totalPay}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.spacer} />
      <Button title="Back to GC Dashboard" onPress={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  empty: { textAlign: 'center', marginTop: 40 },
  card: {
    padding: 15,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    marginBottom: 15,
  },
  name: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  spacer: { height: 20 },
});
