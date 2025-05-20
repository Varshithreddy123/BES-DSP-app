import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ActivityIndicator, 
  Modal, 
  ScrollView, 
  Switch, 
  TouchableOpacity, 
  View, 
  Text, 
  TextInput,
  Alert,
  StyleSheet,
  Platform,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Location {
  id: string;
  name: string;
  address: string;
  enabled: boolean;
}

const LocationsPage: React.FC = () => {
  const navigation = useNavigation();
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<Omit<Location, 'id'>>({ name: '', address: '', enabled: true });
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load locations from storage on mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const savedLocations = await AsyncStorage.getItem('locations');
        if (savedLocations) {
          const parsedLocations = JSON.parse(savedLocations);
          setLocations(parsedLocations);
          setFilteredLocations(parsedLocations);
        } else {
          // Initialize with default locations if none exist
          const defaultLocations = [
            { id: '1', name: 'Parijat Nagar', address: 'Parijat Nagar, Nashik, Maharashtra, India', enabled: true },
            { id: '2', name: 'Upeon', address: 'Upeon, Maharashtra 422103, India', enabled: true },
            { id: '3', name: 'Chandwad', address: '5, Dindori Road, Somwar Peth, Chandwad, Maharashtra 423101, India', enabled: true },
          ];
          setLocations(defaultLocations);
          setFilteredLocations(defaultLocations);
          await AsyncStorage.setItem('locations', JSON.stringify(defaultLocations));
        }
      } catch (error) {
        console.error('Failed to load locations', error);
        Alert.alert('Error', 'Failed to load locations');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocations();
  }, []);

  // Save to storage whenever locations change
  useEffect(() => {
    const saveLocations = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem('locations', JSON.stringify(locations));
        } catch (error) {
          console.error('Failed to save locations', error);
          Alert.alert('Error', 'Failed to save locations');
        }
      }
    };
    
    saveLocations();
  }, [locations, isLoading]);

  // Filter locations based on search query
  useEffect(() => {
    const filtered = locations.filter(location => 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [searchQuery, locations]);

  const handleToggle = async (id: string) => {
    const updatedLocations = locations.map(location => 
      location.id === id ? { ...location, enabled: !location.enabled } : location
    );
    setLocations(updatedLocations);
  };

  const handleAddLocation = async () => {
    if (!newLocation.name.trim() || !newLocation.address.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    try {
      const newLocationItem: Location = {
        id: Date.now().toString(),
        ...newLocation
      };
      
      const updatedLocations = [...locations, newLocationItem];
      setLocations(updatedLocations);
      setNewLocation({ name: '', address: '', enabled: true });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add location', error);
      Alert.alert('Error', 'Failed to add location');
    }
  };

  const handleUpdateLocation = async () => {
    if (!editLocation || !editLocation.name.trim() || !editLocation.address.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    try {
      const updatedLocations = locations.map(location => 
        location.id === editLocation.id ? editLocation : location
      );
      setLocations(updatedLocations);
      setEditLocation(null);
    } catch (error) {
      console.error('Failed to update location', error);
      Alert.alert('Error', 'Failed to update location');
    }
  };

  const handleDeleteLocation = (id: string) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const updatedLocations = locations.filter(location => location.id !== id);
              setLocations(updatedLocations);
            } catch (error) {
              console.error('Failed to delete location', error);
              Alert.alert('Error', 'Failed to delete location');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditClick = (location: Location) => {
    setEditLocation(location);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditLocation(null);
    setNewLocation({ name: '', address: '', enabled: true });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons 
            name={Platform.OS === 'android' ? 'chevron-back' : 'chevron-left'} 
            size={24} 
            color="black" 
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Locations</Text>
        
        <TouchableOpacity 
          onPress={() => setIsAddModalOpen(true)}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      {/* Locations Count */}
      <Text style={styles.locationsCount}>
        {filteredLocations.length} {filteredLocations.length === 1 ? 'Location' : 'Locations'}
      </Text>
      
      {/* Locations List */}
      <ScrollView 
        style={styles.locationsList}
        contentContainerStyle={filteredLocations.length === 0 ? styles.emptyListContainer : null}
      >
        {filteredLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No matching locations found' : 'No locations added yet'}
            </Text>
            {searchQuery ? (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                <Text style={styles.clearSearchText}>Clear search</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                onPress={() => setIsAddModalOpen(true)}
                style={styles.addFirstLocationButton}
              >
                <Text style={styles.addFirstLocationText}>Add Your First Location</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredLocations.map(location => (
            <View key={location.id} style={styles.locationCard}>
              <View style={styles.locationInfo}>
                <Ionicons 
                  name="location-sharp" 
                  size={20} 
                  color={location.enabled ? "#3b82f6" : "#94a3b8"} 
                  style={styles.locationIcon}
                />
                <View style={styles.locationDetails}>
                  <Text 
                    style={[
                      styles.locationName,
                      !location.enabled && styles.disabledLocation
                    ]}
                    numberOfLines={1}
                  >
                    {location.name}
                  </Text>
                  <Text 
                    style={[
                      styles.locationAddress,
                      !location.enabled && styles.disabledLocation
                    ]}
                    numberOfLines={2}
                  >
                    {location.address}
                  </Text>
                </View>
              </View>
              
              <View style={styles.locationActions}>
                <TouchableOpacity 
                  onPress={() => handleEditClick(location)}
                  style={styles.actionButton}
                >
                  <Ionicons name="create-outline" size={20} color="#64748b" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => handleDeleteLocation(location.id)}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#f43f5e" />
                </TouchableOpacity>
                
                <Switch
                  value={location.enabled}
                  onValueChange={() => handleToggle(location.id)}
                  trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                  thumbColor={location.enabled ? "#3b82f6" : "#f8fafc"}
                  ios_backgroundColor="#e2e8f0"
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
      
      {/* Add/Edit Location Modal */}
      <Modal
        visible={isAddModalOpen || !!editLocation}
        animationType="slide"
        transparent={false}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={handleModalClose}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editLocation ? 'Edit Location' : 'Add Location'}
            </Text>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location Name</Text>
              <TextInput
                style={styles.textInput}
                value={editLocation ? editLocation.name : newLocation.name}
                onChangeText={(text) => 
                  editLocation 
                    ? setEditLocation({...editLocation, name: text})
                    : setNewLocation({...newLocation, name: text})
                }
                placeholder="e.g. Office, Home, etc."
                placeholderTextColor="#94a3b8"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={[styles.textInput, styles.addressInput]}
                value={editLocation ? editLocation.address : newLocation.address}
                onChangeText={(text) => 
                  editLocation 
                    ? setEditLocation({...editLocation, address: text})
                    : setNewLocation({...newLocation, address: text})
                }
                placeholder="Full address"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.toggleGroup}>
              <Text style={styles.toggleLabel}>Enabled</Text>
              <Switch
                value={editLocation ? editLocation.enabled : newLocation.enabled}
                onValueChange={(value) => 
                  editLocation 
                    ? setEditLocation({...editLocation, enabled: value})
                    : setNewLocation({...newLocation, enabled: value})
                }
                trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                thumbColor={editLocation ? (editLocation.enabled ? "#3b82f6" : "#f8fafc") : (newLocation.enabled ? "#3b82f6" : "#f8fafc")}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleModalClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                (editLocation 
                  ? !editLocation.name.trim() || !editLocation.address.trim()
                  : !newLocation.name.trim() || !newLocation.address.trim()) && styles.disabledButton
              ]}
              onPress={editLocation ? handleUpdateLocation : handleAddLocation}
              disabled={
                editLocation 
                  ? !editLocation.name.trim() || !editLocation.address.trim()
                  : !newLocation.name.trim() || !newLocation.address.trim()
              }
            >
              <Text style={styles.submitButtonText}>
                {editLocation ? 'Update' : 'Add'} Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop:12,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  addButton: {
    padding: 8,
  },
  
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#1e293b',
  },
  
  // Locations Count
  locationsCount: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  
  // Locations List
  locationsList: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Location Card
  locationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  locationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  disabledLocation: {
    color: '#94a3b8',
    opacity: 0.7,
  },
  locationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 4,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  clearSearchButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearSearchText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  addFirstLocationButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstLocationText: {
    color: 'white',
    fontWeight: '500',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  modalCloseButton: {
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  
  // Form Styles
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  toggleGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#475569',
  },
  
  // Button Styles
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 16,
  },
  cancelButtonText: {
    color: '#475569',
    fontWeight: '500',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default LocationsPage;