import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Shami Kumar',
    phone: '8210368501',
    email: 'Shami@kurma@gmail.com'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({...profile});

  const handleEdit = () => {
    setTempProfile({...profile});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!tempProfile.name.trim() || !tempProfile.email.trim() || !tempProfile.phone.trim()) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempProfile.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }
    
    setProfile({...tempProfile});
    setIsEditing(false);
    
    Alert.alert("Success", "Profile updated successfully!", [{ text: "OK" }]);
  };

  const handleChange = (field: string, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: 'Profile',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={Platform.OS === 'ios' ? '#007AFF' : '#000000'} 
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={isEditing ? handleSave : handleEdit}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          ),
          headerTitleStyle: {
            color: '#000000',
            fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
            fontSize: Platform.OS === 'ios' ? 17 : 18,
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Custom Back Button for Android (optional) */}
        {Platform.OS === 'android' && (
          <TouchableOpacity 
            style={styles.androidBackButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
            <Text style={styles.androidBackText}>Back</Text>
          </TouchableOpacity>
        )}

        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <MaterialIcons name="photo-camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.profileName}>{profile.name}</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={tempProfile.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Enter your name"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.name}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={tempProfile.phone}
                onChangeText={(text) => handleChange('phone', text)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.phone}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={tempProfile.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.email}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => Alert.alert("Logout", "Are you sure you want to logout?")}
        >
          <Text style={styles.logoutButtonText}>Logout My Account</Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  scrollView: {
    flex: 1,
  },
  // Back button styles
  backButton: {
    marginLeft: Platform.OS === 'ios' ? -8 : 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  androidBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  androidBackText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000000',
  },
  // Profile header styles
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginTop: Platform.OS === 'android' ? -16 : 0,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  cameraButton: {
    position: 'absolute',
    right: '40%',
    top: 80,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
  },
  // Form styles
  formSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  formGroup: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  fieldLabel: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  textInput: {
    fontSize: 16,
    color: '#333333',
    padding: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  // Button styles
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: Platform.OS === 'ios' ? 8 : 16,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;