import { JSX, useState } from 'react';
// BEFORE: import { Calendar, X } from 'lucide-react';
// AFTER:
import { Calendar, X } from 'lucide-react-native'; // Changed this line
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'; // Assuming you might need these for styling if not using a web-view like component structure

// Types for our request data
type RequestStatus = 'Pending' | 'Approved' | 'Completed' | 'Cancelled';

interface DroneRequest {
  id: string;
  farmName: string;
  fieldSize: number; // Assuming acres
  requestType: 'Mapping' | 'Spraying' | 'Monitoring';
  date: Date;
  status: RequestStatus;
  notes?: string;
}

// Mock data for demonstration
const initialRequests: DroneRequest[] = [
  {
    id: '001',
    farmName: 'Green Valley Farm',
    fieldSize: 25,
    requestType: 'Mapping',
    date: new Date(2025, 4, 15), // Month is 0-indexed, so 4 is May
    status: 'Pending'
  },
  {
    id: '002',
    farmName: 'Sunrise Orchards',
    fieldSize: 15,
    requestType: 'Spraying',
    date: new Date(2025, 4, 18),
    status: 'Approved'
  },
  {
    id: '003',
    farmName: 'Golden Fields',
    fieldSize: 40,
    requestType: 'Monitoring',
    date: new Date(2025, 4, 22),
    status: 'Completed'
  }
];

export default function AgriDronePlannerPage() {
  const [requests, setRequests] = useState<DroneRequest[]>(initialRequests);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calendar utilities
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthYear = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to check if a date has requests
  const hasRequests = (date: Date) => {
    return requests.some(req =>
      req.date.getDate() === date.getDate() &&
      req.date.getMonth() === date.getMonth() &&
      req.date.getFullYear() === date.getFullYear()
    );
  };

  // Get requests for selected date
  const getRequestsForDate = (date: Date | null) => {
    if (!date) return [];
    return requests.filter(req =>
      req.date.getDate() === date.getDate() &&
      req.date.getMonth() === date.getMonth() &&
      req.date.getFullYear() === date.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleDeleteRequest = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysCount = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    let calendarDays: JSX.Element[] = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <View key={`empty-${i}`} style={styles.calendarCellEmpty}></View>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysCount; day++) {
      const date = new Date(year, month, day);
      const hasRequestsOnDay = hasRequests(date);
      const isSelected = selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      calendarDays.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.calendarCell,
            isSelected && styles.selectedCell,
            hasRequestsOnDay && !isSelected && styles.hasRequestsCell
          ]}
          onPress={() => handleDateClick(day)}
        >
          <Text style={[isSelected && styles.selectedCellText]}>{day}</Text>
        </TouchableOpacity>
      );
    }
    return calendarDays;
  };

  const dailyRequests = getRequestsForDate(selectedDate);
  const totalFieldSize = dailyRequests.reduce((sum, req) => sum + req.fieldSize, 0);

  // Note: The className props for styling (Tailwind CSS) will not work directly in React Native.
  // You'll need to translate them to React Native StyleSheet objects or use a library
  // that allows Tailwind-like syntax for React Native (e.g., NativeWind).
  // For brevity, this example will keep the structure but styling will need to be adapted.

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSelectedDate(null)}
          >
            <Calendar size={20} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Drone Flight Planner</Text>
        </View>
        <TouchableOpacity style={styles.newRequestButton}>
          <Text style={styles.newRequestButtonText}>New Request</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>All Requests</Text>

          <View style={styles.calendarNav}>
            <TouchableOpacity onPress={prevMonth}>
              <Text style={styles.navButtonText}>&lt;</Text>
            </TouchableOpacity>
            <Text style={styles.monthYearText}>{monthYear}</Text>
            <TouchableOpacity onPress={nextMonth}>
              <Text style={styles.navButtonText}>&gt;</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.daysOfWeekContainer}>
            {daysOfWeek.map(day => (
              <Text key={day} style={styles.dayOfWeekText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {renderCalendar()}
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Total Requests</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{requests.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={[styles.statBox, styles.pendingStatBox]}>
                <Text style={styles.statValue}>
                  {requests.filter(r => r.status === 'Pending').length}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={[styles.statBox, styles.doneStatBox]}>
                <Text style={styles.statValue}>
                  {requests.filter(r => r.status === 'Completed').length}
                </Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Daily schedule */}
        <ScrollView style={styles.dailyScheduleContainer}>
          {selectedDate ? (
            <>
              <Text style={styles.sectionTitle}>
                {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>

              {dailyRequests.length > 0 ? (
                <>
                  <View style={styles.dailySummary}>
                    <Text style={styles.dailySummaryText}>
                      {dailyRequests.length} requests | {totalFieldSize} acres total
                    </Text>
                  </View>

                  <View>
                    {dailyRequests.map(request => (
                      <View key={request.id} style={styles.requestItem}>
                        <View style={styles.requestItemHeader}>
                          <Text style={styles.requestFarmName}>{request.farmName}</Text>
                          <View style={styles.requestStatusContainer}>
                            <Text style={[
                              styles.statusBadge,
                              request.status === 'Pending' && styles.statusPending,
                              request.status === 'Approved' && styles.statusApproved,
                              request.status === 'Completed' && styles.statusCompleted,
                              request.status === 'Cancelled' && styles.statusCancelled,
                            ]}>
                              {request.status}
                            </Text>
                            <TouchableOpacity onPress={() => handleDeleteRequest(request.id)}>
                              <X size={16} color="#6B7280" />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.requestDetails}>
                          <View>
                            <Text><Text style={styles.detailLabel}>Type:</Text> {request.requestType}</Text>
                          </View>
                          <View>
                            <Text><Text style={styles.detailLabel}>Field size:</Text> {request.fieldSize} acres</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <View style={styles.emptyStateContainer}>
                  <View style={styles.emptyStateIconCircle}>
                    <X size={32} color="#007AFF" />
                  </View>
                  <Text style={styles.emptyStateText}>No flights scheduled</Text>
                  <TouchableOpacity>
                    <Text style={styles.addNewRequestText}>+ Add new request</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIconCircle}>
                <Calendar size={32} color="#007AFF" />
              </View>
              <Text style={styles.emptyStateText}>Select a date to view scheduled flights</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// Basic StyleSheet for React Native. You'll need to expand this significantly
// to match the Tailwind CSS styling or use a library like NativeWind.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Replaces max-w-4xl mx-auto bg-white rounded-lg shadow
    // Shadow and rounded corners need platform-specific handling or View props
  },
  header: {
    borderBottomWidth: 1,
    borderColor: '#E5E7EB', // border-b
    padding: 16, // p-4
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    // space-x-2 would need margin on one element
  },
  iconButton: {
    // hover:bg-gray-100 p-2 rounded-full - Hover needs special handling
    padding: 8,
    borderRadius: 9999,
    marginRight: 8, // for space-x-2
  },
  headerTitle: {
    fontSize: 20, // text-xl
    fontWeight: '600', // font-semibold
  },
  newRequestButton: {
    backgroundColor: '#007AFF', // bg-blue-500
    paddingHorizontal: 16, // px-4
    paddingVertical: 8,   // py-2
    borderRadius: 6,      // rounded-md
    // hover:bg-blue-600 - Hover needs special handling
  },
  newRequestButtonText: {
    color: '#FFF', // text-white
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row', // flex (assuming horizontal layout like web)
  },
  calendarContainer: {
    width: 256, // w-64
    borderRightWidth: 1,
    borderColor: '#E5E7EB', // border-r
    padding: 16, // p-4
  },
  sectionTitle: {
    fontWeight: '500', // font-medium
    marginBottom: 16, // mb-4 or mb-2
  },
  calendarNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16, // mb-4
    alignItems: 'center',
  },
  navButtonText: {
    color: '#4B5563', // text-gray-600
    // hover:text-gray-900
    fontSize: 18,
  },
  monthYearText: {
    fontWeight: '500', // font-medium
  },
  daysOfWeekContainer: {
    flexDirection: 'row', // grid grid-cols-7
    // gap-1 needs margins on children
    marginBottom: 8, // mb-2
  },
  dayOfWeekText: {
    flex: 1, // Part of grid-cols-7
    textAlign: 'center',
    fontSize: 10, // text-xs
    color: '#6B7280', // text-gray-500
  },
  calendarGrid: {
    flexDirection: 'row', // grid
    flexWrap: 'wrap',     // grid
    // gap-1 needs margins on children
  },
  calendarCell: {
    width: (256 - 32 - 6 * 4) / 7, // Approximate w-8 based on container width, padding, and gap
    height: (256 - 32 - 6 * 4) / 7, // Approximate h-8
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999, // rounded-full
    // hover:bg-blue-100
    margin: 2, // for gap-1
  },
  calendarCellEmpty: {
    width: (256 - 32 - 6 * 4) / 7,
    height: (256 - 32 - 6 * 4) / 7,
    margin: 2,
  },
  selectedCell: {
    backgroundColor: '#007AFF', // bg-blue-500
  },
  selectedCellText: {
    color: '#FFF', // text-white
  },
  hasRequestsCell: {
    borderWidth: 2,
    borderColor: '#007AFF', // border-2 border-blue-500
  },
  statsContainer: {
    marginTop: 24, // mt-6
    borderTopWidth: 1,
    borderColor: '#E5E7EB', // border-t
    paddingTop: 16, // pt-4
  },
  statsGrid: {
    flexDirection: 'row', // grid grid-cols-3
    // gap-2 needs margins
    justifyContent: 'space-around', // to simulate gap
  },
  statBox: {
    backgroundColor: '#F9FAFB', // bg-gray-50
    padding: 8, // p-2
    borderRadius: 4, // rounded
    alignItems: 'center', // text-center
    flex: 1, // for distribution
    marginHorizontal: 4, // for gap-2
  },
  pendingStatBox: {
    backgroundColor: '#FEF3C7', // bg-yellow-50
  },
  doneStatBox: {
    backgroundColor: '#D1FAE5', // bg-green-50
  },
  statValue: {
    fontSize: 18, // text-lg
    fontWeight: '500', // font-medium
  },
  statLabel: {
    fontSize: 10, // text-xs
    color: '#6B7280', // text-gray-500
  },
  dailyScheduleContainer: {
    flex: 1,
    padding: 16, // p-4
  },
  dailySummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // mb-2
  },
  dailySummaryText: {
    fontSize: 12, // text-sm
    color: '#6B7280', // text-gray-500
  },
  requestItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB', // border
    borderRadius: 8, // rounded-lg
    padding: 12, // p-3
    marginBottom: 12, // space-y-3 -> applied as margin bottom
    // hover:shadow-sm - Shadow needs elevation prop or similar
  },
  requestItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestFarmName: {
    fontWeight: '500', // font-medium
  },
  requestStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // space-x-2 -> margin
  },
  statusBadge: {
    fontSize: 10, // text-xs
    paddingHorizontal: 8, // px-2
    paddingVertical: 4,   // py-1
    borderRadius: 4,    // rounded
    marginRight: 8, // for space-x-2
  },
  statusPending: { backgroundColor: '#FEF3C7', color: '#92400E' }, // bg-yellow-100 text-yellow-800
  statusApproved: { backgroundColor: '#DBEAFE', color: '#1E40AF' }, // bg-blue-100 text-blue-800
  statusCompleted: { backgroundColor: '#D1FAE5', color: '#065F46' }, // bg-green-100 text-green-800
  statusCancelled: { backgroundColor: '#FEE2E2', color: '#991B1B' }, // bg-red-100 text-red-800
  requestDetails: {
    marginTop: 8, // mt-2
    flexDirection: 'row', // grid grid-cols-2
    // gap-2
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#6B7280', // text-gray-500
  },
  emptyStateContainer: {
    flex: 1, // To take available space if parent has flex:1
    alignItems: 'center',
    justifyContent: 'center',
    // h-64 is not directly translatable without fixed height on parent or flex:1
    paddingVertical: 64, // Simulate some height
  },
  emptyStateIconCircle: {
    width: 96, // w-24
    height: 96, // h-24
    backgroundColor: '#EFF6FF', // bg-blue-50
    borderRadius: 48, // rounded-full
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, // mb-4
  },
  emptyStateText: {
    color: '#6B7280', // text-gray-500
  },
  addNewRequestText: {
    marginTop: 16, // mt-4
    color: '#007AFF', // text-blue-500
    // hover:text-blue-700
  },
});