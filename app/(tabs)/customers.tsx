import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Ionicons, 
  MaterialIcons, 
  FontAwesome, 
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  Entypo
} from '@expo/vector-icons';

interface Customer {
  id: string;
  name: string;
  requestCount: number;
  mobile: string;
  address: string;
  farmSize: string;
  cropType: string;
  status?: 'Active' | 'Canceled' | 'Completed' | 'Pending';
  lastServiceDate?: string;
  organization?: string;
  paymentStatus?: 'Paid' | 'Unpaid' | 'Partial';
}

export default function CustomersPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([
    { 
      id: '1', 
      name: 'Janardan Bahusaheb Fund', 
      requestCount: 12,
      mobile: '860556510',
      address: 'Wakad, Maharashtra, India',
      farmSize: '45 acres',
      cropType: 'Cotton',
      status: 'Active',
      lastServiceDate: '2023-11-15',
      organization: 'Janardan Agri Farms',
      paymentStatus: 'Paid'
    },
    { 
      id: '2', 
      name: 'Subnder Gestah', 
      requestCount: 8,
      mobile: '9876543210',
      address: 'Nashik, Maharashtra',
      farmSize: '32 acres',
      cropType: 'Soybean',
      status: 'Completed',
      lastServiceDate: '2023-11-10',
      paymentStatus: 'Paid'
    },
    { 
      id: '3', 
      name: 'Rakesh Farm Solutions', 
      requestCount: 5,
      mobile: '8765432109',
      address: 'Pune, Maharashtra',
      farmSize: '28 acres',
      cropType: 'Wheat',
      status: 'Pending',
      lastServiceDate: '2023-11-05',
      paymentStatus: 'Partial'
    },
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddCustomer = () => {
    // Navigation or modal to add new customer
    console.log('Add new customer');
  };

  const handleCustomerPress = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };

  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'Active': return '#4CAF50';
      case 'Completed': return '#2196F3';
      case 'Canceled': return '#F44336';
      case 'Pending': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getPaymentColor = (status?: string) => {
    switch(status) {
      case 'Paid': return '#4CAF50';
      case 'Partial': return '#FFC107';
      case 'Unpaid': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Stack */}
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: 'white' },
          headerTitle: "AgriDrone Customers",
          headerTitleStyle: { color: 'black', fontSize: 20, fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity 
              style={{ marginLeft: 16 }}
              onPress={() => {
                // Navigate back
                try {
                  // For expo-router navigation
                  router.back();
                } catch (error) {
                  console.log('Navigation error:', error);
                }
              }}
            >
              <Entypo name="chevron-left" size={28} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search farms or customers..."
          placeholderTextColor="#9ca3af"
          value={searchText}
          onChangeText={setSearchText}
        />
        <MaterialCommunityIcons name="filter-outline" size={20} color="#6b7280" />
      </View>
      
      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.customerItem} 
            onPress={() => handleCustomerPress(item)}
          >
            <View style={styles.avatarContainer}>
              <FontAwesome5 name="user-tie" size={18} color="#1976D2" />
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{item.name}</Text>
              <View style={styles.customerMeta}>
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons name="map-marker" size={14} color="#6b7280" />
                  <Text style={styles.metaText}>{item.address.split(',')[0]}</Text>
                </View>
                <View style={styles.metaItem}>
                  <FontAwesome5 name="seedling" size={14} color="#6b7280" />
                  <Text style={styles.metaText}>{item.cropType}</Text>
                </View>
              </View>
            </View>
            <View style={styles.serviceCount}>
              <FontAwesome5 name="fan" size={14} color="#1976D2" />
              <Text style={styles.requestCount}>{item.requestCount}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      
      {/* Add Customer Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddCustomer}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
      
      {/* Customer Details Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedCustomer && (
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="chevron-back" size={28} color="#1976D2" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Customer Details</Text>
              <TouchableOpacity>
                <Entypo name="dots-three-vertical" size={20} color="#1976D2" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.profileAvatar}>
                  <FontAwesome5 name="user-tie" size={32} color="#1976D2" />
                </View>
                <Text style={styles.customerNameLarge}>{selectedCustomer.name}</Text>
                {selectedCustomer.organization && (
                  <Text style={styles.organizationText}>
                    <MaterialIcons name="business" size={16} color="#6b7280" /> {selectedCustomer.organization}
                  </Text>
                )}
              </View>
              
              {/* Farm Details Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <FontAwesome5 name="tractor" size={20} color="#1976D2" />
                  <Text style={styles.cardTitle}>Farm Details</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={20} color="#6b7280" />
                  <Text style={styles.detailText}>{selectedCustomer.address}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <FontAwesome5 name="seedling" size={20} color="#6b7280" />
                  <Text style={styles.detailText}>{selectedCustomer.cropType}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="tape-measure" size={20} color="#6b7280" />
                  <Text style={styles.detailText}>{selectedCustomer.farmSize}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Feather name="phone" size={20} color="#6b7280" />
                  <Text style={styles.detailText}>{selectedCustomer.mobile}</Text>
                </View>
              </View>
              
              {/* Service History Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="drone" size={20} color="#1976D2" />
                  <Text style={styles.cardTitle}>Service History</Text>
                </View>
                
                <View style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <FontAwesome5 name="drone" size={16} color="#1976D2" />
                    <Text style={styles.serviceLabel}>Total Services</Text>
                  </View>
                  <Text style={styles.serviceValue}>{selectedCustomer.requestCount}</Text>
                </View>
                
                {selectedCustomer.lastServiceDate && (
                  <View style={styles.serviceRow}>
                    <View style={styles.serviceInfo}>
                      <MaterialCommunityIcons name="calendar" size={16} color="#1976D2" />
                      <Text style={styles.serviceLabel}>Last Service</Text>
                    </View>
                    <Text style={styles.serviceValue}>{selectedCustomer.lastServiceDate}</Text>
                  </View>
                )}
                
                <View style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <MaterialCommunityIcons name="progress-check" size={16} color="#1976D2" />
                    <Text style={styles.serviceLabel}>Status</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(selectedCustomer.status) }
                  ]}>
                    <Text style={styles.statusText}>{selectedCustomer.status}</Text>
                  </View>
                </View>
                
                <View style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <MaterialCommunityIcons name="cash" size={16} color="#1976D2" />
                    <Text style={styles.serviceLabel}>Payment</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getPaymentColor(selectedCustomer.paymentStatus) }
                  ]}>
                    <Text style={styles.statusText}>{selectedCustomer.paymentStatus}</Text>
                  </View>
                </View>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.messageButton}>
                  <MaterialCommunityIcons name="message-text" size={20} color="#1976D2" />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.primaryButton}>
                  <MaterialCommunityIcons name="calendar-plus" size={20} color="white" />
                  <Text style={styles.primaryButtonText}>New Service</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1976D2',
    marginLeft: 10,
    flex: 1,
  },
  notificationIcon: {
    padding: 4,
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  listContainer: {
    paddingBottom: 80,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarContainer: {
    backgroundColor: '#e3f2fd',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  customerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  serviceCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  requestCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#1976D2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    backgroundColor: '#e3f2fd',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerNameLarge: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  organizationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#4b5563',
    marginLeft: 12,
    flex: 1,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceLabel: {
    fontSize: 15,
    color: '#6b7280',
    marginLeft: 8,
  },
  serviceValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 14,
    borderRadius: 10,
    marginRight: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1976D2',
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 10,
    marginLeft: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginLeft: 8,
  },
});