import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Pilot = {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  leadPilot: boolean;
  phone: string;
  licenseId: string;
  active: boolean;
  completedFlights: number;
  location?: string;
  aadharNo?: string;
  panNo?: string;
};

type FormStep = 'personal' | 'contact' | 'location';

export default function AgriDronePilotPage() {
  const navigation = useNavigation();
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  
  const [pilots, setPilots] = useState<Pilot[]>([
    {
      id: '1',
      firstName: "Shama",
      lastName: "Kumar",
      initials: "SK",
      leadPilot: true,
      phone: "9210359501",
      licenseId: "32789126043",
      active: true,
      completedFlights: 50,
      location: "Lasalgaon",
      aadharNo: "8210369501",
      panNo: "ABCDE1234F"
    }
  ]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    aadharNo: '',
    panNo: '',
    licenseId: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    pinCode: '',
    state: '',
    district: '',
    city: '',
    assignedLocation: '',
    droneUIN: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 'personal') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.aadharNo.trim()) newErrors.aadharNo = 'Aadhar number is required';
      if (!formData.panNo.trim()) newErrors.panNo = 'PAN number is required';
      if (!formData.licenseId.trim()) newErrors.licenseId = 'License ID is required';
    }
    
    if (step === 'contact') {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
      
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email';
      
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
      if (!formData.pinCode.trim()) newErrors.pinCode = 'PIN code is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.district.trim()) newErrors.district = 'District is required';
    }
    
    if (step === 'location') {
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.assignedLocation.trim()) newErrors.assignedLocation = 'Location is required';
      if (!formData.droneUIN.trim()) newErrors.droneUIN = 'Drone UIN is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    
    if (currentStep === 'personal') setCurrentStep('contact');
    else if (currentStep === 'contact') setCurrentStep('location');
    else submitForm();
  };

  const submitForm = () => {
    const newPilot: Pilot = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      initials: `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`,
      leadPilot: false,
      phone: formData.phone,
      licenseId: formData.licenseId,
      active: true,
      completedFlights: 0,
      location: formData.assignedLocation,
      aadharNo: formData.aadharNo,
      panNo: formData.panNo
    };
    
    setPilots([...pilots, newPilot]);
    resetForm();
    setCurrentView('list');
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      aadharNo: '',
      panNo: '',
      licenseId: '',
      phone: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      pinCode: '',
      state: '',
      district: '',
      city: '',
      assignedLocation: '',
      droneUIN: ''
    });
    setErrors({});
    setCurrentStep('personal');
  };

  const togglePilotStatus = (id: string) => {
    setPilots(pilots.map(pilot => 
      pilot.id === id ? { ...pilot, active: !pilot.active } : pilot
    ));
  };

  const renderBackButton = () => (
    <TouchableOpacity 
      onPress={() => currentView === 'form' ? setCurrentView('list') : navigation.goBack()}
      style={styles.backButton}
    >
      <Text style={styles.backButtonText}>x</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {renderBackButton()}
      <Text style={styles.headerTitle}>
        {currentView === 'list' ? 'Pilots' : 'Add Pilot'}
      </Text>
      {currentView === 'list' && (
        <TouchableOpacity 
          onPress={() => setCurrentView('form')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add Pilot</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPilotItem = (pilot: Pilot) => (
    <View key={pilot.id} style={styles.pilotItem}>
      <View style={styles.initialsCircle}>
        <Text style={styles.initialsText}>{pilot.initials}</Text>
      </View>
      
      <View style={styles.pilotInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.pilotName}>
            {pilot.firstName} {pilot.lastName}
          </Text>
          {pilot.leadPilot && (
            <Text style={styles.leadPilotBadge}>• Lead Pilot</Text>
          )}
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>● {pilot.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>● {pilot.phone}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>● {pilot.aadharNo}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>
            ● {pilot.completedFlights} (Online comparison)
          </Text>
        </View>
        
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>▼ Add Pilot</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>▼ View Pilot On Map</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Switch
        value={pilot.active}
        onValueChange={() => togglePilotStatus(pilot.id)}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={pilot.active ? '#2563eb' : '#f4f3f4'}
      />
    </View>
  );

  const renderList = () => (
    <View style={styles.container}>
      {renderHeader()}
      
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          Total pilots ({pilots.length})
        </Text>
        <TouchableOpacity>
          <Text style={styles.mapLinkText}>View Pilot On Map</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.listContainer}>
        {pilots.map(renderPilotItem)}
      </ScrollView>
    </View>
  );

  const renderFormInput = (
    label: string,
    field: string,
    placeholder: string,
    optional = false,
    keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {optional && <Text style={styles.optionalText}>(optional)</Text>}
      </Text>
      <TextInput
        style={[styles.input, errors[field] ? styles.inputError : null]}
        placeholder={placeholder}
        value={formData[field as keyof typeof formData]}
        onChangeText={(text) => handleInputChange(field, text)}
        keyboardType={keyboardType}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderSelectInput = (
    label: string,
    field: string,
    placeholder: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity 
        style={[styles.selectInput, errors[field] ? styles.inputError : null]}
        onPress={() => console.log(`Open ${field} picker`)}
      >
        <Text style={formData[field as keyof typeof formData] ? styles.selectText : styles.placeholderText}>
          {formData[field as keyof typeof formData] || placeholder}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderPersonalDetails = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Personal Details</Text>
      
      {renderFormInput('First Name', 'firstName', 'Enter first name')}
      {renderFormInput('Middle Name', 'middleName', 'Enter middle name', true)}
      {renderFormInput('Last Name', 'lastName', 'Enter last name')}
      
      <Text style={styles.sectionTitle}>KYC Details</Text>
      
      {renderFormInput('Aadhar No.', 'aadharNo', 'Enter aadhar number', false, 'numeric')}
      {renderFormInput('PAN', 'panNo', 'Enter PAN number')}
      {renderFormInput('License ID', 'licenseId', 'Enter license id')}
    </ScrollView>
  );

  const renderContactDetails = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Contact Details</Text>
      
      {renderFormInput('Phone Number', 'phone', 'Enter mobile number', false, 'phone-pad')}
      {renderFormInput('Email Id', 'email', 'Enter email id', false, 'email-address')}
      {renderFormInput('First Line Address', 'addressLine1', 'Enter first line address')}
      {renderFormInput('Second Line Address', 'addressLine2', 'Enter second line address', true)}
      {renderFormInput('Pin Code', 'pinCode', 'Enter pin code', false, 'numeric')}
      
      {renderSelectInput('State', 'state', 'Select state')}
      {renderSelectInput('District', 'district', 'Select district')}
    </ScrollView>
  );

  const renderLocationDetails = () => (
    <ScrollView style={styles.formContainer}>
      {renderSelectInput('City', 'city', 'Select City')}
      {renderSelectInput('Assigned Location', 'assignedLocation', 'Select Location')}
      {renderSelectInput('Drone UIN', 'droneUIN', 'Select Drone UIN')}
    </ScrollView>
  );

  const renderForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {renderHeader()}
      
      <ScrollView style={styles.formScrollContainer}>
        {currentStep === 'personal' && renderPersonalDetails()}
        {currentStep === 'contact' && renderContactDetails()}
        {currentStep === 'location' && renderLocationDetails()}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={handleNextStep}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {currentStep === 'location' ? 'Add' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={styles.screenContainer}>
      {currentView === 'list' ? renderList() : renderForm()}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2563eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
  },
  addButton: {
    padding: 8,
  },
  addButtonText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryText: {
    color: '#4b5563',
  },
  mapLinkText: {
    color: '#2563eb',
  },
  listContainer: {
    flex: 1,
  },
  pilotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  initialsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  initialsText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  pilotInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pilotName: {
    fontWeight: '500',
    fontSize: 16,
  },
  leadPilotBadge: {
    marginLeft: 8,
    color: '#6b7280',
    fontSize: 14,
  },
  detailRow: {
    marginTop: 2,
  },
  detailText: {
    color: '#6b7280',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    marginRight: 16,
  },
  actionButtonText: {
    color: '#2563eb',
    fontSize: 14,
  },
  formScrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    color: '#1f2937',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    color: '#1f2937',
    fontSize: 16,
  },
  optionalText: {
    color: '#6b7280',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  selectInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: Platform.OS === 'ios' ? 12 : 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectText: {
    color: '#1f2937',
    fontSize: 16,
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  chevron: {
    color: '#6b7280',
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});