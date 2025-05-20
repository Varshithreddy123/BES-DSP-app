import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Modal,
  Pressable
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define TypeScript interfaces
interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  date: string;
  time: string;
  bankName: string;
  transactionId: string;
}

interface WalletData {
  balance: number;
  currency: string;
  lastPaidAmount: number;
  transactions: Transaction[];
}

const MyWalletScreen: React.FC = () => {
  const router = useRouter();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  
  // Date states
  const [fromDate, setFromDate] = useState<Date>(new Date('2023-03-12'));
  const [toDate, setToDate] = useState<Date>(new Date('2023-03-30'));
  const [showFromDatePicker, setShowFromDatePicker] = useState<boolean>(false);
  const [showToDatePicker, setShowToDatePicker] = useState<boolean>(false);
  
  const [filteredData, setFilteredData] = useState<Transaction[] | null>(null);

  // Format date for display
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Mock database fetch function
  const fetchWalletData = async (): Promise<WalletData> => {
    // In a real app, this would be an API call to your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          balance: 0.04,
          currency: '₹',
          lastPaidAmount: 110.78,
          transactions: [
            {
              id: '1',
              type: 'sent',
              amount: 96.77,
              date: '04/03/2023',
              time: '05:16 pm',
              bankName: 'HDFC',
              transactionId: 'HDFC1234567'
            },
            {
              id: '2',
              type: 'sent',
              amount: 96.77,
              date: '04/03/2023',
              time: '05:16 pm',
              bankName: 'HDFC',
              transactionId: 'HDFC1234568'
            },
            {
              id: '3',
              type: 'sent',
              amount: 96.77,
              date: '04/03/2023',
              time: '05:16 pm',
              bankName: 'HDFC',
              transactionId: 'HDFC1234569'
            },
            {
              id: '4',
              type: 'sent',
              amount: 96.77,
              date: '04/03/2023',
              time: '05:16 pm',
              bankName: 'HDFC',
              transactionId: 'HDFC1234570'
            },
            {
              id: '5',
              type: 'sent',
              amount: 96.77,
              date: '04/03/2023',
              time: '05:16 pm',
              bankName: 'HDFC',
              transactionId: 'HDFC1234571'
            },
            {
              id: '6',
              type: 'sent',
              amount: 96.77,
              date: '04/03/2023',
              time: '05:16 pm',
              bankName: 'HDFC',
              transactionId: 'HDFC1234572'
            },
            {
              id: '7',
              type: 'sent',
              amount: 96.77,
              date: '04/03/2023',
              time: '05:16 pm',
              bankName: 'HDFC',
              transactionId: 'HDFC1234573'
            },
            {
              id: '8',
              type: 'sent',
              amount: 96.77,
              date: '04/03/2023',
              time: '05:16 pm',
              bankName: 'HDFC',
              transactionId: 'HDFC1234574'
            }
          ]
        });
      }, 1000); // Simulate network delay
    });
  };

  // Handle date changes
  const onChangeFromDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || fromDate;
    setShowFromDatePicker(Platform.OS === 'ios');
    setFromDate(currentDate);
  };

  const onChangeToDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || toDate;
    setShowToDatePicker(Platform.OS === 'ios');
    setToDate(currentDate);
  };

  // Load data on component mount
  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const data = await fetchWalletData();
      setWalletData(data);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  const toggleFilter = () => {
    setFilterModalVisible(true);
  };

  const applyFilter = () => {
    // In a real app, this would filter the transactions based on date range
    // For demo purposes, just using the existing data but we could implement actual filtering
    // by converting date strings to Date objects and comparing with fromDate and toDate
    if (walletData?.transactions) {
      // This is where you would implement the actual filtering logic
      // For now, just showing all transactions as filtered
      setFilteredData(walletData.transactions);
    }
    setFilterModalVisible(false);
    setFilterVisible(true);
  };

  const clearFilter = () => {
    setFilteredData(null);
    setFilterVisible(false);
    setFromDate(new Date('2023-03-12'));
    setToDate(new Date('2023-03-30'));
    setFilterModalVisible(false);
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>
          Sent to bank. Transaction id: {item.bankName}
        </Text>
        <Text style={styles.transactionDate}>
          {item.date} | {item.time}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, item.type === 'received' ? styles.amountReceived : styles.amountSent]}>
        {item.type === 'received' ? '+ ' : '+ '}{walletData?.currency}{item.amount.toFixed(2)}
      </Text>
    </View>
  );

  if (loading && !walletData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3949AB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Wallet',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons name="chevron-back" size={24} color="#000000" />
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
          headerShadowVisible: false,
        }}
      />

      <View style={styles.contentContainer}>
        {/* Company Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Details</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCardContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceTitle}>Total Balance</Text>
              <Text style={styles.balanceAmount}>{walletData?.currency}{walletData?.balance.toFixed(2)}</Text>
            </View>
            <View style={styles.walletIconContainer}>
              <MaterialCommunityIcons name="wallet-outline" size={28} color="#fff" />
            </View>
          </View>
          <TouchableOpacity style={styles.lastPaidContainer}>
            <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.arrowIcon} />
            <Text style={styles.lastPaidText}>Last paid amount</Text>
            <Text style={styles.lastPaidAmount}>{walletData?.currency} {walletData?.lastPaidAmount}</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History Section */}
        <View style={styles.transactionSection}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionTitle}>Transaction History</Text>
            <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
              <Feather name="filter" size={16} color="#333" />
              <Text style={styles.filterText}>Filter{filterVisible ? "ed" : ""}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredData || walletData?.transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransactionItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.transactionList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#3949AB']}
                tintColor="#3949AB"
              />
            }
          />
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Pressable onPress={() => {}} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter</Text>
                <TouchableOpacity onPress={clearFilter}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.dateFilterContainer}>
                <Text style={styles.dateFilterLabel}>From</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowFromDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
                  <MaterialCommunityIcons name="calendar" size={18} color="#333" />
                </TouchableOpacity>
                {showFromDatePicker && (
                  <DateTimePicker
                    value={fromDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeFromDate}
                    maximumDate={toDate}
                  />
                )}
              </View>
              
              <View style={styles.dateFilterContainer}>
                <Text style={styles.dateFilterLabel}>To</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowToDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(toDate)}</Text>
                  <MaterialCommunityIcons name="calendar" size={18} color="#333" />
                </TouchableOpacity>
                {showToDatePicker && (
                  <DateTimePicker
                    value={toDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeToDate}
                    minimumDate={fromDate}
                  />
                )}
              </View>
              
              <View style={styles.filterButtonsContainer}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={applyFilter}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  balanceCardContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  balanceCard: {
    backgroundColor: '#3949AB', // Deep indigo/blue color from the image
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  walletIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastPaidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#5C6BC0', // Lighter shade of the card color
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  arrowIcon: {
    marginRight: 8,
  },
  lastPaidText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
  lastPaidAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transactionSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
  },
  transactionList: {
    paddingHorizontal: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#777777',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  amountSent: {
    color: '#4CAF50', // Green for positive values as shown in the image
  },
  amountReceived: {
    color: '#4CAF50',
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  clearAllText: {
    fontSize: 14,
    color: '#3949AB',
  },
  dateFilterContainer: {
    marginBottom: 16,
  },
  dateFilterLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#333333',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#0D47A1',
    borderRadius: 6,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default MyWalletScreen;