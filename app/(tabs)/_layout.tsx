import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function _layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#333', tabBarInactiveTintColor: '#999' }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="planner" 
        options={{
          title: "Planner",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="customers" 
        options={{
          title: "Customers",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="requests" 
        options={{
          title: "Requests",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="box" size={size-2} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="More" 
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="more-horiz" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}