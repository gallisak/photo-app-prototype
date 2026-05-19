import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#3b82f6',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Головна',
        }}
      />
    </Tabs>
  );
}