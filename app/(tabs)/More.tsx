import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

const menuOptions = [
  { id: 1, title: 'Locations', icon: 'location-outline', type: 'Ionicons', path: '/Screens/location' },
  { id: 2, title: 'Drones', icon: 'drone', type: 'MaterialCommunityIcons', path: '/Screens/drone' },
  { id: 3, title: 'My Team', icon: 'people-outline', type: 'Ionicons', path: '/Screens/team' },
  { id: 4, title: 'Revenue', icon: 'trending-up', type: 'Ionicons', path: '/Screens/revenue' },
  { id: 5, title: 'Pilots', icon: 'id-card', type: 'FontAwesome5', path: '/Screens/pilots' },
  { id: 6, title: 'My Services', icon: 'link', type: 'MaterialCommunityIcons', path: '/Screens/service' },
  { id: 7, title: 'Manage Coupons', icon: 'ticket-percent', type: 'MaterialCommunityIcons', path: '/Screens/coupons' },
  { id: 8, title: 'Invoice', icon: 'file-document-outline', type: 'MaterialCommunityIcons', path: '/Screens/invoice' },
];

export default function More() {
  const router = useRouter();

  const handleNavigation = (path: string, title: string) => {
    console.log(`Navigating to ${title}`);
    router.push(path as any);
  };

  const renderIcon = (item: { id?: number; title?: string; icon: any; type: any; path?: string; }) => {
    const iconColor = '#1976D2';
    const iconSize = 24;

    switch (item.type) {
      case 'Ionicons':
        return <Ionicons name={item.icon} size={iconSize} color={iconColor} />;
      case 'MaterialIcons':
        return <MaterialIcons name={item.icon} size={iconSize} color={iconColor} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={item.icon} size={iconSize} color={iconColor} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={item.icon} size={iconSize} color={iconColor} />;
      default:
        return <Ionicons name="help-outline" size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Stack Screen with Header Configuration */}
      <Stack.Screen 
        options={{
          title: 'More Options',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo
                    name="chevron-left"
                    size={28}
                    color="black"
                    style={{ marginLeft: 10 }} // or marginRight, marginVertical, etc.
               />

            </TouchableOpacity>
          ),
          headerTitleStyle: {
            color: 'black',
            fontWeight: '600',
          },
        }}
      />
      
      {/* Content */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.menuGrid}>
          {menuOptions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem} 
              onPress={() => handleNavigation(item.path, item.title)}
            >
              <View style={styles.iconContainer}>
                {renderIcon(item)}
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 10, // Added some top padding
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  menuItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});