import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, MaterialIcons, Ionicons, Feather, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { PieChart } from 'react-native-svg-charts';

interface Request {
  status: 'completed' | 'accepted' | 'out_of_service' | string;
  payment_status: 'paid' | 'unpaid' | string;
}

interface Stats {
  pilots: number;
  customers: number;
  locations: number;
  drones: number;
  services: number;
  team: number;
  totalRequests: number;
  completedPercentage: number;
  acceptedPercentage: number;
  outOfServicePercentage: number;
  paidPercentage: number;
}

const Homepage = () => {
  const [stats, setStats] = useState<Stats>({
    pilots: 0,
    customers: 0,
    locations: 7,
    drones: 0,
    services: 0,
    team: 0,
    totalRequests: 0,
    completedPercentage: 0,
    acceptedPercentage: 0,
    outOfServicePercentage: 0,
    paidPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      setLoading(true);
      setError(null);
      const [
        customersData,
        requestsData,
        dronesData,
        servicesData,
        teamData,
        pilotsData,
      ] = await Promise.all([
        AsyncStorage.getItem('customers'),
        AsyncStorage.getItem('requests'),
        AsyncStorage.getItem('drones'),
        AsyncStorage.getItem('services'),
        AsyncStorage.getItem('teamMembers'),
        AsyncStorage.getItem('pilots'),
      ]);

      const customers = customersData ? JSON.parse(customersData) : [];
      const requests: Request[] = requestsData ? JSON.parse(requestsData) : [];
      const drones = dronesData ? JSON.parse(dronesData) : [];
      const services = servicesData ? JSON.parse(servicesData) : [];
      const teamMembers = teamData ? JSON.parse(teamData) : [];
      const pilots = pilotsData ? JSON.parse(pilotsData) : [];

      const completedRequests = requests.filter(req => req.status === 'completed').length;
      const acceptedRequests = requests.filter(req => req.status === 'accepted').length;
      const outOfServiceRequests = requests.filter(req => req.status === 'out_of_service').length;
      const paidRequests = requests.filter(req => req.payment_status === 'paid').length;

      setStats({
        pilots: pilots.length,
        customers: customers.length,
        locations: 7,
        drones: drones.length,
        services: services.length,
        team: teamMembers.length,
        totalRequests: requests.length,
        completedPercentage: requests.length > 0 ? (completedRequests / requests.length) * 100 : 0,
        acceptedPercentage: requests.length > 0 ? (acceptedRequests / requests.length) * 100 : 0,
        outOfServicePercentage: requests.length > 0 ? (outOfServiceRequests / requests.length) * 100 : 0,
        paidPercentage: requests.length > 0 ? (paidRequests / requests.length) * 100 : 0,
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3f51b5" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pieChartData = [
    { key: 'completed', value: stats.completedPercentage, color: '#00BCD4', label: 'Completed' },
    { key: 'accepted', value: stats.acceptedPercentage, color: '#4CAF50', label: 'Accepted' },
    { key: 'outOfService', value: stats.outOfServicePercentage, color: '#9C27B0', label: 'Out of Service' },
    { key: 'paid', value: stats.paidPercentage, color: '#F44336', label: 'Paid' },
  ];

  return (
    <View style={styles.fullContainer}>
      {/* Blue background header section */}   
        <View style={styles.blueHeader}>
          <View style={styles.headerRow}>
            <View style={styles.headerContent}>
              <Text style={styles.shopName}>Namaste, varshith !</Text>
              <Text style={styles.roleName}>Admin</Text>
            </View>
    <TouchableOpacity 
      onPress={() => router.push('/settings')}
      style={styles.settingsButton}
    >
      <Ionicons name="settings-outline" size={24} color="white" />
    </TouchableOpacity>
  </View>
  <Text style={styles.dashboardTitle}>Dashboard</Text>
</View>
      
      {/* Main content with ScrollView */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} colors={['#3f51b5']} />
        }
      >
        <Stack.Screen 
          options={{
            title: 'Home',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Entypo
                  name="chevron-left"
                  size={28}
                  color="black"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
            headerTitleStyle: {
              color: 'black',
              fontWeight: '600',
            },
          }}
        />

        {/* Dashboard Grid */}
        <View style={styles.grid}>
          <Link href="/Screens/pilots" asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Pilots</Text>
              <Text style={styles.cardValue}>{stats.pilots}</Text>
              <MaterialIcons name="sports-esports" size={24} color="black" style={styles.cardIcon} />
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/customers" asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Customers</Text>
              <Text style={styles.cardValue}>{stats.customers}</Text>
              <MaterialIcons name="people" size={24} color="#00897B" style={styles.cardIcon} />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Locations</Text>
            <Text style={styles.cardValue}>{stats.locations}</Text>
            <Ionicons name="location" size={24} color="#F9A825" style={styles.cardIcon} />
          </TouchableOpacity>

          <Link href="/(tabs)/requests" asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Drones</Text>
              <Text style={styles.cardValue}>{stats.drones}</Text>
              <MaterialCommunityIcons name="drone" size={24} color="black" style={styles.cardIcon} />
            </TouchableOpacity>
          </Link>

          <Link href="/Screens/service" asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>Services</Text>
              <Text style={styles.cardValue}>{stats.services}</Text>
              <MaterialIcons name="miscellaneous-services" size={24} color="#E64A19" style={styles.cardIcon} />
            </TouchableOpacity>
          </Link>

          <Link href="/Screens/team" asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>My Team</Text>
              <Text style={styles.cardValue}>{stats.team}</Text>
              <MaterialIcons name="group" size={24} color="#1976D2" style={styles.cardIcon} />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Total Request Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Total Request Status</Text>
          <View style={styles.pieChartContainer}>
            {stats.totalRequests > 0 ? (
              <>
                <PieChart
                  style={{ height: 150, width: 150 }}
                  data={pieChartData.map(item => ({
                    ...item,
                    arc: { outerRadius: '70%', padAngle: 0.02 },
                    label: () => `${item.label}: ${item.value.toFixed(1)}%`,
                  }))}
                />
                <Text style={styles.totalRequestsText}>{stats.totalRequests}{'\n'}Total Requests</Text>
              </>
            ) : (
              <Text>No requests available</Text>
            )}
          </View>
          <View style={styles.legendContainer}>
            {pieChartData.map((item) => (
              item.value > 0 && (
                <View key={item.key} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.label} ({item.value.toFixed(1)}%)</Text>
                </View>
              )
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Link href="/(tabs)/requests" asChild>
              <TouchableOpacity style={styles.actionCard}>
                <Feather name="plus-square" size={24} color="white" style={styles.actionIcon} />
                <Text style={styles.actionText}>New Request</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/customers" asChild>
              <TouchableOpacity style={styles.actionCard}>
                <MaterialIcons name="person-add" size={24} color="white" style={styles.actionIcon} />
                <Text style={styles.actionText}>Add Customer</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/Screens/pilots" asChild>
              <TouchableOpacity style={styles.actionCard}>
                <FontAwesome5 name="user-plus" size={24} color="white" style={styles.actionIcon} />
                <Text style={styles.actionText}>Add Pilot</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  blueHeader: {
    backgroundColor: '#1976D2',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerContent: {
    marginBottom: 20,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  shopName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  roleName: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 4,
  },
  dashboardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 120,
  },
  cardTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  cardIcon: {
    alignSelf: 'flex-end',
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  totalRequestsText: {
    position: 'absolute',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    color: '#555',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionCard: {
    backgroundColor: '#3f51b5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    height: 100,
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  actionIcon: {
    marginBottom: 4,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3f51b5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default Homepage;