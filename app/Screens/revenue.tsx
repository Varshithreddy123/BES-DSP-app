import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface RevenueData {
  total: number;
  thisMonth: number;
  thisWeek: number;
  monthlyTrend: number[];
}

const RevenueScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [revenueBy, setRevenueBy] = useState<'services' | 'products'>('services');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTrend, setActiveTrend] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  // Simulate fetching real-time data with error handling
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (isMounted) {
          const data = await getRevenueData();
          setRevenueData(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load revenue data. Please try again.');
          console.error('Revenue data fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [revenueBy, selectedService]);

  // Mock function to simulate API call
  const getRevenueData = async (): Promise<RevenueData> => {
    // This would be replaced with actual API call
    const baseValue = 38900;
    const randomFactor = Math.floor(Math.random() * 1000);
    
    return {
      total: baseValue + randomFactor,
      thisMonth: Math.floor(randomFactor * 0.8),
      thisWeek: Math.floor(randomFactor * 0.3),
      monthlyTrend: Array.from({ length: 10 }, (_, i) => 
        Math.floor(Math.random() * 5000) + 30000 + i * 1000)
    };
  };

  if (loading && !revenueData) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: 'Revenue',
            headerTitleStyle: {
              fontWeight: '600',
              color: colors.text,
            },
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color={colors.primary} />
              </TouchableOpacity>
            ),
            headerShown: true,
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading revenue data...
          </Text>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: 'Revenue',
            headerTitleStyle: {
              fontWeight: '600',
              color: colors.text,
            },
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color={colors.primary} />
              </TouchableOpacity>
            ),
            headerShown: true,
          }} 
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              setError(null);
              setLoading(true);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Revenue',
          headerTitleStyle: {
            fontWeight: '600',
            color: colors.text,
          },
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color= "black" />
            </TouchableOpacity>
          ),
          headerShown: true,
        }} 
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Filter Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue by:</Text>
          <View style={[
            styles.pickerContainer, 
            { 
              borderColor: colors.border,
              backgroundColor: Platform.OS === 'android' ? colors.card : 'transparent'
            }
          ]}>
            <Picker
              selectedValue={revenueBy}
              onValueChange={(itemValue) => setRevenueBy(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
              mode={Platform.OS === 'android' ? 'dropdown' : 'dialog'}
            >
              <Picker.Item label="Services" value="services" />
              <Picker.Item label="Products" value="products" />
            </Picker>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Services:</Text>
          <View style={[
            styles.pickerContainer, 
            { 
              borderColor: colors.border,
              backgroundColor: Platform.OS === 'android' ? colors.card : 'transparent'
            }
          ]}>
            <Picker
              selectedValue={selectedService}
              onValueChange={(itemValue) => setSelectedService(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
              mode={Platform.OS === 'android' ? 'dropdown' : 'dialog'}
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Service 1" value="Service 1" />
              <Picker.Item label="Service 2" value="Service 2" />
            </Picker>
          </View>
        </View>

        {/* Stats Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                Rs. {revenueData?.total.toLocaleString() || '0'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text, opacity: 0.7 }]}>
                Total Revenue
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                Rs. {revenueData?.thisMonth.toLocaleString() || '0'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text, opacity: 0.7 }]}>
                This Month
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                Rs. {revenueData?.thisWeek.toLocaleString() || '0'}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text, opacity: 0.7 }]}>
                This Week
              </Text>
            </View>
          </View>
        </View>

        {/* Trend Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trend</Text>
          <View style={styles.trendOptions}>
            {(['monthly', 'weekly', 'daily'] as const).map((trend) => (
              <TouchableOpacity
                key={trend}
                style={[
                  styles.trendOption,
                  activeTrend === trend && styles.trendOptionActive,
                  activeTrend === trend && { backgroundColor: colors.primary }
                ]}
                onPress={() => setActiveTrend(trend)}
              >
                <Text style={[
                  styles.trendOptionText,
                  activeTrend === trend && styles.trendOptionTextActive,
                  activeTrend === trend && { color: '#fff' }
                ]}>
                  {trend.charAt(0).toUpperCase() + trend.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {revenueData && (
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                  data: revenueData.monthlyTrend,
                  color: (opacity = 1) => colors.primary,
                  strokeWidth: 2
                }]
              }}
              width={Dimensions.get('window').width - 40}
              height={220}
              yAxisLabel="Rs. "
              yAxisSuffix=""
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => colors.text,
                labelColor: (opacity = 1) => colors.text,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: Platform.OS === 'ios' ? 4 : 5,
                  strokeWidth: '2',
                  stroke: colors.primary,
                  fill: colors.card
                },
                propsForBackgroundLines: {
                  stroke: colors.border,
                  strokeDasharray: ''
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withVerticalLines={Platform.OS === 'ios'}
              withHorizontalLines={Platform.OS === 'ios'}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6f8',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
    marginLeft: 4,
    marginRight: 8,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'android' ? 50 : undefined,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  trendOptions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  trendOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  trendOptionActive: {
    backgroundColor: '#007AFF',
  },
  trendOptionText: {
    fontSize: 14,
  },
  trendOptionTextActive: {
    fontWeight: '600',
  },
});

export default RevenueScreen;