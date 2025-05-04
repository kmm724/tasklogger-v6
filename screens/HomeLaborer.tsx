// /screens/HomeLaborer.tsx
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';

export default function HomeLaborer() {
  const navigation = useNavigation();
  const { setActiveUser } = useContext(AppContext);

  const handleLogout = () => {
    setActiveUser(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laborer Dashboard</Text>
      <Button title="Clock In / Out" onPress={() => navigation.navigate('ClockIn')} />
      <View style={styles.spacer} />
      <Button title="Send Message" onPress={() => navigation.navigate('SendMessage')} />
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
