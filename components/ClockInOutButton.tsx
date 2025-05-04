// /components/ClockInOutButton.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface Session {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string | null;
}

export default function ClockInOutButton() {
  const { activeUser } = useContext(AppContext);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const data = await AsyncStorage.getItem('sessions');
    if (data) {
      const sessions = JSON.parse(data);
      const latest = sessions.find(
        (s: Session) => s.employeeId === activeUser?.id && s.endTime === null
      );
      if (latest) setCurrentSession(latest);
    }
  };

  const saveSession = async (session: Session) => {
    const data = await AsyncStorage.getItem('sessions');
    const sessions = data ? JSON.parse(data) : [];
    const updated = [...sessions.filter((s: Session) => s.id !== session.id), session];
    await AsyncStorage.setItem('sessions', JSON.stringify(updated));
  };

  const handleClockIn = async () => {
    const newSession: Session = {
      id: uuidv4(),
      employeeId: activeUser.id,
      startTime: new Date().toISOString(),
      endTime: null,
    };
    await saveSession(newSession);
    setCurrentSession(newSession);
  };

  const handleClockOut = async () => {
    if (!currentSession) return;
    const updatedSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
    };
    await saveSession(updatedSession);
    setCurrentSession(null);
  };

  return (
    <View style={styles.container}>
      {currentSession ? (
        <>
          <Text style={styles.text}>You're currently ON SITE.</Text>
          <Button title="Clock Out" onPress={handleClockOut} />
        </>
      ) : (
        <>
          <Text style={styles.text}>You're currently OFF SITE.</Text>
          <Button title="Clock In" onPress={handleClockIn} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 20, alignItems: 'center' },
  text: { marginBottom: 10, fontSize: 16 },
});
