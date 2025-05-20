import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface Invoice {
  id: number;
  date: string;
  amount: number;
}

// Optional: Define root stack type if available
type RootStackParamList = {
  Invoice: undefined;
  // Add other screens if needed
};

const InvoiceScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // Replace with actual API endpoint
      const response = await fetch('https://your-api-url.com/invoices');
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const renderInvoice = ({ item }: { item: Invoice }) => (
    <View style={styles.invoiceItem}>
      <Text style={styles.invoiceTitle}>Invoice #{item.id}</Text>
      <Text>Date: {formatDate(item.date)}</Text>
      <Text>Amount: ₹{item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Invoices</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : invoices.length === 0 ? (
        <View style={styles.noInvoiceContainer}>
          <Image
            source={require('../../assets/images/bill.png')}
            style={styles.billImage}
            resizeMode="contain"
          />
          <Text style={styles.noInvoiceText}>No Invoices right now!</Text>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInvoice}
          contentContainerStyle={styles.invoiceList}
        />
      )}
    </View>
  );
};

export default InvoiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Fix Android status bar overlap
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noInvoiceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billImage: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  noInvoiceText: {
    fontSize: 16,
    color: '#555',
  },
  invoiceList: {
    padding: 16,
  },
  invoiceItem: {
    backgroundColor: '#f3f3f3',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  invoiceTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
