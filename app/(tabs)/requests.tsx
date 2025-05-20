import React, { useState } from 'react';
import {
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  Platform, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  Image
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, Entypo, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Stack } from 'expo-router';

interface RequestItem {
  id: string;
  name: string;
  location: string;
  status: string;
  date?: string;
  mobileNumber?: string;
  fieldArea?: string;
  cropType?: string;
  agrochemical?: string;
  farmerImage?: string;
  fieldImage?: string;
  notes?: string;
}

const RequestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState({ open: false, mode: 'from' });
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [isLocationPopupVisible, setLocationPopupVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  
  const [formData, setFormData] = useState({
    mobileNumber: '',
    name: '',
    serviceLocation: 'Saykheda',
    exactLocation: '',
    date: dayjs().format('DD-MM-YYYY'),
    fieldArea: '',
    cropType: '',
    agrochemical: '',
    farmerImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    fieldImage: 'https://source.unsplash.com/random/300x200?farm',
    notes: ''
  });

  // Generate mock data with more details
  const [requestList, setRequestList] = useState<RequestItem[]>(
    Array.from({ length: 130 }, (_, i) => {
      const daysAgo = i % 30;
      const date = dayjs().subtract(daysAgo, 'day').format('DD-MM-YYYY');
      
      return {
        id: `${8734210201 + i}`,
        name: i % 2 === 0 ? 'Niphad | Janardan Bhausaheb Pund' : 'Wakad | Suresh Dada Patil',
        location: i % 3 === 0 ? 'Wakad, Maharashtra, India' : 
                 (i % 3 === 1 ? 'Niphad, Maharashtra, India' : 'Saykheda, Maharashtra, India'),
        status: i % 4 === 0 ? 'Cancelled' : (i % 4 === 1 ? 'Completed' : 'Pending'),
        date: date,
        mobileNumber: `98765${43210 + i}`,
        fieldArea: (5 + (i % 10)).toString(),
        cropType: i % 3 === 0 ? 'Cotton' : (i % 3 === 1 ? 'Soybean' : 'Wheat'),
        agrochemical: i % 3 === 0 ? 'Herbicide' : (i % 3 === 1 ? 'Insecticide' : 'Fungicide'),
        farmerImage: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i % 100}.jpg`,
        fieldImage: `https://source.unsplash.com/random/300x200?farm,${i % 10}`,
        notes: i % 2 === 0 ? 'Need to spray before next week as pest attack is increasing' : 'Regular seasonal spraying required'
      };
    })
  );

  // Enhanced filtering with date support
  const filteredData = requestList.filter(item => {
    const matchesSearch = item.id.includes(searchQuery) || 
                         item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = location === '' || 
                           item.location.toLowerCase().includes(location.toLowerCase());
    const matchesStatus = status === '' || 
                          item.status.toLowerCase() === status.toLowerCase();
    
    // Date filtering
    let matchesDate = true;
    if (fromDate) {
      const itemDate = dayjs(item.date, 'DD-MM-YYYY');
      matchesDate = matchesDate && itemDate.isAfter(dayjs(fromDate).subtract(1, 'day'));
    }
    if (toDate) {
      const itemDate = dayjs(item.date, 'DD-MM-YYYY');
      matchesDate = matchesDate && itemDate.isBefore(dayjs(toDate).add(1, 'day'));
    }
    
    return matchesSearch && matchesLocation && matchesStatus && matchesDate;
  });

  // Date picker handlers
  const showDatePicker = (mode: 'from' | 'to') => {
    setDatePickerVisible({ open: true, mode });
  };

  const hideDatePicker = () => {
    setDatePickerVisible({ ...isDatePickerVisible, open: false });
  };

  const handleDateConfirm = (date: Date) => {
    if (isDatePickerVisible.mode === 'from') {
      setFromDate(date);
    } else {
      setToDate(date);
    }
    hideDatePicker();
  };

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCreateRequest = () => {
    // Validate required fields
    if (!formData.mobileNumber || !formData.name || !formData.exactLocation || 
        !formData.fieldArea || !formData.cropType || !formData.agrochemical) {
      alert('Please fill in all required fields.');
      return;
    }

    // Create new request with current date
    const newRequest: RequestItem = {
      id: Date.now().toString(),
      name: `${formData.serviceLocation} | ${formData.name}`,
      location: formData.exactLocation,
      status: 'Pending',
      date: formData.date,
      mobileNumber: formData.mobileNumber,
      fieldArea: formData.fieldArea,
      cropType: formData.cropType,
      agrochemical: formData.agrochemical,
      farmerImage: formData.farmerImage,
      fieldImage: formData.fieldImage,
      notes: formData.notes
    };

    // Add to beginning of list
    setRequestList(prev => [newRequest, ...prev]);
    
    // Reset form and close modal
    setFormData({
      mobileNumber: '',
      name: '',
      serviceLocation: 'Saykheda',
      exactLocation: '',
      date: dayjs().format('DD-MM-YYYY'),
      fieldArea: '',
      cropType: '',
      agrochemical: '',
      farmerImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      fieldImage: 'https://source.unsplash.com/random/300x200?farm',
      notes: ''
    });
    setCreateFormVisible(false);
  };

  const applyFilters = () => {
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setLocation('');
    setStatus('');
    setFromDate(null);
    setToDate(null);
  };

  // Handler for viewing request details
  const handleViewRequest = (item: RequestItem) => {
    setSelectedRequest(item);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setSelectedRequest(null);
  };

  // Render request item with press handler
  const renderRequestItem = ({ item }: { item: RequestItem }) => (
    <TouchableOpacity 
      style={styles.requestItem} 
      onPress={() => handleViewRequest(item)}
      activeOpacity={0.7}
    >
      <Ionicons name="hardware-chip-outline" size={24} color="#4CAF50" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600' }}>{item.id}</Text>
        <Text style={{ color: '#666' }}>{item.name}</Text>
        <Text style={{ color: '#666' }}>{item.location}</Text>
      </View>
      <Text style={{ 
        color: item.status === 'Cancelled' ? 'red' : 
              (item.status === 'Completed' ? 'green' : 'orange'), 
        fontWeight: '600' 
      }}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  // Platform-specific styles
  const platformStyles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Platform.select({ ios: 0, android: 16 }),
      paddingHorizontal: 16,
      paddingBottom: 16
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 12,
      width: Platform.select({ ios: '85%', android: '90%' }),
      maxHeight: Platform.select({ ios: '70%', android: '80%' })
    },
    pickerContainer: {
      borderWidth: Platform.select({ ios: 1, android: 0 }),
      borderColor: '#ccc',
      borderRadius: 8,
      marginBottom: 15,
      overflow: 'hidden'
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Stack Screen with Header Configuration */}
      <Stack.Screen 
        options={{
          title: 'Requests',
          headerStyle: { backgroundColor: 'white' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Entypo
                name="chevron-left"
                size={28}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Sprayed Area Summary */}
        <View style={styles.summaryContainer}>
          <Text>Total Sprayed Area: <Text style={{ fontWeight: 'bold' }}>73.50</Text> Acres</Text>
          <Text>Sprayed Tanks: <Text style={{ fontWeight: 'bold' }}>0</Text></Text>
        </View>

        {/* Search + Filter */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search request by request number ..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Request List */}
        <Text style={{ marginVertical: 12, fontWeight: 'bold' }}>
          Total Requests ({filteredData.length})
        </Text>
        
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderRequestItem}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text>No requests found.</Text>
            </View>
          )}
        />
      </View>

      {/* Floating Action Button for Create Request */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setCreateFormVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal visible={isFilterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[platformStyles.modalContent, { maxHeight: '70%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Requests</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent}>
              {/* Location Picker */}
              <Text style={styles.filterLabel}>Location</Text>
              <View style={platformStyles.pickerContainer}>
                <Picker
                  selectedValue={location}
                  onValueChange={setLocation}
                >
                  <Picker.Item label="All Locations" value="" />
                  <Picker.Item label="Wakad" value="Wakad" />
                  <Picker.Item label="Niphad" value="Niphad" />
                  <Picker.Item label="Saykheda" value="Saykheda" />
                </Picker>
              </View>

              {/* Status Picker */}
              <Text style={styles.filterLabel}>Status</Text>
              <View style={platformStyles.pickerContainer}>
                <Picker
                  selectedValue={status}
                  onValueChange={setStatus}
                >
                  <Picker.Item label="All Statuses" value="" />
                  <Picker.Item label="Pending" value="Pending" />
                  <Picker.Item label="Completed" value="Completed" />
                  <Picker.Item label="Cancelled" value="Cancelled" />
                </Picker>
              </View>

              {/* Date Range */}
              <Text style={styles.filterLabel}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => showDatePicker('from')}
                >
                  <Text>{fromDate ? dayjs(fromDate).format('DD MMM YYYY') : 'From Date'}</Text>
                </TouchableOpacity>
                <Text style={styles.dateRangeSeparator}>to</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => showDatePicker('to')}
                >
                  <Text>{toDate ? dayjs(toDate).format('DD MMM YYYY') : 'To Date'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[styles.filterButton, styles.resetButton]}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, styles.applyButton]}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Request Modal */}
      <Modal visible={isCreateFormVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Request</Text>
              <TouchableOpacity onPress={() => setCreateFormVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Customer Details */}
              <Text style={styles.sectionTitle}>Customer Details</Text>

              <Text style={styles.inputLabel}>Mobile Number <Text style={{color: 'red'}}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChangeText={(text) => handleInputChange('mobileNumber', text)}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Name <Text style={{color: 'red'}}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter customer name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />

              {/* Service Details */}
              <Text style={styles.sectionTitle}>Service Details</Text>

              <Text style={styles.inputLabel}>Location</Text>
              <View style={platformStyles.pickerContainer}>
                <Picker
                  selectedValue={formData.serviceLocation}
                  onValueChange={(val) => handleInputChange('serviceLocation', val)}
                >
                  <Picker.Item label="Saykheda" value="Saykheda" />
                  <Picker.Item label="Wakad" value="Wakad" />
                  <Picker.Item label="Niphad" value="Niphad" />
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Exact Service Location <Text style={{color: 'red'}}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Chosen Location from Map"
                value={formData.exactLocation}
                editable={false}
              />

              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => setLocationPopupVisible(true)}
              >
                <Text style={{ color: '#007bff' }}>Choose Exact Service Location On Map</Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => showDatePicker('from')}
              >
                <Text>{formData.date}</Text>
              </TouchableOpacity>

              {/* Spraying Details */}
              <Text style={styles.sectionTitle}>Spraying Details</Text>

              <Text style={styles.inputLabel}>Field Area (Acres) <Text style={{color: 'red'}}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter field area"
                value={formData.fieldArea}
                onChangeText={(text) => handleInputChange('fieldArea', text)}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Crop <Text style={{color: 'red'}}>*</Text></Text>
              <View style={platformStyles.pickerContainer}>
                <Picker
                  selectedValue={formData.cropType}
                  onValueChange={(val) => handleInputChange('cropType', val)}
                >
                  <Picker.Item label="Select Crop Type" value="" />
                  <Picker.Item label="Cotton" value="Cotton" />
                  <Picker.Item label="Soybean" value="Soybean" />
                  <Picker.Item label="Wheat" value="Wheat" />
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Agrochemical <Text style={{color: 'red'}}>*</Text></Text>
              <View style={platformStyles.pickerContainer}>
                <Picker
                  selectedValue={formData.agrochemical}
                  onValueChange={(val) => handleInputChange('agrochemical', val)}
                >
                  <Picker.Item label="Select Agrochemical" value="" />
                  <Picker.Item label="Herbicide" value="Herbicide" />
                  <Picker.Item label="Insecticide" value="Insecticide" />
                  <Picker.Item label="Fungicide" value="Fungicide" />
                </Picker>
              </View>

              {/* Additional Notes */}
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Enter any additional notes..."
                value={formData.notes}
                onChangeText={(text) => handleInputChange('notes', text)}
                multiline
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateRequest}
            >
              <Text style={styles.createButtonText}>Create Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Popup Modal */}
      <Modal visible={isLocationPopupVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '60%' }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setLocationPopupVisible(false)}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Location</Text>
              <TouchableOpacity onPress={() => setLocationPopupVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.locationFormContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Location"
                placeholderTextColor="#999"
              />

              <ScrollView style={{ flex: 1, marginTop: 10 }}>
                <TouchableOpacity
                  style={styles.locationSuggestion}
                  onPress={() => {
                    handleInputChange('exactLocation', 'Parijat Nagar, Wakad, Pune, Maharashtra, India');
                    setLocationPopupVisible(false);
                  }}
                >
                  <Text style={styles.locationText}>Parijat Nagar, Wakad</Text>
                  <Text style={styles.locationSubtext}>Wakad, Pune, Maharashtra, India</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.locationSuggestion}
                  onPress={() => {
                    handleInputChange('exactLocation', 'Datta Mandir Road, Wakad, Pune, Maharashtra, India');
                    setLocationPopupVisible(false);
                  }}
                >
                  <Text style={styles.locationText}>Datta Mandir Road, Wakad</Text>
                  <Text style={styles.locationSubtext}>Wakad, Pune, Maharashtra, India</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Request Details Modal */}
      <Modal visible={!!selectedRequest} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '95%', maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Details</Text>
              <TouchableOpacity onPress={closeDetailsModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <ScrollView style={styles.detailsContainer}>
                {/* Header with status */}
                <View style={styles.detailsHeader}>
                  <Text style={styles.detailsId}>#{selectedRequest.id}</Text>
                  <View style={[
                    styles.statusBadge,
                    selectedRequest.status === 'Completed' && styles.completedBadge,
                    selectedRequest.status === 'Cancelled' && styles.cancelledBadge
                  ]}>
                    <Text style={styles.statusText}>{selectedRequest.status}</Text>
                  </View>
                </View>

                {/* Customer Info */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Customer Information</Text>
                  <View style={styles.customerRow}>
                    <Image 
                      source={{ uri: selectedRequest.farmerImage }} 
                      style={styles.avatar} 
                    />
                    <View style={styles.customerInfo}>
                      <Text style={styles.customerName}>{selectedRequest.name}</Text>
                      <Text style={styles.customerPhone}>
                        <MaterialIcons name="phone" size={16} color="#666" /> 
                        {selectedRequest.mobileNumber}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Service Info */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Service Information</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>{selectedRequest.location}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>{selectedRequest.date}</Text>
                  </View>
                </View>

                {/* Field Info */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Field Information</Text>
                  <Image 
                    source={{ uri: selectedRequest.fieldImage }} 
                    style={styles.fieldImage} 
                  />
                  <View style={styles.fieldDetails}>
                    <View style={styles.fieldDetailItem}>
                      <Text style={styles.fieldDetailLabel}>Area</Text>
                      <Text style={styles.fieldDetailValue}>{selectedRequest.fieldArea} Acres</Text>
                    </View>
                    <View style={styles.fieldDetailItem}>
                      <Text style={styles.fieldDetailLabel}>Crop</Text>
                      <Text style={styles.fieldDetailValue}>{selectedRequest.cropType}</Text>
                    </View>
                    <View style={styles.fieldDetailItem}>
                      <Text style={styles.fieldDetailLabel}>Agrochemical</Text>
                      <Text style={styles.fieldDetailValue}>{selectedRequest.agrochemical}</Text>
                    </View>
                  </View>
                </View>

                {/* Notes */}
                {selectedRequest.notes && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Additional Notes</Text>
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesText}>{selectedRequest.notes}</Text>
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  {selectedRequest.status === 'Pending' && (
                    <>
                      <TouchableOpacity style={[styles.actionButton, styles.completeButton]}>
                        <Text style={styles.actionButtonText}>Mark as Complete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
                        <Text style={styles.actionButtonText}>Cancel Request</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                    <Text style={styles.actionButtonText}>View on Map</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible.open}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  summaryContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 10,
    color: '#333'
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18
  },
  formContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  inputLabel: {
    marginBottom: 5,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333'
  },
  mapButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#e9e9e9',
  },
  createButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  locationFormContainer: {
    padding: 16,
    flex: 1,
  },
  locationSuggestion: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  locationText: {
    fontWeight: '600',
    color: '#333'
  },
  locationSubtext: {
    color: '#666',
    fontSize: 12
  },
  filterContent: {
    padding: 16,
    paddingBottom: 20,
  },
  filterLabel: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#555'
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dateRangeSeparator: {
    marginHorizontal: 8,
    color: '#666'
  },
  filterButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 12,
    backgroundColor: '#fff',
  },
  filterButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  resetButton: {
    backgroundColor: '#e9e9e9'
  },
  resetButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#007bff'
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007bff',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  // Details Modal Styles
  detailsContainer: {
    padding: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFA500',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
  },
  cancelledBadge: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailsSection: {
    marginBottom: 20,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  customerPhone: {
    color: '#666',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    marginLeft: 10,
    color: '#333',
    flex: 1,
  },
  fieldImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  fieldDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  fieldDetailItem: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  fieldDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  fieldDetailValue: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  notesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  notesText: {
    color: '#333',
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '48%',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  secondaryButton: {
    backgroundColor: '#607D8B',
    width: '100%',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RequestScreen;