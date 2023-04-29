import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleViewings, setVisibleViewings] = useState(6);
  const [assignedReps, setAssignedReps] = useState([]);
  const [selectedRep, setSelectedRep] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const fetchAssignedReps = useCallback(async () => {
    try {
      const result = await firebase.firestore().collection('assignedReps');
      const newAssignedReps = [];

      await result.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          newAssignedReps.push(doc.data());
        });
      });

      setAssignedReps(newAssignedReps);
      console.log('Assigned Reps', newAssignedReps);
    } catch (error) {
      console.error('Error fetching assigned reps:', error);
    }
  }, []);

  useEffect(() => {
    fetchViewingsWithoutAssignedRep();
    fetchAssignedReps();
  }, [fetchAssignedReps]);

  const upcomingViewings = useMemo(
    () =>
      viewings?.filter(
        viewing =>
          new Date(viewing.viewingDate).toDateString() ===
          new Date().toDateString(),
      ),
    [viewings],
  );
  const fetchViewingsByAssignedRep = useCallback(async assignedRep => {
    try {
      const response = await fetch(
        'https://xzafkcsbjnpqggobduiqseeyqm0qnkhl.lambda-url.us-east-2.on.aws/',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({action: 'fetchByAssignedRep', assignedRep}),
        },
      );
      const data = await response.json();
      setViewings(data.viewings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching viewings by assigned rep:', error);
      setLoading(false);
    }
  }, []);

  const fetchViewingsWithoutAssignedRep = useCallback(async () => {
    try {
      const response = await fetch(
        'https://xzafkcsbjnpqggobduiqseeyqm0qnkhl.lambda-url.us-east-2.on.aws/',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({action: 'fetchAllWithoutAssignedRep'}),
        },
      );
      const data = await response.json();
      setViewings(data.viewings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching viewings without assigned rep:', error);
      setLoading(false);
    }
  }, []);

  const processViewingsForCalendar = useCallback(() => {
    const markedDates = {};

    viewings.forEach(viewing => {
      markedDates[viewing.viewingDate] = {
        selected: true,
        marked: true,
      };
    });

    return markedDates;
  }, [viewings]);

  const filteredViewings = useMemo(
    () =>
      viewings.filter(viewing => {
        const dateFilter = viewing.viewingDate === selectedDate;
        const repFilter = !selectedRep || viewing.assignedRep === selectedRep;
        return dateFilter && repFilter;
      }),
    [selectedDate, selectedRep, viewings],
  );

  const loadMoreViewings = useCallback(() => {
    setVisibleViewings(visibleViewings + 6);
  }, [visibleViewings]);

  const statusColor = useCallback(status => {
    switch (status) {
      case 'In Progress':
        return 'deeppink';
      case 'Completed':
        return 'green';
      case 'Canceled':
        return 'red';
      case 'Todo':
        return 'blue';
      default:
        return 'gray';
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = useCallback(
    ({item}) => (
      <View
        style={[
          styles.viewingCard,
          {backgroundColor: statusColor(item.status)},
        ]}>
        <Text style={styles.viewingCardTitle}>{item.username}</Text>
        <Text style={styles.viewingCardDetails}>
          {item.viewingDate} at {item.viewingTime}
        </Text>
        <Text style={styles.viewingCardDetails}>
          Contact: {item.usercontact}
        </Text>
        <Text style={styles.viewingCardDetails}>
          Location: {item.userlocation}
        </Text>
        <Text style={styles.viewingCardDetails}>rep: {item.assignedRep}</Text>

        <TouchableOpacity>
          <Text style={styles.viewingCardStatus}>Status: {item.status}</Text>
        </TouchableOpacity>
      </View>
    ),
    [statusColor],
  );

  return (
    <LinearGradient
      colors={['deeppink', 'blue']}
      start={{x: 0.1, y: 0.2}}
      end={{x: 1, y: 0.5}}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Dashboard</Text>
        </View>
        <View style={styles.repPickerContainer}>
          {assignedReps.length > 0 && (
            <DropDownPicker
              open={open}
              value={value}
              items={assignedReps.map(rep => ({
                label: rep.name,
                value: rep.name,
              }))}
              setOpen={setOpen}
              setValue={setValue}
              setItems={items =>
                setAssignedReps(
                  items.map(item => ({name: item.label, value: item.value})),
                )
              }
              containerStyle={{
                position: 'absolute',
                top: 10,
                right: 10,

                width: 150, // Set the width of the container
              }}
              labelStyle={{
                color: 'blue',
              }}
              style={{
                backgroundColor: '#f0f0f0',
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
            />
          )}
        </View>

        <View style={styles.upcomingViewingsContainer}>
          <Text style={styles.upcomingViewingsTitle}>Upcoming Viewings</Text>
          <FlatList
            data={upcomingViewings}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.calendarContainer}>
          <Text style={styles.calendarTitle}>Calendar</Text>
          <Calendar
            markedDates={processViewingsForCalendar()}
            onDayPress={day => {
              setSelectedDate(day.dateString);
            }}
          />
        </View>
        <FlatList
          data={filteredViewings.slice(0, visibleViewings)}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            filteredViewings.length > visibleViewings ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMoreViewings}>
                <Text style={styles.loadMoreButtonText}>Load More</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  filterButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },

  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calendarContainer: {
    backgroundColor: 'transparent',
    padding: 20,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  viewingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15, // Adjust the margin here
    width: screenWidth * 0.8,
    height: screenWidth * 0.3,
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: 'white',
  },
  viewingCardStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  viewingCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  viewingCardDetails: {
    fontSize: 14,
    color: 'white',
  },
  loadMoreButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  loadMoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },

  upcomingViewingsContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },

  upcomingViewingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  repPickerContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default DashboardScreen;
