import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EditServiceScreen from './EditServiceScreen';
import { useNavigation } from '@react-navigation/native';

interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  details: {
    locations: number;
    drones: string;
    status: 'Active' | 'Inactive';
  };
}

const ServicePage: React.FC = () => {
  const navigation = useNavigation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const services: Service[] = [
    {
      id: '1',
      name: 'Spraying',
      icon: <MaterialCommunityIcons name="drone" size={40} color="green" />,
      details: {
        locations: 4,
        drones: '10 ltr',
        status: 'Active',
      },
    },
    // Add more services here as needed
  ];

  const handleServicePress = (service: Service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    setModalVisible(false);
  };
  
  const handleCloseEdit = () => {
    setEditMode(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleUpdateService = (updatedData: any) => {
    // Update the service with the new data
    console.log(`Updating service ${selectedService?.name} with:`, updatedData);
    
    // Here you would update your service data in state or backend
    if (selectedService) {
      // Example update logic - replace with your actual data update logic
      const updatedServices = services.map(service => {
        if (service.id === selectedService.id) {
          return {
            ...service,
            details: {
              ...service.details,
              status: updatedData.status ? 'Active' : 'Inactive',
              // Add other fields as needed
            }
          };
        }
        return service;
      });
      
      // Update your state with the updated services
      // setServices(updatedServices);
    }
    
    setEditMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
          <Text style={styles.headerText}>Services</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.serviceCountContainer}>
        <Text style={styles.serviceCountText}>Total Services</Text>
        <Text style={styles.serviceCount}>({services.length})</Text>
      </View>

      <View style={styles.servicesGrid}>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() => handleServicePress(service)}
          >
            {service.icon}
            <Text style={styles.serviceText}>{service.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Service Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.modalBackButton} 
                onPress={closeModal}
              >
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
                <Text style={styles.modalHeaderText}>
                  {selectedService?.name}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={handleEdit}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={22} color="#555" />
              </View>
              <Text style={styles.detailLabel}>Locations</Text>
              <Text style={styles.detailSeparator}>:</Text>
              <Text style={styles.detailValue}>
                {selectedService?.details.locations}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="drone" size={22} color="#555" />
              </View>
              <Text style={styles.detailLabel}>Drones</Text>
              <Text style={styles.detailSeparator}>:</Text>
              <Text style={styles.detailValue}>
                {selectedService?.details.drones}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="verified" size={22} color="#555" />
              </View>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailSeparator}>:</Text>
              <Text 
                style={[
                  styles.detailValue, 
                  { 
                    color: selectedService?.details.status === 'Active' 
                      ? 'green' 
                      : 'red' 
                  }
                ]}
              >
                {selectedService?.details.status}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Edit Service Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={editMode}
        onRequestClose={handleCloseEdit}
      >
        <EditServiceScreen
          onClose={handleCloseEdit}
          onUpdate={handleUpdateService}
          initialData={{
            status: selectedService?.details.status === 'Active',
            minAcreage: '',
            tankCapacity: selectedService?.details.drones || '10 ltr',
            chemicals: [],
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
  serviceCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  serviceCountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  serviceCount: {
    fontSize: 16,
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  serviceCard: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    width: 100,
  },
  detailSeparator: {
    fontSize: 16,
    marginHorizontal: 12,
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

export default ServicePage;