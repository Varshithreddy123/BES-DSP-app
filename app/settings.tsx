import { View, Text, StyleSheet, Platform, Image, ScrollView, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Entypo, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen() {
  const [balance, setBalance] = useState(425.50);
  const [currency, setCurrency] = useState('USD');
  
  const navigateToProfile = () => {
    router.push('/Screens/Profile');
  };

  const navigateToWallet = () => {
    router.push('/Screens/Mywallet');
  };

  // Enhanced back handler
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback to home if no back history exists
      router.replace('/');
    }
  };

  const addFunds = () => {
    const amount = 50;
    setBalance(prevBalance => prevBalance + amount);
    Alert.alert(
      "Funds Added",
      `$${amount.toFixed(2)} added to your wallet successfully!`,
      [{ text: "OK" }]
    );
  };

  const withdrawFunds = () => {
    if (balance >= 50) {
      setBalance(prevBalance => prevBalance - 50);
      Alert.alert(
        "Withdrawal Successful",
        "$50.00 has been withdrawn from your wallet.",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Insufficient Funds",
        "You don't have enough balance to withdraw $50.00",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons 
                name="arrow-back" 
                size={28} 
                color={Platform.OS === 'ios' ? '#007AFF' : '#000000'} 
              />
              {Platform.OS === 'android' && (
                <Text style={styles.androidBackText}>Back</Text>
              )}
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
      
      {/* Optional in-content back button for Android */}
      {Platform.OS === 'android' && (
        <TouchableOpacity 
          style={styles.inContentBackButton}
          onPress={handleBack}
        >
          <MaterialIcons name="chevron-left" size={32} color="#CCCCCC" />
          <Text style={styles.inContentBackText}>Back</Text>
        </TouchableOpacity>
      )}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {/* Rest of your content remains the same */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.optionContainer} 
            onPress={navigateToProfile}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIconContainer}>
                <MaterialIcons name="person" size={24} color="#007AFF" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Profile</Text>
                <Text style={styles.optionDescription}>Edit your personal information</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
          </TouchableOpacity>
          
          <View style={styles.profilePreview}>
            <Image
              source={{ uri: 'https://via.placeholder.com/60' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          
          <TouchableOpacity 
            style={styles.optionContainer} 
            onPress={navigateToWallet}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIconContainer}>
                <MaterialCommunityIcons name="wallet" size={24} color="#007AFF" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Wallet</Text>
                <Text style={styles.optionDescription}>Manage payment methods and transactions</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={28} color="#CCCCCC" />
          </TouchableOpacity>
          
          <View style={styles.walletPreview}>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>{currency} {balance.toFixed(2)}</Text>
            </View>
            
            <View style={styles.walletActions}>
              <TouchableOpacity 
                style={styles.walletButton} 
                onPress={addFunds}
                activeOpacity={0.7}
              >
                <MaterialIcons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.walletButtonText}>Add Funds</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.walletButton, styles.withdrawButton]} 
                onPress={withdrawFunds}
                activeOpacity={0.7}
              >
                <MaterialIcons name="call-made" size={18} color="#FFFFFF" />
                <Text style={styles.walletButtonText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 8 : 16,
  },
  // Back button styles
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Platform.OS === 'ios' ? -8 : 0,
    paddingLeft: Platform.OS === 'ios' ? 8 : 16,
    paddingRight: Platform.OS === 'android' ? 8 : 0,
  },
  androidBackText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#000000',
  },
  // In-content back button for Android
  inContentBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  inContentBackText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000000',
  },
  // Rest of your existing styles...
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#888888',
  },
  profilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
  },
  walletPreview: {
    paddingVertical: 16,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
  },
  withdrawButton: {
    backgroundColor: '#FF6B6B',
  },
  walletButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});