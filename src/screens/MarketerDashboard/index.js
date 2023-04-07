import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StatusBar, Button } from "react-native";
import MapView, { Polyline, Marker, Circle } from "react-native-maps";
import * as Animatable from "react-native-animatable";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from "./styles";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "../../navigation/AuthProvider";
import Geolocation from 'react-native-geolocation-service';

const MarketerDashboard = () => {
  const [locations, setLocations] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerMode, setPickerMode] = useState("start"); // "start" or "end"
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [defaultRegion, setRegion] = useState(null);

  const onUserLocationChange = (event) => {
    setUserLocation(event.nativeEvent.coordinate);
  };

  const user = auth().currentUser;
  
  const sampleLocations = [
    { "latitude": 5.5600141, "longitude": -0.2057443 },
    { "latitude": 5.5628497, "longitude": -0.2087192 },
    { "latitude": 5.5656848, "longitude": -0.2116941 },
    { "latitude": 5.5685195, "longitude": -0.2146690 },
    { "latitude": 5.5713539, "longitude": -0.2176439 },
    { "latitude": 5.5741880, "longitude": -0.2206188 },
    { "latitude": 5.5770217, "longitude": -0.2235937 },
    { "latitude": 5.5798551, "longitude": -0.2265686 },
    { "latitude": 5.5826882, "longitude": -0.2295435 },
    { "latitude": 5.5855215, "longitude": -0.2325184 },
  ];
  
  
  useEffect(() => {
    Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
  }, []);
  const fetchLocationData = async (userID, startDate, endDate) => {
    try {
      const response = await fetch('https://ixsfe7iwziapghmqlug6375jaq0ckotp.lambda-url.us-east-2.on.aws/', {
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
      });

      if (!response.ok) {
        throw new Error('Error fetching location data');
      }

      const data = await response.json();
      const fetchedLocations = data.locationData;
    console.log("Location data fetched successfully:", fetchedLocations);

    if (fetchedLocations && fetchedLocations.length > 0) {
      setLocations(fetchedLocations);

      // Calculate the average latitude and longitude
      const avgLatitude = fetchedLocations.reduce((sum, loc) => sum + loc.latitude, 0) / fetchedLocations.length;
      const avgLongitude = fetchedLocations.reduce((sum, loc) => sum + loc.longitude, 0) / fetchedLocations.length;
     console.log("Average latitude:", avgLatitude, "Average longitude:", avgLongitude);
      // Animate the map to the new region
      mapRef.current.animateToRegion(
        defaultRegion,
        1000
      );
    
    }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const showDatePicker = (mode) => {
    setPickerMode(mode);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (pickerMode === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <MapView
        ref={mapRef}
        showsUserLocation={true}
        style={{ width: "100%", height: "70%", backgroundColor: "white" }}
        zoomEnabled={true}
        minZoomLevel={12}
        initialRegion={defaultRegion}
        onUserLocationChange={onUserLocationChange}

      >
        {locations.length > 0 &&
        locations.map((location, index) => (
            <Marker
            key={index}
            coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
            }}
            title={"Location " + (index + 1)}
            description={
                "Latitude: " +
                location.latitude +
                ", Longitude: " +
                location.longitude
            }
            />
        ))}
        {locations.length > 0 && (
        <Polyline coordinates={locations} strokeWidth={4} strokeColor={"blue"} />
        )}
        {userLocation && (
        <Circle
        center={userLocation}
        radius={25} // Adjust the size of the circle as needed
        fillColor="blue"
        zIndex={2} // To ensure the circle is displayed above other map elements
        strokeWidth={0}
        />
    )}

      </MapView>

      <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={100}
        style={styles.footer}
      >
        <View style={styles.datePickerContainer}>
          <Button title="Select Start Date" onPress={() => showDatePicker('start')} />
          <Button title="Select End Date" onPress={() => showDatePicker('end')} />
        </View>
        {startDate && endDate && (
          <Text style={styles.dateRangeText}>
            Location history from {startDate.toDateString()} to{' '}
            {endDate.toDateString()}
          </Text>
        )}
        {startDate && endDate && (
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={() => fetchLocationData(user.uid, startDate, endDate)}
          >
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