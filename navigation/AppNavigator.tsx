// /navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeGC from '../screens/HomeGC';
import HomeSupervisor from '../screens/HomeSupervisor';
import HomeLaborer from '../screens/HomeLaborer';
import ManageEmployeesScreen from '../screens/ManageEmployeesScreen';
import ClockInScreen from '../screens/ClockInScreen';
import SendMessageScreen from '../screens/SendMessageScreen';
import ViewMessagesScreen from '../screens/ViewMessagesScreen';
import PayrollSummaryScreen from '../screens/PayrollSummaryScreen';
import PayrollBySiteScreen from '../screens/PayrollBySiteScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="HomeGC" component={HomeGC} />
        <Stack.Screen name="HomeSupervisor" component={HomeSupervisor} />
        <Stack.Screen name="HomeLaborer" component={HomeLaborer} />
        <Stack.Screen name="ManageEmployees" component={ManageEmployeesScreen} />
        <Stack.Screen name="ClockIn" component={ClockInScreen} />
        <Stack.Screen name="SendMessage" component={SendMessageScreen} />
        <Stack.Screen name="ViewMessages" component={ViewMessagesScreen} />
        <Stack.Screen name="PayrollSummary" component={PayrollSummaryScreen} />
        <Stack.Screen name="PayrollBySite" component={PayrollBySiteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
