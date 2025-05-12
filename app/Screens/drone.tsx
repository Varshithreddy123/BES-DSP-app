import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ Import for navigation

// Define TypeScript interfaces
interface Drone {
  id: string;
  name: string;
  location: string;
  type: string;
  purpose: string;
  image: any; // Using 'any' for image source, could be more specific
}

// For React Native, we need to require images rather than import them
const droneImage = require('../../assets/images/download.jpg');

const DronePage: React.FC = () => {
  const router = useRouter(); // ✅ Hook for navigation

  const [drones, setDrones] = useState<Drone[]>([
    {
      id: '1',
      name: 'Hexacopter',
      location: 'Lasalgaon, Maharashtra, India',
      type: 'agribot',
      purpose: 'Spraying',
      image: droneImage
    },
    {
      id: '2',
      name: 'Quadcopter',
      location: 'Bangalore, Karnataka, India',
      type: 'surveybot',
      purpose: 'Mapping',
      image: droneImage
    },
    {
      id: '3',
      name: 'Octocopter',
      location: 'Pune, Maharashtra, India',
      type: 'agribot',
      purpose: 'Monitoring',
      image: droneImage
    }
  ]);

  const renderDroneItem = ({ item }: { item: Drone }) => (
    <View style={styles.droneItem}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.droneImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.droneDetails}>
        <Text style={styles.droneName}>{item.name}</Text>
        <Text style={styles.droneLocation}>({item.location})</Text>
        <View style={styles.droneTagsContainer}>
          <Text style={styles.droneTag}>{item.type}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.droneTag}>{item.purpose}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drones</Text>
      </View>

      {/* Drone Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countLabel}>Total Drones</Text>
        <Text style={styles.countValue}>({drones.length})</Text>
      </View>

      {/* Drone List */}
      <FlatList
        data={drones}
        renderItem={renderDroneItem}
        keyExtractor={(item) => item.id}
        style={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  countLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  countValue: {
    fontSize: 14,
  },
  listContainer: {
    backgroundColor: 'white',
  },
  droneItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  imageContainer: {
    marginRight: 12,
  },
  droneImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
  },
  droneDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  droneName: {
    fontSize: 16,
    fontWeight: '500',
  },
  droneLocation: {
    fontSize: 12,
    color: '#2962FF',
  },
  droneTagsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  droneTag: {
    fontSize: 12,
    color: '#757575',
  },
  separator: {
    fontSize: 12,
    color: '#757575',
    marginHorizontal: 4,
  },
});

export default DronePage;
