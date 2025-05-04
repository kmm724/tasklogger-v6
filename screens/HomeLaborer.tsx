// /screens/HomeLaborer.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import ClockInOutButton from '../components/ClockInOutButton';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeLaborer() {
  const { setActiveUser } = useContext(AppContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    setActiveUser(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Laborer Dashboard</Text>
      <ClockInOutButton />
      <View style={styles.spacer} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  spacer: { height: 40 },
});
