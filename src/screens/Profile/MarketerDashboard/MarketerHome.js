import React, {useEffect, useState, useMemo, useCallback, useRef} from 'react';
import {Dimensions, Animated, Alert} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import auth from '@react-native-firebase/auth';

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
      toValue: 0.45 * screen.height,
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

  const onRegionChangeComplete = useCallback(_region => {
    setRegion(_region);
  }, []);

  const sendUpdatedHomeData = useCallback(
    updatedHome => {
      const _ws = new WebSocket('wss://97lnj6qe60.execute-api.us-east-2.amazonaws.com/production/');

      _ws.onopen = function () {
        setWS(_ws);
      };

      if (ws && ws.readyState === ws.OPEN) {
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
        const response = await fetch(
          'https://o0ds966jy0.execute-api.us-east-2.amazonaws.com/prod/unverifiedhomes',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userLocation: {
                latitude: `${position.coords.latitude}`,
                longitude: `${position.coords.longitude}`,
                // Use for testing ONLY!
                // latitude: 5.60589164450265,
                // longitude: -0.1883120435406709,
              },
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
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
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

  useEffect(() => {
    if (!position || ranOnce) {
      return;
    }

    setRanOnce(true);
    setCurrentPosition(position);
    fetchUnverifiedHomes();
  }, [position, ranOnce, fetchUnverifiedHomes]);

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

      // If the user moves more than 5KM calculate the euclidean distance
      if (
        currentPosition &&
        currentPosition.coords &&
        _position &&
        _position.coords &&
        calculateDistance(currentPosition.coords, _position.coords) > 5
      ) {
        makeANewRequest(true);
      }
    },
    [calculateDistance, currentPosition, makeANewRequest],
  );

  useEffect(() => {
    const _ws = new WebSocket('wss://97lnj6qe60.execute-api.us-east-2.amazonaws.com/production/');
    _ws.onopen = function () {
      setWS(_ws);
    };
    _ws.onmessage = function (event) {
      const message = JSON.parse(event.data);
      // Handle the message based on its content
      if (message.action === 'homeUpdate') {
        // 1. Find the marker in the markers state that matches the received update
        const updatedMarkerIndex = markers.findIndex(marker => marker.id === message.data.id);

        if (updatedMarkerIndex !== -1) {
          // 2. Update that marker's data with the new data from the homeUpdate
          const updatedMarkers = [...markers];
          updatedMarkers[updatedMarkerIndex] = message.data;

          // 3. Set the updated list of markers back to the state
          setMarkers(updatedMarkers);
        }
      }
      // Add other message handling logic as needed
    };
    return () => {
      // Send the 'offline' status to the server before closing the WebSocket connection
      if (_ws.readyState === _ws.OPEN) {
        _ws.send(
          JSON.stringify({
            action: 'locationUpdate',
            data: {
              marketerId: auth().currentUser.uid,
              marketerStatus: 'offline',
            },
          }),
        );
      }
      _ws.close(undefined, 'Unmount');
    };
  }, [markers]);

  useEffect(() => {
    if (ws && position) {
      const sendLocationUpdate = () => {
        ws.send(
          JSON.stringify({
            action: 'locationUpdate',
            data: {
              marketerId: auth().currentUser.uid,
              marketerStatus: 'online',
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            },
          }),
        );
      };

      // Send the initial update immediately after position change
      sendLocationUpdate();

      // Set interval to continue sending updates every 10 seconds
      const locationUpdateInterval = setInterval(sendLocationUpdate, 10000);

      return () => clearInterval(locationUpdateInterval); // Clear the interval when position changes or component unmounts
    }
  }, [ws, position]);

  useEffect(() => {
    if (!position || ranOnce) {
      return;
    }

    setCurrentPosition(position);
    fetchUnverifiedHomes();
    setRanOnce(true);
  }, [fetchUnverifiedHomes, position, ranOnce, searchAfter]);

  return (
    <Page inline type="drawer" header="Marketer Home">
      {loading && <PageSpinner />}

      <Location noRender getPosition={getPosition} />

      <MapView
        showsUserLocation={true}
        followsUserLocation={true}
        zoomEnabled
        onPress={collapse}
        onRegionChangeComplete={onRegionChangeComplete}
        region={region || initialMarker(screen)}
        style={style}
        provider={PROVIDER_GOOGLE}
        minZoomLevel={12}>
        {markers.map(marker => {
          return (
            <Marker
              key={marker.id}
              identifier={marker.id}
              coordinate={marker}
              title={
                marker.title === 'defaultTitle'
                  ? `${marker.sublocality}, ${marker.locality}`
                  : marker.title
              }
              description={marker.description}
              image={
                marker.status === 'pending'
                  ? pending
                  : marker.status === 'approved'
                  ? approved
                  : marker.status === 'rejected'
                  ? rejected
                  : neutral
              }
              onPress={changeMode('home')}
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
              Select a home to update it
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
