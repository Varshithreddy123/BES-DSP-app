import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  Modal,
  BackHandler,
  StatusBar
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CreateCouponPage: React.FC = () => {
  const navigation = useNavigation();
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<'percentage' | 'rupees'>('percentage');
  const [locationSpecific, setLocationSpecific] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Handle hardware back button (Android)
  useEffect(() => {
    const backAction = () => {
      handleGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleGoBack = () => {
    // Ensure the navigation action is properly handled
    try {
      navigation.goBack();
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback if navigation.goBack() fails
      navigation.navigate('Home' as never); // Ensure 'Home' is a valid route in your navigation configuration
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          testID="back-button"
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Coupon</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Coupon Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Coupon Code</Text>
          <TextInput placeholder="Enter Coupon Code" style={styles.input} />
        </View>

        {/* Message */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message to be Displayed on Coupon</Text>
          <TextInput
            placeholder="Enter Message..."
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>

        {/* Validity Date Range */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Validity</Text>
          <View style={styles.dateRangeContainer}>
            <View style={styles.datePickerWrapper}>
              <Text style={styles.dateLabel}>From</Text>
              <TouchableOpacity style={styles.datePicker} onPress={() => setShowFromPicker(true)}>
                <Text>{formatDate(fromDate)}</Text>
                <Icon name="calendar-outline" size={18} />
              </TouchableOpacity>
            </View>
            <Text style={styles.toText}>To</Text>
            <View style={styles.datePickerWrapper}>
              <Text style={[styles.dateLabel, styles.invisible]}>To</Text>
              <TouchableOpacity style={styles.datePicker} onPress={() => setShowToPicker(true)}>
                <Text>{formatDate(toDate)}</Text>
                <Icon name="calendar-outline" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* From Date Picker */}
        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowFromPicker(Platform.OS === 'ios');
              if (selectedDate) setFromDate(selectedDate);
            }}
          />
        )}

        {/* To Date Picker */}
        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowToPicker(Platform.OS === 'ios');
              if (selectedDate) setToDate(selectedDate);
            }}
          />
        )}

        {/* Visibility */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Visibility</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity style={styles.radioOption} onPress={() => setIsPublic(true)}>
              <View style={[styles.radioButton, isPublic && styles.radioButtonSelected]}>
                {isPublic && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioOption} onPress={() => setIsPublic(false)}>
              <View style={[styles.radioButton, !isPublic && styles.radioButtonSelected]}>
                {!isPublic && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>Private</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Discount Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, selectedTab === 'percentage' && styles.toggleButtonActive]}
            onPress={() => setSelectedTab('percentage')}
          >
            <Text
              style={[styles.toggleButtonText, selectedTab === 'percentage' && styles.toggleButtonTextActive]}
            >
              Percentage
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, selectedTab === 'rupees' && styles.toggleButtonActive]}
            onPress={() => setSelectedTab('rupees')}
          >
            <Text
              style={[styles.toggleButtonText, selectedTab === 'rupees' && styles.toggleButtonTextActive]}
            >
              Rupees
            </Text>
          </TouchableOpacity>
        </View>

        {/* Numeric Inputs */}
        {[
          'Maximum Redemption Count',
          'Maximum Discount Percentage Per Coupon',
          'Maximum Discount Amount Per Coupon',
          'Minimum Order Value',
          'Maximum Usage Per User',
        ].map((label, index) => (
          <View style={styles.inputGroup} key={index}>
            <Text style={styles.label}>{label}</Text>
            <TextInput placeholder="0" keyboardType="numeric" style={styles.input} />
          </View>
        ))}

        {/* Location Specific Toggle */}
        <View style={styles.switchRow}>
          <Text style={styles.label}>Location Specific</Text>
          <Switch
            value={locationSpecific}
            onValueChange={setLocationSpecific}
            trackColor={{ false: '#d1d5db', true: '#2563eb' }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Create Coupon</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    marginRight: 16,
    padding: 8, // Increased touch target
  },
  backButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  formContainer: {
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 8,
    height: 100,
    textAlignVertical: 'top',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePickerWrapper: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
  },
  invisible: {
    opacity: 0,
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 8,
  },
  calendarIcon: {
    fontSize: 16,
  },
  toText: {
    fontSize: 14,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2563eb',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  radioLabel: {
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#2563eb',
  },
  toggleButtonText: {
    fontSize: 14,
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default CreateCouponPage;