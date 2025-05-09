import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Menu options data
const menuOptions = [
  { id: 1, title: 'Locations', icon: 'location-outline', type: 'Ionicons' },
  { id: 2, title: 'Drones', icon: 'drone', type: 'MaterialCommunityIcons' },
  { id: 3, title: 'My Team', icon: 'people-outline', type: 'Ionicons' },
  { id: 4, title: 'Revenue', icon: 'trending-up', type: 'Ionicons' },
  { id: 5, title: 'Pilots', icon: 'id-card', type: 'FontAwesome5' },
  { id: 6, title: 'My Services', icon: 'share-variant', type: 'MaterialCommunityIcons' },
  { id: 7, title: 'Manage Coupons', icon: 'ticket-percent', type: 'MaterialCommunityIcons' },
  { id: 8, title: 'Invoice', icon: 'file-document-outline', type: 'MaterialCommunityIcons' },
];

export default function More() {
  // Render the appropriate icon based on type
  const renderIcon = (item: { id?: number; title?: string; icon: any; type: any; }) => {
    const iconColor = '#555';
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
      <View style={styles.header}>
        <View style={styles.indicator} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.menuGrid}>
          {menuOptions.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => console.log(`${item.title} pressed`)}>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#c0c0c0',
    borderRadius: 2,
    marginTop: 10,
  },
  scrollContainer: {
    flex: 1,
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
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
});