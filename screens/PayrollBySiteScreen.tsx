// /screens/PayrollBySiteScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function PayrollBySiteScreen() {
  const [groupedData, setGroupedData] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    generatePayrollBySite();
  }, []);

  const generatePayrollBySite = async () => {
    const sessionData = await AsyncStorage.getItem('sessions');
    const sessions = sessionData ? JSON.parse(sessionData) : [];

    const employeeData = await AsyncStorage.getItem('employees');
    const employees = employeeData ? JSON.parse(employeeData) : [];

    const siteMap = {};

    sessions.forEach((session) => {
      if (session.clockOut) {
        const start = new Date(session.clockIn);
        const end = new Date(session.clockOut);
        const duration = (end - start) / (1000 * 60 * 60); // in hours

        const employee = employees.find((e) => e.id === session.userId);
        if (!employee) return;

        const site = employee.site || 'Unknown Site';
        const name = employee.name || 'Unknown';
        const rate = parseFloat(employee.rate || 0);
        const pay = duration * rate;

        if (!siteMap[site]) siteMap[site] = [];

        const existing = siteMap[site].find((e) => e.name === name);

        if (existing) {
          existing.totalHours += duration;
          existing.totalPay += pay;
        } else {
          siteMap[site].push({
            name,
            totalHours: duration,
            rate,
            totalPay: pay,
          });
        }
      }
    });

    // Format numbers
    for (const site in siteMap) {
      siteMap[site] = siteMap[site].map((entry) => ({
        ...entry,
        totalHours: entry.totalHours.toFixed(2),
        totalPay: entry.totalPay.toFixed(2),
      }));
    }

    setGroupedData(siteMap);
  };

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeGC' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payroll by Job Site</Text>

      {Object.keys(groupedData).length === 0 ? (
        <Text style={styles.empty}>No payroll data available.</Text>
      ) : (
        <FlatList
          data={Object.keys(groupedData)}
          keyExtractor={(site) => site}
          renderItem={({ item: site }) => (
            <View style={styles.siteSection}>
              <Text style={styles.siteTitle}>{site}</Text>
              {groupedData[site].map((entry, index) => (
                <View key={index} style={styles.entry}>
                  <Text style={styles.name}>{entry.name}</Text>
                  <Text>Total Hours: {entry.totalHours}</Text>
                  <Text>Rate: ${entry.rate.toFixed(2)}</Text>
                  <Text>Total Pay: ${entry.totalPay}</Text>
                </View>
              ))}
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
  siteSection: { marginBottom: 30 },
  siteTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  entry: {
    backgroundColor: '#f3f3f3',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  name: { fontWeight: 'bold', marginBottom: 5 },
  spacer: { height: 20 },
});
