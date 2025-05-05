// /screens/HomeGC.tsx
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';

export default function HomeGC() {
  const navigation = useNavigation();
  const { setActiveUser } = useContext(AppContext);

  const handleLogout = () => {
    setActiveUser(null);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GC Dashboard</Text>

      <Button title="Manage Employees" onPress={() => navigation.navigate('ManageEmployees')} />
      <View style={styles.spacer} />

      <Button title="Send Message" onPress={() => navigation.navigate('SendMessage')} />
      <View style={styles.spacer} />

      <Button title="View Messages" onPress={() => navigation.navigate('ViewMessages')} />
      <View style={styles.spacer} />

      <Button title="Payroll Summary" onPress={() => navigation.navigate('PayrollSummary')} />
      <View style={styles.spacer} />

      <Button title="Payroll by Site" onPress={() => navigation.navigate('PayrollBySite')} />
      <View style={styles.spacer} />

      <Button title="Export Payroll" onPress={() => navigation.navigate('PayrollExport')} />
      <View style={styles.spacer} />

      <Button title="Back to Login" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 30, textAlign: 'center' },
  spacer: { height: 20 },
});
