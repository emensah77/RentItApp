import React, {useEffect, useState, useMemo, useCallback, useRef} from 'react';
import {Dimensions, Animated, Alert} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

import HomeForm from './HomeForm';
import DemandForm from './DemandForm';
import RequestForm from './RequestForm';

import Location from '../../Authentication/Location';

import {
  PageSpinner,
  Container,
  Button,
  Typography,
  Whitespace,
  Divider,
  Header,
} from '../../../components';

import hamburger from '../../../assets/images/hamburger.png';
import homeMarker from '../../../assets/images/home-marker.png';
import {global} from '../../../assets/styles';

const style = {width: '100%', height: '100%', backgroundColor: 'white'};

const initialMarker = screen => ({
  latitude: 5.60589164450265,
  longitude: -0.1883120435406709,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0922 * (screen.width / screen.height),
});

const MarketerHome = props => {
  const {
    route: {name},
  } = props;

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

  const screen = Dimensions.get('window');
  const top = useRef(new Animated.Value(0.65 * screen.height)).current;
  const navigation = useNavigation();

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

  const expand = useCallback(() => {
    Animated.timing(top, {
      toValue: 0.25 * screen.height,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [screen.height, top]);

  const collapse = useCallback(() => {
    setMode('default');

    Animated.timing(top, {
      toValue: 0.65 * screen.height,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [screen.height, top]);

  const onRegionChangeComplete = useCallback(_region => {
    setRegion(_region);
  }, []);

  const changeMode = useCallback(
    _mode => e => {
      if (_mode === 'default') {
        Alert.alert('Successfully saved the data.');
      }
      if (_mode === 'home') {
        setMarkerData(markers.find(item => item.id === e.nativeEvent.id));
      }
      setMode(_mode);
      expand();
    },
    [markers, expand],
  );

  const makeANewRequest = useCallback(clearSearchAfter => {
    if (clearSearchAfter === true) {
      setSearchAfter(null);
    }

    setRanOnce(false);
  }, []);

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

      if (ws) {
        ws.send(
          JSON.stringify({
            action: 'locationUpdate',
            marketerId: auth().currentUser.uid,
            location: {
              latitude: _position.coords.latitude,
              longitude: _position.coords.longitude,
            },
            marketerStatus: 'online',
          }),
        );
      }
    },
    [calculateDistance, currentPosition, makeANewRequest, ws],
  );

  useEffect(() => {
    const _ws = new WebSocket('wss://97lnj6qe60.execute-api.us-east-2.amazonaws.com/production/');
    _ws.onopen = function () {
      setWS(_ws);
    };
    return () => {
      _ws.close(undefined, 'Unmount');
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!position || ranOnce) {
        return;
      }

      setLoading(true);
      setRanOnce(true);
      setCurrentPosition(position);

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
            searchAfter,
          }),
        },
      ).catch(e => console.error('An error occurred while fetching markers', e));
      if (!response) {
        return;
      }
      const _markers = await response.json();

      if (Array.isArray(_markers.searchAfter) && _markers.searchAfter.length > 0) {
        setSearchAfter(_markers.searchAfter);
      }

      if (_markers && _markers.homes && _markers.homes.length > 0) {
        setRegion({
          ..._markers.homes[0],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0922 * (screen.width / screen.height),
        });
        setMarkers(__markers => _markers.homes.concat(__markers));
      }
      setLoading(false);
    })();
  }, [position, ranOnce, screen, searchAfter]);

  return (
    <>
      <Header leftIcon={hamburger} onClose={navigation.toggleDrawer}>
        {name}
      </Header>

      {loading && <PageSpinner />}

      <Location noRender getPosition={getPosition} />

      <MapView
        onPress={collapse}
        onRegionChangeComplete={onRegionChangeComplete}
        region={region || initialMarker(screen)}
        style={style}
        provider={PROVIDER_GOOGLE}
        minZoomLevel={12}
        zoomEnabled>
        {markers.map(marker => (
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
            image={homeMarker}
            onPress={changeMode('home')}
          />
        ))}
      </MapView>

      {searchAfter && (
        <Container type="top-75" width="100%" onPress={makeANewRequest}>
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
          <HomeForm data={markerData} onSuccess={changeMode('default')} />
        ) : mode === 'demand' ? (
          <DemandForm data={markerData} onSuccess={changeMode('default')} />
        ) : mode === 'request' ? (
          <RequestForm data={markerData} onSuccess={changeMode('default')} />
        ) : null}
      </Animated.ScrollView>
    </>
  );
};

export default MarketerHome;
