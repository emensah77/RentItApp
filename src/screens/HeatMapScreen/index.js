import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Heatmap, PROVIDER_DEFAULT, Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import BackgroundGeolocation, {
    Location,
    Subscription,
  } from 'react-native-background-geolocation';
  import auth from '@react-native-firebase/auth';
  import { AppState } from 'react-native';

  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#383838"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#120202"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#120202"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#383838"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#23a0fd"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.icon",
      "stylers": [
        {
          "color": "#16659e"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text",
      "stylers": [
        {
          "color": "#16659e"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#16659e"
        }
      ]
    }
  ]

  
  
  

const HeatMapScreen = ({ navigation }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const mapViewRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isSendingData, setIsSendingData] = useState(false);
  const [watchPositionSubscription, setWatchPositionSubscription] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  

  

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      sendOnlineStatus(isOnline); // A function to send the online status to your backend
    }
  };
  
  const configureBackgroundGeolocation = async () => {
    try {
      const state = await BackgroundGeolocation.ready({
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 0,
        locationUpdateInterval: 30000,
        fastestLocationUpdateInterval: 30000,
        stopTimeout: 1,
        debug: false,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        stopOnTerminate: false,
        startOnBoot: true,
        heartbeatInterval: 60, // Set the heartbeat interval (in seconds)
      });
  
      console.log('BackgroundGeolocation is configured and ready to use:', state);
  
      if (!state.enabled) {
        BackgroundGeolocation.start(() => {
          console.log('- BackgroundGeolocation tracking started');
        });
      }
  
      const subscription = BackgroundGeolocation.watchPosition(
        async (location) => {
          console.log('[watchPosition] -', location);
          const userLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(userLocation);
          await sendLocationData(userLocation, isOnline);
        },
        (error) => {
          console.warn('[watchPosition] ERROR -', error);
        },
        {
          interval: 30000, // Set the desired interval for location updates (in milliseconds)
          fastestInterval: 30000, // Set the fastest interval for location updates (in milliseconds)
          persist: true, // Set whether or not to persist the location in the plugin's SQLite database
          extras: {}, // Set any extra metadata you want to associate with the recorded locations
        }
      );
  
      setWatchPositionSubscription(subscription);
    } catch (error) {
      console.warn('BackgroundGeolocation error:', error);
    }
  };
  
      

  
  const customGradient = {
    colors: [
      'rgba(0, 255, 0, 0)', // Transparent green (least intense)
      'rgba(0, 255, 0, 1)', // Green
      'rgba(127, 255, 0, 1)', // Chartreuse
      'rgba(255, 255, 0, 1)', // Yellow
      'rgba(255, 165, 0, 1)', // Orange
      'rgba(255, 0, 0, 1)', // Red (most intense)
    ],
    startPoints: [0.0, 0.1, 0.3, 0.5, 0.7, 0.9],
    colorMapSize: 256,
  };
  
  
  const sendLocationData = async (location, isOnline) => {
    console.log('Attempting to send location data:', location);
  
    try {
      const userID = auth().currentUser.uid; // Replace with the actual userId
      const userName = auth().currentUser.displayName; // Replace with the actual username
      const timestamp = new Date().toISOString();
      const action = 'storeLocationData';
  
      const dataToSend = {
        ...location,
        userID,
        timestamp,
        userName,
        action,
        isOnline,

      };
  
      console.log('Sending data to server:', dataToSend);
  
      const response = await fetch('https://ixsfe7iwziapghmqlug6375jaq0ckotp.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      const result = await response.json();
      console.log('Location data sent:', result);
    } catch (error) {
      console.warn('Error sending location data:', error);
    }
  };

  
  
  useEffect(() => {
    configureBackgroundGeolocation();
  
    return () => {
      if (watchPositionSubscription) {
        watchPositionSubscription.remove();
      }
      BackgroundGeolocation.removeAllListeners();
    };
  }, [isOnline]);
  
  
  
  const handleHeatmapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const nearestPoint = heatmapData.reduce((nearest, current) => {
      const currentDistance = Math.hypot(current.latitude - latitude, current.longitude - longitude);
      const nearestDistance = Math.hypot(nearest.latitude - latitude, nearest.longitude - longitude);
  
      return currentDistance < nearestDistance ? current : nearest;
    });
  
    // Check if the nearest point is the same as the selected point and deselect it
    if (selectedPoint && selectedPoint.place === nearestPoint.place) {
      setSelectedPoint(null);
    } else {
      setSelectedPoint(nearestPoint);
    }
      };

      
      
      

    
      
    

  useEffect(() => {
    // Subscribe to location updates
    const watchID = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        //setUserLocation({ latitude: 5.602819054174943, 
            //longitude: -0.1872821914702471 });
        setUserLocation({ latitude, longitude });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 50, interval: 5000, fastestInterval: 2000 }
    );

    // Unsubscribe from location updates when the component is unmounted
    return () => Geolocation.clearWatch(watchID);
  }, []);
  
  useEffect(() => {
    const fetchHeatmapData = async () => {
      const response = await fetch(
        'https://5w22lpjszftj6rbmt63wv4wimi0guwhd.lambda-url.us-east-2.on.aws/',
      );
      const data = await response.json();
      setHeatmapData(data.heatmapData);
      setHeatmapVisible(true);
    };

    fetchHeatmapData();
    console.log('Heatmap data:', heatmapData);
  }, []);

  const animateToRegion = (latitude, longitude) => {
    mapViewRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
      },
      1000
    );
  };
  const handleZoom = (zoomIn) => {
    const newZoomLevel = zoomIn ? zoomLevel + 1 : zoomLevel - 1;
    setZoomLevel(newZoomLevel);
  
    const region = {
      ...mapViewRef.current.__lastRegion,
      latitudeDelta: 0.8 / Math.pow(2, newZoomLevel),
      longitudeDelta: 0.8 / Math.pow(2, newZoomLevel),
    };
  
    mapViewRef.current.animateToRegion(region, 1000);
  };
  const handleMarkerPress = () => {
    setSelectedPoint(null);
  };
  
  

  return (
    <View style={{ flex: 1 }}>
      <MapView
        onPress={handleHeatmapPress}
        customMapStyle={mapStyle}
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        zoomEnabled={true}
        minZoomLevel={5}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 5.602028159656166,
          longitude: -0.183158678544458,
          latitudeDelta: 0.8,
          longitudeDelta: 0.8,
        }}
      >
        
        {heatmapVisible && <Heatmap points={heatmapData} radius={50} opacity={1} gradient={customGradient}/>}

        
        {selectedPoint && (
          
          <Marker
            key={selectedPoint.place}
            coordinate={{ latitude: selectedPoint.latitude, longitude: selectedPoint.longitude }}
            onPress={handleMarkerPress}
          >
            
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 6,
                padding: 8,
                borderWidth: 1,
                borderColor: '#ccc',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{selectedPoint.place}</Text>
              <Text>Count: {selectedPoint.weight}</Text>
            </View>
            
          </Marker>
          
        )}
        
        {userLocation && selectedPoint && (
       
       <MapViewDirections
         origin={userLocation}
         destination={{
           latitude: selectedPoint.latitude,
           longitude: selectedPoint.longitude,
         }}
         
         style={{ flex: 1, zIndex: 100 }}
         apikey={'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys'}
         strokeWidth={7}
         strokeColor="red"
         onReady={({ distance, duration }) => {
           setRouteInfo({ distance, duration });
         }}
       />
     
   )}
      </MapView>

     

      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          if (details && details.geometry && details.geometry.location) {
            const { location } = details.geometry;
            animateToRegion(location.lat, location.lng);
          }
        }}
        query={{
          key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
          language: 'en',
          components: 'country:gh',
        }}
        fetchDetails={true}
        styles={{
            container: {
              position: 'absolute',
              top: 50,
              left: 10,
              width: '80%',
              zIndex: 1,
            },
            textInputContainer: {
              backgroundColor: 'white',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              borderRadius: 10,
            },
            textInput: {
              height: 38,
              color: '#5d5d5d',
              fontSize: 16,
              borderRadius: 10,
            },
          }}
      />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
            position: 'absolute',
            top: 50,
            right: 10,
            width: '15%',
            backgroundColor: 'white',
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 9,
            zIndex: 2,
          }}
      >
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Back</Text>
      </TouchableOpacity>

      <View
  style={{
    position: 'absolute',
    bottom: 80,
    right: 20,
    flexDirection: 'column',
    zIndex: 2,
  }}
>
  <TouchableOpacity
    onPress={() => handleZoom(true)}
    style={{
      backgroundColor: 'white',
      borderRadius: 20,
      marginBottom: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
    }}
  >
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>+</Text>
  </TouchableOpacity>
  <TouchableOpacity
    onPress={() => handleZoom(false)}
    style={{
      backgroundColor: 'white',
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 10,
    }}
  >
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>-</Text>
  </TouchableOpacity>
</View>
<TouchableOpacity
      onPress={() => {
        setIsOnline(!isOnline);
        console.log('isOnline', isOnline);
      }}        
      style={{
          position: 'absolute',
          top: 110,
          right: 10,
          backgroundColor: isOnline ? 'red' : 'white',
          borderRadius: 20,
          paddingHorizontal: 10,
          paddingVertical: 9,
          zIndex: 2,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{isOnline ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
{!heatmapVisible && (
  <View
    style={{
        flex:1,
      backgroundColor:"white",
      width:'50%',
      height:'20%',
      position: 'absolute',
      padding: 20,
      borderRadius:25,
      top: 150,
      right: 100,
      left: 100,
      bottom: 100,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      zIndex: 2,
    }}
  >
    <ActivityIndicator size="large" color="#0000ff" />
    <Text style={{ marginTop: 10 }}>Loading demand...</Text>
  </View>
)}
   

    
    {routeInfo && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderRadius: 0,
            padding: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Distance: {routeInfo.distance.toFixed(2)} km</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Duration: {Math.round(routeInfo.duration)} mins</Text>
        </View>
      )}
    </View>
  );
};

export default HeatMapScreen;