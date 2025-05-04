// /screens/ClockInScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function ClockInScreen() {
  const { activeUser } = useContext(AppContext);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [sessionStart, setSessionStart] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const data = await AsyncStorage.getItem('sessions');
    const sessions = data ? JSON.parse(data) : [];
    const existing = sessions.find(
      (s) => s.userId === activeUser.id && !s.clockOut
    );
    if (existing) {
      setIsClockedIn(true);
      setSessionStart(existing.clockIn);
    }
  };

  const handleClockIn = async () => {
    const newSession = {
      userId: activeUser.id,
      name: activeUser.name,
      site: activeUser.site,
      clockIn: new Date().toISOString(),
      clockOut: null,
    };
    const data = await AsyncStorage.getItem('sessions');
    const sessions = data ? JSON.parse(data) : [];
    await AsyncStorage.setItem(
      'sessions',
      JSON.stringify([...sessions, newSession])
    );
    setIsClockedIn(true);
    setSessionStart(newSession.clockIn);
  };

  const handleClockOut = async () => {
    const data = await AsyncStorage.getItem('sessions');
    const sessions = data ? JSON.parse(data) : [];
    const updated = sessions.map((s) =>
      s.userId === activeUser.id && !s.clockOut
        ? { ...s, clockOut: new Date().toISOString() }
        : s
    );
    await AsyncStorage.setItem('sessions', JSON.stringify(updated));
    setIsClockedIn(false);
    setSessionStart('');
  };

  const handleBack = () => {
    const role = activeUser?.role?.toLowerCase();
    const screen =
      role === 'gc'
        ? 'HomeGC'
        : role === 'supervisor'
        ? 'HomeSupervisor'
        : 'HomeLaborer';

    navigation.reset({
      index: 0,
      routes: [{ name: screen }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clock In / Out</Text>
      {isClockedIn ? (
        <>
          <Text style={styles.status}>
            Clocked in at: {new Date(sessionStart).toLocaleTimeString()}
          </Text>
          <Button title="Clock Out" onPress={handleClockOut} />
        </>
      ) : (
        <Button title="Clock In" onPress={handleClockIn} />
      )}
      <View style={styles.spacer} />
      <Button title="Back to Dashboard" onPress={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 30, textAlign: 'center' },
  status: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  spacer: { height: 20 },
});
