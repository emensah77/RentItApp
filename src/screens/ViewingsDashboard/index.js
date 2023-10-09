import React, {useState, useEffect, useContext, useCallback} from 'react';
import {SafeAreaView, View, ActivityIndicator} from 'react-native';

import {offsets} from '../../assets/styles/global';
import {styles} from './styles';

import Typography from '../../components/DataDisplay/Typography';
import {AuthContext} from '../../navigation/AuthProvider';
import GenericList from '../../components/GenericList';
import {global} from '../../assets/styles';
import Location from '../Authentication/Location'; // Import the Location component

const loadingStyle = [global.flex, global.center];
const safeAreaStyle = {flex: 1, backgroundColor: '#fff'};
const viewingDashboardTextStyle = {marginTop: offsets.offsetC, marginBottom: 32};

const ViewingDashboard = () => {
  const {user} = useContext(AuthContext);

  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ws, setWS] = useState(null);
  const [position, setPosition] = useState(null);

  // WebSocket setup
  useEffect(() => {
    const _ws = new WebSocket('wss://97lnj6qe60.execute-api.us-east-2.amazonaws.com/production/');

    _ws.onopen = function () {
      setWS(_ws);
    };

    return () => {
      if (_ws.readyState === _ws.OPEN) {
        _ws.close(undefined, 'Unmount');
      }
    };
  }, []);

  // Function to update the position state
  const getPosition = useCallback(_position => {
    setPosition(_position);
  }, []);

  const sendLocationUpdate = useCallback(() => {
    if (ws && ws.readyState === ws.OPEN && position) {
      ws.send(
        JSON.stringify({
          action: 'locationUpdate',
          data: {
            marketerId: user.uid,
            marketerName: `Client Viewing: ${user?.fname || ''} ${user?.lname || ''} ${
              user?.displayName
            }`,
            marketerStatus: 'online',
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          },
        }),
      );
    } else {
      console.error('WebSocket connection is not open or position is not available');
    }
  }, [ws, position, user.uid, user?.fname, user?.lname, user?.displayName]);

  useEffect(() => {
    if (ws && position) {
      sendLocationUpdate();
      const locationUpdateInterval = setInterval(sendLocationUpdate, 10000);
      return () => clearInterval(locationUpdateInterval);
    }
  }, [ws, position, sendLocationUpdate]);

  const handleFetchViewings = useCallback(async () => {
    const data = {
      action: 'retrieveViewings', // Action to retrieve viewings
      userId: user.uid,
    };

    try {
      const response = await fetch(
        'https://mhxbfh6thc6jz4pdoitevz4vhq0abvsf.lambda-url.us-east-2.on.aws/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (response.ok) {
        // Success
        setViewings(result.viewings);
      } else {
        // Handle error
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching viewings:', error);
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    if (!user.uid) {
      return;
    }
    handleFetchViewings();
  }, [handleFetchViewings, user.uid]);

  return (
    <>
      <SafeAreaView style={safeAreaStyle}>
        <View style={styles.mainContent}>
          <Typography variant="xlarge" bold style={viewingDashboardTextStyle}>
            Your Viewings
          </Typography>
          {loading ? (
            <View style={loadingStyle}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <>
              {viewings.length > 0 ? (
                <GenericList
                  list={viewings}
                  id="id" // Assuming each viewing has a unique 'id' field
                  flatten // Pass other necessary props as needed
                />
              ) : (
                <>
                  <Typography bold style={styles.subTitle}>
                    No Scheduled Viewings
                  </Typography>
                  <Typography style={styles.text}>
                    You have not scheduled any viewings yet. Start exploring properties and schedule
                    your viewings.
                  </Typography>
                </>
              )}
            </>
          )}
          <Location noRender getPosition={getPosition} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default ViewingDashboard;
