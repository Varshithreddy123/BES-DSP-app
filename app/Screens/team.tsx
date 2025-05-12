import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  SafeAreaView, 
  ScrollView,
  Switch,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  BackHandler,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

// Define a more comprehensive Member type
interface Member {
  id: number;
  name: string;
  mobileNumber: string;
  email: string;
  address: string;
  locations: string;
  isActive: boolean;
  role: 'Location Manager' | 'Admin';
}

export default function MyTeamScreen({ navigation = null }) {
  const router = useRouter();
  // Initial state with empty members array
  const [members, setMembers] = useState<Member[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  // New state for comprehensive member details
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [locations, setLocations] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [role, setRole] = useState<'Location Manager' | 'Admin'>('Location Manager');
  
  // Load members from AsyncStorage on component mount
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const savedMembers = await AsyncStorage.getItem('members');
        if (savedMembers !== null) {
          setMembers(JSON.parse(savedMembers));
        } else {
          // For demo purposes, set a default member if none exist
          setMembers([{
            id: 1,
            name: "John Doe",
            mobileNumber: "1234567890",
            email: "john@example.com",
            address: "123 Main St",
            locations: "Location 1",
            isActive: true,
            role: "Location Manager"
          }]);
        }
      } catch (error) {
        console.error('Failed to load members:', error);
        // Set default member if load fails
        setMembers([{
          id: 1,
          name: "John Doe",
          mobileNumber: "1234567890",
          email: "john@example.com",
          address: "123 Main St",
          locations: "Location 1",
          isActive: true,
          role: "Location Manager"
        }]);
      }
    };
    
    loadMembers();
  }, []);
  
  // Save members to AsyncStorage whenever they change
  useEffect(() => {
    const saveMembers = async () => {
      try {
        await AsyncStorage.setItem('members', JSON.stringify(members));
        console.log('Members saved:', members);
      } catch (error) {
        console.error('Failed to save members:', error);
      }
    };
    
    if (members.length > 0) {
      saveMembers();
    }
  }, [members]);

  const handleAddMember = () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Missing Information', 'Please enter an email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    const newMember: Member = {
      id: Date.now(), // use timestamp as unique id
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      address: address.trim(),
      locations: locations.trim(),
      isActive,
      role
    };

    // Add new member to the list
    setMembers([...members, newMember]);

    // Reset form fields
    resetForm();
    
    // Show confirmation
    Alert.alert('Success', `${name} has been added to the team`);
  };

  const handleRemoveMember = (id: number) => {
    Alert.alert(
      'Remove Team Member',
      'Are you sure you want to remove this team member?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            const updatedMembers = members.filter(member => member.id !== id);
            setMembers(updatedMembers);
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setName('');
    setMobileNumber('');
    setEmail('');
    setAddress('');
    setLocations('');
    setIsActive(false);
    setRole('Location Manager');
    setIsAddingMember(false);
  };

  const handleSelectLocations = () => {
    // Placeholder for location selection functionality
    // This would typically open another modal or navigate to a location selection screen
    Alert.alert(
      'Select Locations',
      'This feature would allow users to select from available locations.',
      [{ text: 'OK' }]
    );
  };

  // Add effect for hardware back button handling on Android
  useEffect(() => {
    const backAction = () => {
      if (isAddingMember) {
        setIsAddingMember(false);
        return true; // Prevent default behavior
      }
      return false; // Let default behavior happen
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Clean up on unmount
  }, [isAddingMember]);

  // Handle back navigation
  const handleGoBack = () => {
    // Check if navigation exists and has goBack function
    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    } else if (router && typeof router.back === 'function') {
      router.back();
    } else {
      // Fallback for when navigation is not available
      console.log("Navigation back requested, but navigation is not available");
      // If modal is open, close it
      if (isAddingMember) {
        setIsAddingMember(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: 'white',
      marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 16 
      }}>
        <TouchableOpacity 
          onPress={handleGoBack} 
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          accessibilityLabel="Go back"
          testID="backButton"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center'
        }}>
          My Team
        </Text>
        <TouchableOpacity 
          onPress={() => setIsAddingMember(true)}
          style={{ 
            padding: 8, 
            borderRadius: 30, 
            backgroundColor: 'rgba(0,122,255,0.1)' 
          }}
          accessibilityLabel="Add team member"
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Add Member Modal */}
      <Modal
        visible={isAddingMember}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddingMember(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(0,0,0,0.5)' 
          }}>
            <View
              style={{ 
                width: '90%', 
                maxHeight: Dimensions.get('window').height * 0.9,
                backgroundColor: 'white', 
                borderRadius: 20,
                overflow: 'hidden'
              }}
            >
              <ScrollView 
                contentContainerStyle={{ 
                  padding: 20,
                  paddingBottom: 100 // Add padding to ensure space for buttons
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
              >
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 15,
                paddingHorizontal: 8
              }}>
                <TouchableOpacity 
                  onPress={() => {
                    Alert.alert(
                      'Discard Changes',
                      'Are you sure you want to discard your changes?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Discard', style: 'destructive', onPress: resetForm }
                      ]
                    );
                  }}
                  accessibilityLabel="Close"
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600',
                  flex: 1,
                  textAlign: 'center'
                }}>
                  Add Team Member
                </Text>
                <View style={{width: 24}} />
              </View>

              {/* Name Input */}
              <Text style={styles.label}>Name<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput 
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                style={styles.input}
                returnKeyType="next"
                autoCapitalize="words"
              />

              {/* Mobile Number Input */}
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput 
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                style={styles.input}
                returnKeyType="next"
              />

              {/* Email Input */}
              <Text style={styles.label}>E-mail<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput 
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                returnKeyType="next"
              />

              {/* Address Input */}
              <Text style={styles.label}>Address</Text>
              <TextInput 
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
                multiline
                style={[styles.input, { minHeight: 80 }]}
                returnKeyType="done"
              />

              {/* Locations Dropdown */}
              <Text style={styles.label}>Locations</Text>
              <TouchableOpacity 
                style={[styles.input, { 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }]}
                onPress={handleSelectLocations}
              >
                <Text style={{ color: locations ? 'black' : '#C7C7CC' }}>
                  {locations || 'Select Locations'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#C7C7CC" />
              </TouchableOpacity>

              {/* Status Toggle */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginVertical: 16 
              }}>
                <Text style={styles.label}>Status</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ marginRight: 10, color: isActive ? '#007AFF' : 'gray' }}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#007AFF" }}
                    thumbColor={isActive ? "#ffffff" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={setIsActive}
                    value={isActive}
                  />
                </View>
              </View>

              {/* Role Selection */}
              <Text style={styles.label}>Role</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity 
                  style={[
                    styles.roleButton, 
                    role === 'Location Manager' && styles.selectedRoleButton
                  ]}
                  onPress={() => setRole('Location Manager')}
                >
                  <Text style={[
                    styles.roleButtonText, 
                    role === 'Location Manager' && styles.selectedRoleButtonText
                  ]}>
                    Location Manager
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.roleButton, 
                    role === 'Admin' && styles.selectedRoleButton
                  ]}
                  onPress={() => setRole('Admin')}
                >
                  <Text style={[
                    styles.roleButtonText, 
                    role === 'Admin' && styles.selectedRoleButtonText
                  ]}>
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>

              </ScrollView>
              
              {/* Add fixed buttons at the bottom */}
              <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 16,
                backgroundColor: 'white',
                borderTopWidth: 1,
                borderTopColor: '#E0E0E0',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <TouchableOpacity 
                  style={[styles.cancelButton, { flex: 1, marginRight: 8 }]}
                  onPress={() => setIsAddingMember(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.addMemberButton, { flex: 1, marginLeft: 8 }]}
                  onPress={handleAddMember}
                >
                  <Text style={styles.addMemberButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Team Members List or Empty State */}
      {members.length === 0 ? (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <View style={{ 
            width: 160, 
            height: 160, 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 15 
          }}>
            <View style={{ 
              width: 120, 
              height: 120, 
              borderRadius: 60, 
              borderWidth: 4, 
              borderColor: '#007AFF',
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <View style={{ 
                width: 10, 
                height: 10, 
                borderRadius: 5, 
                backgroundColor: '#007AFF' 
              }} />
              {[0, 60, 120, 180, 240, 300].map((angle, index) => {
                const radius = 40;
                return (
                  <View 
                    key={index}
                    style={{ 
                      position: 'absolute',
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#007AFF',
                      top: 60 + radius * Math.sin(angle * Math.PI / 180) - 5,
                      left: 60 + radius * Math.cos(angle * Math.PI / 180) - 5
                    }} 
                  />
                );
              })}
            </View>
          </View>
          <Text style={{ color: '#8E8E93' }}>No team members yet</Text>
          <TouchableOpacity 
            style={[styles.addMemberButton, { marginTop: 16, paddingHorizontal: 20 }]}
            onPress={() => setIsAddingMember(true)}
          >
            <Text style={styles.addMemberButtonText}>Add Team Member</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          {members.map((member) => (
            <View 
              key={member.id} 
              style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                backgroundColor: '#F2F2F7', 
                padding: 15, 
                marginHorizontal: 16, 
                marginVertical: 8, 
                borderRadius: 10 
              }}
            >
              <View>
                <Text style={{ fontWeight: 'bold' }}>{member.name}</Text>
                <Text style={{ color: 'gray' }}>{member.email}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <View style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: 4, 
                    backgroundColor: member.isActive ? 'green' : 'red',
                    marginRight: 4
                  }} />
                  <Text style={{ 
                    color: member.isActive ? 'green' : 'red',
                    fontSize: 12 
                  }}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, marginTop: 2 }}>{member.role}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity 
                  onPress={() => {
                    // Edit functionality would go here
                    Alert.alert('Edit Member', 'Edit functionality not implemented yet');
                  }}
                  style={{ 
                    padding: 5, 
                    borderRadius: 5,
                    marginRight: 10
                  }}
                >
                  <Ionicons name="pencil" size={18} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleRemoveMember(member.id)}
                  style={{ 
                    padding: 5, 
                    borderRadius: 5 
                  }}
                >
                  <Ionicons name="trash" size={18} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Styles extracted to make the code more readable
const styles = {
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center'
  },
  selectedRoleButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF'
  },
  roleButtonText: {
    color: '#000',
    fontWeight: '500'
  },
  selectedRoleButtonText: {
    color: 'white'
  },
  addMemberButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 0
  },
  addMemberButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 0
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600'
  }
};