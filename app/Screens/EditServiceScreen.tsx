import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

interface TankOption {
  value: string;
  selected: boolean;
}

interface AgriChemical {
  id: string;
  name: string;
}

interface EditServiceScreenProps {
  onClose: () => void;
  onUpdate: (serviceData: any) => void;
  initialData?: {
    status: boolean;
    minAcreage: string;
    tankCapacity: string;
    chemicals: AgriChemical[];
  };
}

const EditServiceScreen: React.FC<EditServiceScreenProps> = ({
  onClose,
  onUpdate,
  initialData = {
    status: true,
    minAcreage: '1',
    tankCapacity: '10 ltr',
    chemicals: [],
  },
}) => {
  const [isActive, setIsActive] = useState(initialData.status);
  const [minAcreage, setMinAcreage] = useState(initialData.minAcreage);
  const [chemicals, setChemicals] = useState<AgriChemical[]>(initialData.chemicals);
  
  const [tankOptions, setTankOptions] = useState<TankOption[]>([
    { value: '5 ltr', selected: initialData.tankCapacity === '5 ltr' },
    { value: '6 ltr', selected: initialData.tankCapacity === '6 ltr' },
    { value: '8 ltr', selected: initialData.tankCapacity === '8 ltr' },
    { value: '10 ltr', selected: initialData.tankCapacity === '10 ltr' },
    { value: '16 ltr', selected: initialData.tankCapacity === '16 ltr' },
    { value: '20 ltr', selected: initialData.tankCapacity === '20 ltr' },
  ]);

  const handleTankOptionToggle = (index: number) => {
    const newOptions = tankOptions.map((option, i) => ({
      ...option,
      selected: i === index,
    }));
    setTankOptions(newOptions);
  };

  const handleAddChemical = () => {
    // This would open a modal to add a new chemical
    console.log('Add chemical pressed');
  };

  const handleUpdate = () => {
    const selectedTank = tankOptions.find(option => option.selected)?.value || '';
    
    const updatedData = {
      status: isActive,
      minAcreage,
      tankCapacity: selectedTank,
      chemicals,
    };
    
    onUpdate(updatedData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="chevron-back" size={24} color="#000" />
            <Text style={styles.headerTitle}>Spraying</Text>
          </TouchableOpacity>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Status</Text>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, !isActive && styles.activeStatus]}>Inactive</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: '#ddd', true: '#34C759' }}
                thumbColor="#fff"
                ios_backgroundColor="#ddd"
              />
              <Text style={[styles.statusText, isActive && styles.activeStatus]}>Active</Text>
            </View>
          </View>
        </View>

        {/* Min Request Acreage Section */}
        <View style={styles.sectionWithTitle}>
          <Text style={styles.sectionTitle}>Min Request Acreage</Text>
          <TextInput
            style={styles.textInput}
            value={minAcreage}
            onChangeText={setMinAcreage}
            keyboardType="numeric"
            placeholder="Enter minimum acreage"
          />
        </View>

        {/* Tank Capacity Section */}
        <View style={styles.sectionWithTitle}>
          <Text style={styles.sectionTitle}>Tank Capacity</Text>
          <View style={styles.tankOptionsGrid}>
            {tankOptions.slice(0, 2).map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={styles.tankOption}
                onPress={() => handleTankOptionToggle(index)}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, option.selected && styles.checkedCheckbox]}>
                    {option.selected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.tankOptionText}>{option.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {tankOptions.slice(2, 4).map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={styles.tankOption}
                onPress={() => handleTankOptionToggle(index + 2)}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, option.selected && styles.checkedCheckbox]}>
                    {option.selected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.tankOptionText}>{option.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {tankOptions.slice(4, 6).map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={styles.tankOption}
                onPress={() => handleTankOptionToggle(index + 4)}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, option.selected && styles.checkedCheckbox]}>
                    {option.selected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.tankOptionText}>{option.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Agrochemicals Section */}
        <View style={styles.sectionWithTitle}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Agrochemicals ({chemicals.length})</Text>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={handleAddChemical}
            >
              <Text style={styles.addButtonText}>Add</Text>
              <MaterialIcons name="add-circle-outline" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.chemicalsBox}>
            {chemicals.length === 0 && (
              <Text style={styles.noChemicalsText}></Text>
            )}
            {chemicals.map(chemical => (
              <Text key={chemical.id}>{chemical.name}</Text>
            ))}
          </View>
        </View>

        {/* Manage Location Button */}
        <TouchableOpacity 
          style={styles.manageLocationButton}
          onPress={() => console.log('Manage location')}
        >
          <Text style={styles.manageLocationText}>Manage Location and Crops</Text>
        </TouchableOpacity>

        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 1,
  },
  sectionWithTitle: {
    backgroundColor: 'white',
    padding: 16,
    paddingBottom: 20,
    marginBottom: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#777',
    marginHorizontal: 8,
  },
  activeStatus: {
    color: '#34C759',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 12,
    color: '#000',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  tankOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 6,
    padding: 4,
  },
  tankOption: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tankOptionText: {
    fontSize: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 4,
  },
  chemicalsBox: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 6,
    height: 80,
    padding: 12,
    justifyContent: 'center',
  },
  noChemicalsText: {
    color: '#999',
    textAlign: 'center',
  },
  manageLocationButton: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 1,
  },
  manageLocationText: {
    color: '#007AFF',
    fontWeight: '400',
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: '#005DAA',
    padding: 14,
    margin: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditServiceScreen;