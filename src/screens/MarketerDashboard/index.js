import auth from '@react-native-firebase/auth';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Circle, Marker, Polyline} from 'react-native-maps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from './styles';

const LAMBDA_URL = 'https://buzkhgifcsw5ylapunfcpc23jm0owcpr.lambda-url.us-east-2.on.aws/';

const MarketerDashboard = () => {
  const [locations, setLocations] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerMode, setPickerMode] = useState('start'); // "start" or "end"
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [defaultRegion, setRegion] = useState(null);
  const [nearbyBuildings, setNearbyBuildings] = useState([]);
  const [mapType, setMapType] = useState('standard'); // 'standard' or 'satellite'

  const onUserLocationChange = useCallback(event => {
    setUserLocation(event.nativeEvent.coordinate);
  }, []);

  const user = auth().currentUser;

  const fetchNearbyBuildings = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      });

      if (!response.ok) {
        throw new Error('Error fetching nearby buildings');
      }

      const data = await response.json();
      setNearbyBuildings(data.nearbyBuildings);
    } catch (error) {
      console.error('Error fetching nearby buildings:', error);
    }
  }, []);

  // Call fetchNearbyBuildings when userLocation is updated
  useEffect(() => {
    if (userLocation) {
      fetchNearbyBuildings(userLocation.latitude, userLocation.longitude);
    }
  }, [fetchNearbyBuildings, nearbyBuildings, userLocation]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => console.error(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  const fetchLocationData = useCallback(
    async (userID, startDate, endDate) => {
      try {
        const response = await fetch(
          'https://ixsfe7iwziapghmqlug6375jaq0ckotp.lambda-url.us-east-2.on.aws/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'getLocationDataByDateRange',
              userID,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Error fetching location data');
        }

        const data = await response.json();
        const fetchedLocations = data.locationData;

        if (fetchedLocations && fetchedLocations.length > 0) {
          setLocations(fetchedLocations);
          mapRef.current.animateToRegion(defaultRegion, 1000);
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    },
    [defaultRegion],
  );

  const showDatePicker = useCallback(mode => {
    setPickerMode(mode);
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const handleConfirm = useCallback(
    date => {
      if (pickerMode === 'start') {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      hideDatePicker();
    },
    [hideDatePicker, pickerMode],
  );

  const toggleMapType = useCallback(() => {
    setMapType(prevMapType => (prevMapType === 'standard' ? 'satellite' : 'standard'));
  }, []);

  const zoomIn = useCallback(() => {
    setRegion(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setRegion(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  }, []);

  useEffect(() => {
    if (mapRef.current && defaultRegion) {
      mapRef.current.animateToRegion(defaultRegion, 1000);
    }
  }, [defaultRegion]);

  const onChangeComplete = useCallback(region => setRegion(region), []);
  const onStartDate = useCallback(() => showDatePicker('start'), [showDatePicker]);
  const onEndDate = useCallback(() => showDatePicker('end'), [showDatePicker]);
  const fetchButton = useCallback(() => {
    fetchLocationData(user.uid, startDate, endDate);
  }, [endDate, fetchLocationData, startDate, user.uid]);
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <MapView
        ref={mapRef}
        showsUserLocation
        style={styles.map}
        zoomEnabled
        minZoomLevel={12}
        region={defaultRegion}
        onUserLocationChange={onUserLocationChange}
        mapType={mapType}
        onRegionChangeComplete={onChangeComplete}>
        {locations.length > 0 &&
          locations.map((location, index) => (
            <Marker
              key={location.latitude * location.longitude}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={`Location ${index + 1}`}
              description={`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
            />
          ))}
        {locations.length > 0 && (
          <Polyline coordinates={locations} strokeWidth={4} strokeColor="blue" />
        )}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={2} // Adjust the size of the circle as needed
            fillColor="blue"
            zIndex={2} // To ensure the circle is displayed above other map elements
            strokeWidth={0}
          />
        )}
      </MapView>
      <View style={styles.zoomButtonsContainer}>
        <TouchableOpacity onPress={zoomIn} style={styles.zoomButton}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomOut} style={styles.zoomButton}>
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>

      <Animatable.View useNativeDriver animation="fadeInUpBig" duration={100} style={styles.footer}>
        <View style={styles.datePickerContainer}>
          <Button title="Select Start Date" onPress={onStartDate} />
          <Button title="Select End Date" onPress={onEndDate} />
        </View>
        <TouchableOpacity onPress={toggleMapType} style={styles.toggleMapTypeButton}>
          <Text style={styles.toggleMapTypeText}>Toggle Map Type</Text>
        </TouchableOpacity>

        {startDate && endDate && (
          <Text style={styles.dateRangeText}>
            Location history from {startDate.toDateString()} to {endDate.toDateString()}
          </Text>
        )}
        {startDate && endDate && (
          <TouchableOpacity style={styles.fetchButton} onPress={fetchButton}>
            <Text style={styles.fetchButtonText}>Fetch Location History</Text>
          </TouchableOpacity>
        )}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </Animatable.View>
    </View>
  );
};

export default MarketerDashboard;
