import React, {useEffect, useState, useMemo, useCallback, useRef, useContext} from 'react';
import {Dimensions, Animated, Alert} from 'react-native';
import {useRoute, useIsFocused} from '@react-navigation/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import Agreement from '../../Authentication/Agreement';

import {AuthContext} from '../../../navigation/AuthProvider';

import HomeForm from './HomeForm';
import DemandForm from './DemandForm';
import RequestForm from './RequestForm';

import Location from '../../Authentication/Location';

import {
  Page,
  PageSpinner,
  Container,
  Button,
  Typography,
  Whitespace,
  Divider,
} from '../../../components';

import neutral from '../../../assets/images/markers/neutral.png';
import pending from '../../../assets/images/markers/pending.png';
import rejected from '../../../assets/images/markers/rejected.png';
import approved from '../../../assets/images/markers/approved.png';
import {global} from '../../../assets/styles';

const style = {width: '100%', height: '100%', backgroundColor: '#FFF'};

const initialMarker = screen => ({
  latitude: 5.60589164450265,
  longitude: -0.1883120435406709,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0922 * (screen.width / screen.height),
});

const screen = Dimensions.get('window');

const MarketerHome = () => {
  const [ranOnce, setRanOnce] = useState(false);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState();
  const [position, setPosition] = useState();
  const [currentPosition, setCurrentPosition] = useState();
  const [markers, setMarkers] = useState([]);
  const [ws, setWS] = useState();
  const [searchAfter, setSearchAfter] = useState(null);
  const [markerData, setMarkerData] = useState();
  const [mode, setMode] = useState('default');
  const {user} = useContext(AuthContext);
  const route = useRoute();
  const isFocused = useIsFocused();
  const [showAgreement, setShowAgreement] = useState(false);

  const top = useRef(new Animated.Value(0.5 * screen.height)).current;

  const animatedStyle = useMemo(
    () => [
      global.page,
      global['top-10'],
      {
        borderRadius: 50,
        top,
      },
    ],
    [top],
  );

  const collapse = useCallback(() => {
    setMode('default');

    Animated.timing(top, {
      toValue: 0.55 * screen.height,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [top]);

  const expand = useCallback(
    _mode => {
      if (_mode === 'default' && JSON.stringify(top) === '0') {
        return collapse();
      }

      Animated.timing(top, {
        toValue: _mode === 'home' ? 0 : 0.25 * screen.height,
        duration: 400,
        useNativeDriver: false,
      }).start();
    },
    [top, collapse],
  );

  const getMarkerImage = useCallback(status => {
    switch (status) {
      case 'pending':
        return pending;
      case 'approved':
        return approved;
      case 'rejected':
        return rejected;
      default:
        return neutral;
    }
  }, []);

  const onRegionChangeComplete = useCallback(
    _region => {
      // Ensure both _region and region are defined before proceeding
      if (!_region || !region) return;

      setRegion(_region);
    },
    [region],
  );

  useEffect(() => {
    const checkAgreement = async () => {
      const agreement = await AsyncStorage.getItem('marketerTermsAgreed');
      if (!agreement) {
        setShowAgreement(true);
      }
    };

    checkAgreement();
  }, []);

  const sendUpdatedHomeData = useCallback(
    updatedHome => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            action: 'homeUpdate',
            data: updatedHome,
          }),
        );
      } else {
        console.error('WebSocket connection is not open');
      }
    },
    [ws],
  );

  const changeMode = useCallback(
    (_mode, success) => e => {
      if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
      }

      if (success) {
        Alert.alert('Successfully saved the data.');
        if (success && _mode === 'default') {
          sendUpdatedHomeData(e);
        }
      }
      if (_mode === 'home') {
        setMarkerData(markers.find(item => item.id === e.nativeEvent.id));
      }
      setMode(_mode);
      expand(_mode);
    },
    [expand, markers, sendUpdatedHomeData],
  );

  const makeANewRequest = useCallback(clearSearchAfter => {
    if (clearSearchAfter === true) {
      setSearchAfter(null);
    }

    setRanOnce(false);
  }, []);

  const fetchUnverifiedHomes = useCallback(
    async (searchAfterValue = searchAfter) => {
      setLoading(true);

      try {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          // Use for testing ONLY!
          // latitude: 5.60589164450265,
          // longitude: -0.1883120435406709,
        };

        const response = await fetch(
          'https://o0ds966jy0.execute-api.us-east-2.amazonaws.com/prod/unverifiedhomes',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userLocation,
              searchAfter: searchAfterValue,
            }),
          },
        );

        if (!response) {
          console.error('No response received');
          return;
        }

        const _markers = await response.json();

        if (Array.isArray(_markers.searchAfter) && _markers.searchAfter.length > 0) {
          setSearchAfter(_markers.searchAfter);
        }

        if (_markers && _markers.homes && _markers.homes.length > 0) {
          // Keep the markers from the current state that are not present in the fetched data
          const oldMarkers = markers.filter(
            oldMarker => !_markers.homes.some(newMarker => newMarker.id === oldMarker.id),
          );

          // Merge the fetched data and the kept markers from the current state
          setMarkers([..._markers.homes, ...oldMarkers]);

          setRegion({
            ...userLocation,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0922 * (screen.width / screen.height),
          });
        }
      } catch (error) {
        console.error('An error occurred while fetching markers', error);
      } finally {
        setLoading(false);
      }
    },
    [position, searchAfter, markers],
  );

  const degreesToRadians = useCallback(degrees => {
    return (degrees * Math.PI) / 180;
  }, []);

  // Calculates the distance between two geographic coordinates.
  const calculateDistance = useCallback(
    (location1, location2) => {
      const earthRadiusKm = 6371; // Radius of the Earth in km

      const dLat = degreesToRadians(location2.latitude - location1.latitude);
      const dLon = degreesToRadians(location2.longitude - location1.longitude);

      const lat1 = degreesToRadians(location1.latitude);
      const lat2 = degreesToRadians(location2.latitude);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return earthRadiusKm * c;
    },
    [degreesToRadians],
  );

  const getPosition = useCallback(
    _position => {
      setPosition(_position);

      setRegion({
        latitude: _position.coords.latitude,
        longitude: _position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0922 * (screen.width / screen.height),
      });

      // If the user moves more than 5KM calculate the euclidean distance
      if (
        currentPosition &&
        currentPosition.coords &&
        _position &&
        _position.coords &&
        calculateDistance(currentPosition.coords, _position.coords) > 0.5
      ) {
        makeANewRequest(true);
      }
    },
    [calculateDistance, currentPosition, makeANewRequest],
  );

  useEffect(() => {
    if (isFocused && route.params?.itemDetails) {
      // Since the screen is focused, we can safely access route.params here.
      setMarkerData(route.params.itemDetails); // Directly use the details from the notification
      setMode('home'); // Set mode to 'home' to show the HomeForm with notification details
      expand('home'); // Directly call expand to open the HomeForm
    }
  }, [isFocused, route.params?.itemDetails, setMarkerData, setMode, expand]);

  // Optimized function to update marker status
  const updateMarkerStatus = useCallback((homeId, newStatus) => {
    setMarkers(prevMarkers =>
      prevMarkers.map(marker => (marker.id === homeId ? {...marker, status: newStatus} : marker)),
    );
  }, []);

  // Effect for handling WebSocket messages
  const setupWebSocket = useCallback(() => {
    const newWs = new WebSocket('wss://97lnj6qe60.execute-api.us-east-2.amazonaws.com/production/');

    newWs.onopen = () => {
      setWS(newWs);
    };

    newWs.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.action === 'homeUpdate') {
        updateMarkerStatus(message.data.id, message.data.status);
      }
    };

    newWs.onclose = () => {
      setTimeout(setupWebSocket, 100);
    };

    return newWs;
  }, [updateMarkerStatus]);

  useEffect(() => {
    const wsCurrent = setupWebSocket();

    return () => {
      wsCurrent.close();
    };
  }, [setupWebSocket]);

  useEffect(() => {
    if (ws) {
      const handleMessage = event => {
        const message = JSON.parse(event.data);

        // Handle the message based on its content
        if (message.action === 'homeUpdate') {
          const updatedMarkerIndex = markers.findIndex(marker => marker.id === message.data.id);

          if (updatedMarkerIndex !== -1) {
            // Update the marker's data with the new data from the homeUpdate
            const updatedMarkers = [...markers];
            updatedMarkers[updatedMarkerIndex] = message.data;
            setMarkers(updatedMarkers);
          }
        }
      };

      // Assign the event handler
      ws.onmessage = handleMessage;

      // Clean-up function
      return () => {
        if (ws) {
          ws.onmessage = null;
        }
      };
    }
  }, [ws, markers]);

  const sendLocationUpdate = useCallback(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          action: 'locationUpdate',
          data: {
            marketerId: user.uid,
            marketerName: `${user?.displayName || ''}`,
            marketerStatus: 'online',
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          },
        }),
      );
    }
  }, [ws, user, position]);

  useEffect(() => {
    if (position) {
      // Send the initial update immediately after position change
      sendLocationUpdate();

      // Set interval to continue sending updates every 10 seconds
      const locationUpdateInterval = setInterval(sendLocationUpdate, 10000);

      return () => {
        clearInterval(locationUpdateInterval); // Clear the interval when position changes or component unmounts

        // Send 'offline' status before component unmounts
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              action: 'locationUpdate',
              data: {
                marketerId: user.uid,
                marketerName: `${user?.displayName || ''}`,
                marketerStatus: 'offline',
                location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
              },
            }),
          );
        }
      };
    }
  }, [position, sendLocationUpdate, ws, user.uid, user?.displayName]);

  const handleMarkerPress = useCallback(
    e => {
      // setDestination(e.nativeEvent.coordinate);
      changeMode('home')(e);
    },
    [changeMode],
  );
  const handleMapClick = useCallback(
    e => {
      const newHomeData = {
        id: uuid.v4(), // Generate new UUID
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        newHome: true,
      };

      setMarkerData(newHomeData);
      setMode('home');
      expand('home');
    },
    [expand],
  );

  useEffect(() => {
    if (!position || ranOnce) {
      return;
    }

    setCurrentPosition(position);
    fetchUnverifiedHomes();
    setRanOnce(true);
  }, [fetchUnverifiedHomes, position, ranOnce, searchAfter]);

  if (showAgreement) {
    return <Agreement marketerTerms={true} />;
  }

  return (
    <Page inline type="drawer" header="Marketer Home">
      {loading && <PageSpinner />}

      <Location noRender getPosition={getPosition} />

      <MapView
        showsUserLocation={true}
        followsUserLocation={true}
        zoomEnabled
        onPress={handleMapClick}
        onRegionChangeComplete={onRegionChangeComplete}
        region={region || initialMarker(screen)}
        style={style}
        rotateEnabled={true}
        provider={PROVIDER_GOOGLE}
        minZoomLevel={5}
        maxZoomLevel={22}>
        {markers.map(marker => {
          return (
            <Marker
              key={`${marker.id}-${marker.status}`}
              identifier={marker.id}
              coordinate={marker}
              title={
                marker.title === 'defaultTitle'
                  ? `${marker.sublocality}, ${marker.locality}, ${marker.status}`
                  : `${marker.title}, ${marker.status}`
              }
              description={marker.description}
              image={getMarkerImage(marker.status)}
              onPress={handleMarkerPress}
            />
          );
        })}
      </MapView>
      {searchAfter && (
        <Container type="top-25" width="100%" onPress={makeANewRequest}>
          <Container row type="chipSmall" color="#194CC3" width={110}>
            <Typography size={13} width="100%" color="#FFF" center>
              {loading ? 'Loading' : 'Load more'}
            </Typography>
          </Container>
        </Container>
      )}

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={animatedStyle}
        contentContainerStyle={global.pageContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        {mode === 'default' ? (
          <>
            <Whitespace marginTop={10} />

            <Typography height={30} size={20} width="50%" color="#000" center>
              Tap a home to update it
            </Typography>

            <Divider top={25} bottom={25}>
              or
            </Divider>

            <Container width="100%" row type="spaceBetween">
              <Button accessibilityLabel="Demand Form" type="plain" onPress={changeMode('demand')}>
                Demand
              </Button>

              <Whitespace marginLeft={2} />

              <Button
                accessibilityLabel="Request Form"
                type="standard"
                onPress={changeMode('request')}>
                Make a Request
              </Button>
            </Container>
          </>
        ) : mode === 'home' ? (
          <HomeForm
            data={markerData}
            onClose={changeMode('default')}
            onSuccess={changeMode('default', true)}
          />
        ) : mode === 'demand' ? (
          <DemandForm
            data={markerData}
            onClose={changeMode('default')}
            onSuccess={changeMode('default', true)}
          />
        ) : mode === 'request' ? (
          <RequestForm
            data={markerData}
            onClose={changeMode('default')}
            onSuccess={changeMode('default', true)}
          />
        ) : null}
      </Animated.ScrollView>
    </Page>
  );
};

export default MarketerHome;
