// /navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeGC from '../screens/HomeGC';
import HomeSupervisor from '../screens/HomeSupervisor';
import HomeLaborer from '../screens/HomeLaborer';
import ManageEmployeesScreen from '../screens/ManageEmployeesScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeGC" component={HomeGC} />
        <Stack.Screen name="HomeSupervisor" component={HomeSupervisor} />
        <Stack.Screen name="HomeLaborer" component={HomeLaborer} />
        <Stack.Screen name="ManageEmployees" component={ManageEmployeesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
