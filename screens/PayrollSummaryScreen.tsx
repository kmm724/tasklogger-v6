// /screens/PayrollSummaryScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

export default function PayrollSummaryScreen() {
  const [payrollData, setPayrollData] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    calculatePayroll();
  }, [startDate, endDate]);

  const calculatePayroll = async () => {
    const sessionData = await AsyncStorage.getItem('sessions');
    const sessions = sessionData ? JSON.parse(sessionData) : [];

    const employeeData = await AsyncStorage.getItem('employees');
    const employees = employeeData ? JSON.parse(employeeData) : [];

    const summary = {};

    sessions.forEach((session) => {
      if (!session.clockOut) return;

      const clockIn = new Date(session.clockIn);
      const clockOut = new Date(session.clockOut);

      // Filter by date range
      if (
        (startDate && clockIn < startDate) ||
        (endDate && clockOut > endDate)
      ) {
        return;
      }

      const employee = employees.find((e) => e.id === session.userId);
      if (!employee) return;

      const duration = (clockOut - clockIn) / (1000 * 60 * 60); // hours

      if (!summary[employee.id]) {
        summary[employee.id] = {
          name: employee.name,
          rate: parseFloat(employee.rate || 0),
          totalHours: 0,
          totalPay: 0,
        };
      }

      summary[employee.id].totalHours += duration;
      summary[employee.id].totalPay =
        summary[employee.id].totalHours * summary[employee.id].rate;
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

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payroll Summary</Text>

      <View style={styles.filterRow}>
        <Button
          title={`Start Date: ${
            startDate ? startDate.toLocaleDateString() : 'Any'
          }`}
          onPress={() => setShowStartPicker(true)}
        />
        <Button
          title={`End Date: ${endDate ? endDate.toLocaleDateString() : 'Any'}`}
          onPress={() => setShowEndPicker(true)}
        />
      </View>

      <Button title="Clear Filters" onPress={clearFilters} />

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
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
