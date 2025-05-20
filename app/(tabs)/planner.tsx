import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    FlatList,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Image
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { router, Stack, useRouter } from 'expo-router';

const NOTE_STORAGE_KEY = 'plannerNotes';

export default function Planner() {
    const navigation = useNavigation();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [notes, setNotes] = useState({});
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadNotes();
    }, []);

    useEffect(() => {
        saveNotes();
    }, [notes]);

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem(NOTE_STORAGE_KEY);
            if (storedNotes) {
                setNotes(JSON.parse(storedNotes));
            }
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    };

    const saveNotes = async () => {
        try {
            await AsyncStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notes));
        } catch (error) {
            console.error('Failed to save notes:', error);
        }
    };

    // Memoized month and year strings for performance
    const { monthName, year, daysArray, firstDayOfMonth } = useMemo(() => {
        const monthName = currentMonth.toLocaleString('default', { month: 'long' });
        const year = currentMonth.getFullYear();

        // Get first day of month (0-6 where 0 is Sunday)
        const firstDayOfMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
        ).getDay();

        // Adjust to make Monday the first day (0 index)
        const adjustedFirstDay = (firstDayOfMonth + 6) % 7;

        const daysInMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
        ).getDate();

        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return { monthName, year, daysArray, firstDayOfMonth: adjustedFirstDay };
    }, [currentMonth]);

    // Weekday headers
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Handle month navigation
    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Clear selected date
    const handleClear = () => {
        setSelectedDate(null);
        setShowNoteModal(false);
    };

    // Create or update a note for the selected date
    const handleSaveNote = () => {
        if (selectedDate && noteText.trim()) {
            const dateKey = `${currentMonth.getMonth() + 1}-${selectedDate}-${currentMonth.getFullYear()}`;
            setNotes(prevNotes => ({
                ...prevNotes,
                [dateKey]: noteText
            }));
            setNoteText('');
            setShowNoteModal(false);
            setIsEditing(false);
        }
    };

    // Delete a note
    const handleDeleteNote = () => {
        if (selectedDate) {
            const dateKey = `${currentMonth.getMonth() + 1}-${selectedDate}-${currentMonth.getFullYear()}`;
            const newNotes = { ...notes };
            delete newNotes[dateKey];
            setNotes(newNotes);
            setNoteText('');
            setShowNoteModal(false);
            setIsEditing(false);
        }
    };

    // Check if a date has a note
    const hasNote = (day) => {
        const dateKey = `${currentMonth.getMonth() + 1}-${day}-${currentMonth.getFullYear()}`;
        return notes[dateKey];
    };

    // Select a date to create or view a note
    const handleDateClick = (day) => {
        setSelectedDate(day);
        const dateKey = `${currentMonth.getMonth() + 1}-${day}-${currentMonth.getFullYear()}`;
        setNoteText(notes[dateKey] || '');
        setIsEditing(!!notes[dateKey]);
        setShowNoteModal(true);
    };

    // Render calendar days in a grid
    const renderCalendarDays = () => {
        const totalDays = daysArray.length;
        const totalCells = Math.ceil((firstDayOfMonth + totalDays) / 7) * 7;
        const cells = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
        }

        // Add day cells
        daysArray.forEach(day => {
            cells.push(
                <TouchableOpacity
                    key={day}
                    onPress={() => handleDateClick(day)}
                    style={[
                        styles.dayButton,
                        selectedDate === day && styles.selectedDay,
                        hasNote(day) && styles.hasNoteDay
                    ]}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.dayText,
                        selectedDate === day && styles.selectedDayText
                    ]}>
                        {day}
                    </Text>
                    {hasNote(day) && <View style={styles.noteIndicator} />}
                </TouchableOpacity>
            );
        });

        // Add empty cells to complete the grid
        while (cells.length < totalCells) {
            cells.push(<View key={`empty-end-${cells.length}`} style={styles.emptyDay} />);
        }

        // Split into rows of 7
        const rows = [];
        for (let i = 0; i < cells.length; i += 7) {
            rows.push(
                <View key={`row-${i}`} style={styles.calendarRow}>
                    {cells.slice(i, i + 7)}
                </View>
            );
        }

        return rows;
    };

    // Format notes for display in the FlatList
    const formattedNotes = useMemo(() => {
        return Object.entries(notes).map(([dateKey, note]) => {
            const [month, day, year] = dateKey.split('-');
            return {
                id: dateKey,
                date: `${month}/${day}/${year}`,
                text: String(note)
            };
        }).sort((a, b) => new Date(b.id) - new Date(a.id)); // Sort by date descending
    }, [notes]);

    return (
        <SafeAreaView style={styles.container}>
          {/* Stack Screen with Header Configuration */}
      <Stack.Screen 
        options={{
          title: 'Planner',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo
                    name="chevron-left"
                    size={28}
                    color="black"
                    style={{ marginLeft: 10 }} // or marginRight, marginVertical, etc.
               />

            </TouchableOpacity>
          ),
          headerTitleStyle: {
            color: 'black',
            fontWeight: '600',
          },
        }}
      />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Calendar Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>All Requests</Text>

                    {/* Calendar */}
                    <View style={styles.calendarContainer}>
                        <View style={styles.monthSelector}>
                            <TouchableOpacity
                                onPress={previousMonth}
                                style={styles.monthNavButton}
                                activeOpacity={0.7}
                            >
                                <Entypo name="chevron-left" size={20} color="#1E293B" />
                            </TouchableOpacity>
                            <Text style={styles.monthTitle}>{`${monthName} ${year}`}</Text>
                            <TouchableOpacity
                                onPress={nextMonth}
                                style={styles.monthNavButton}
                                activeOpacity={0.7}
                            >
                                <Entypo name="chevron-right" size={20} color="#1E293B" />
                            </TouchableOpacity>
                        </View>

                        {/* Weekdays header */}
                        <View style={styles.weekdaysRow}>
                            {weekdays.map((day) => (
                                <Text key={day} style={styles.weekdayText}>
                                    {day}
                                </Text>
                            ))}
                        </View>

                        {/* Days grid */}
                        <View style={styles.calendarGrid}>
                            {renderCalendarDays()}
                        </View>

                        {/* Clear button */}
                        <View style={styles.clearButtonContainer}>
                            <TouchableOpacity
                                onPress={handleClear}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.clearButtonText}>Clear Selection</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Notes Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Total Requests</Text>

                    {formattedNotes.length === 0 ? (
                        <View style={styles.noDataContainer}>
                            <Image
                                source={require('../../assets/images/No-data-found.png')}
                                style={styles.noDataImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.noDataText}>No Requests Found</Text>
                        </View>
                    ) : (
                        <View style={styles.notesContainer}>
                            <Text style={styles.notesTitle}>Your Requests</Text>
                            <FlatList
                                data={formattedNotes}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <View style={styles.noteItem}>
                                        <Text style={styles.noteDate}>{item.date}</Text>
                                        <Text style={styles.noteText}>{item.text}</Text>
                                    </View>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.noteSeparator} />}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Note Creation/Editing Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showNoteModal}
                onRequestClose={() => setShowNoteModal(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        style={styles.modalOverlay}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {`${isEditing ? 'Edit' : 'Create'} Request for ${monthName} ${selectedDate}, ${year}`}
                            </Text>

                            <TextInput
                                style={styles.noteInput}
                                value={noteText}
                                onChangeText={setNoteText}
                                placeholder="Enter your request here..."
                                placeholderTextColor="#94A3B8"
                                multiline={true}
                                textAlignVertical="top"
                                autoFocus={true}
                            />

                            <View style={styles.modalButtons}>
                                {isEditing && (
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.deleteButton]}
                                        onPress={handleDeleteNote}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowNoteModal(false)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleSaveNote}
                                    activeOpacity={0.7}
                                    disabled={!noteText.trim()}
                                >
                                    <Text style={styles.saveButtonText}>
                                        {isEditing ? 'Update' : 'Save'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    // Removed header styles here
    section: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        color: '#1E293B',
    },
    calendarContainer: {
        marginTop: 8,
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthNavButton: {
        padding: 8,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
    },
    weekdaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    weekdayText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
        textAlign: 'center',
        width: 36,
    },
    calendarGrid: {
        marginBottom: 8,
    },
    calendarRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    emptyDay: {
        width: 36,
        height: 36,
        margin: 2,
    },
    dayButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        position: 'relative',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1E293B',
    },
    selectedDay: {
        backgroundColor: '#3B82F6',
    },
    selectedDayText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    hasNoteDay: {
        borderWidth: 1.5,
        borderColor: '#3B82F6',
    },
    noteIndicator: {
        position: 'absolute',
        bottom: 2,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#3B82F6',
    },
    clearButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    clearButtonText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '500',
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    noDataImage: {
        width: 150,
        height: 150,
        marginBottom: 16,
    },
    noDataText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#64748B',
    },
    notesContainer: {
        marginTop: 8,
    },
    notesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 12,
    },
    noteItem: {
        paddingVertical: 12,
    },
    noteDate: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B82F6',
        marginBottom: 4,
    },
    noteText: {
        fontSize: 14,
        color: '#334155',
        lineHeight: 20,
    },
    noteSeparator: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 8,
    },
    modalOverlay: {
        flex:1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    maxHeight: 200,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    marginRight: 'auto',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '500',
  },
});