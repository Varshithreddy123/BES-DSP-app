import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CouponsPage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Coupons</Text>
        
        <TouchableOpacity 
          onPress={() => router.push('/Screens/create')}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Create section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create</Text>
        <View style={styles.divider} />
      </View>

      {/* All Coupons section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Coupons (0)</Text>
        <View style={styles.divider} />
        
        {/* Empty state */}
        <View style={styles.emptyState}>
          <Image
            source={require('../../assets/images/Vector.png')}
            style={styles.finalImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>No Coupons right now!</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  finalImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});

export default CouponsPage;