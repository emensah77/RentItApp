import React, {useContext, useEffect, useState} from 'react';
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import BackgroundFetch from 'react-native-background-fetch';

const LocationPermissions = () => {
  const navigation = useNavigation();
  const [allow, setAllow] = useState(false);

  const subscribe = subscription => {};

  const unsubscribe = () => {};

  const addEvent = (name, params) => {};
  /// Configure the BackgroundGeolocation plugin.
  const initBackgroundGeolocation = async () => {
    subscribe(
      BackgroundGeolocation.onProviderChange(event => {
        console.log('[onProviderChange]', event);
        addEvent('onProviderChange', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onLocation(
        location => {
          console.log('[onLocation]', location);
          addEvent('onLocation', location);
        },
        error => {
          console.warn('[onLocation] ERROR: ', error);
        },
      ),
    );

    subscribe(
      BackgroundGeolocation.onMotionChange(location => {
        console.log('[onMotionChange]', location);
        addEvent('onMotionChange', location);
      }),
    );

    subscribe(
      BackgroundGeolocation.onGeofence(event => {
        console.log('[onGeofence]', event);
        addEvent('onGeofence', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onConnectivityChange(event => {
        console.log('[onConnectivityChange]', event);
        addEvent('onConnectivityChange', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onEnabledChange(enabled => {
        console.log('[onEnabledChange]', enabled);
        addEvent('onEnabledChange', {enabled});
      }),
    );

    subscribe(
      BackgroundGeolocation.onHttp(event => {
        console.log('[onHttp]', event);
        addEvent('onHttp', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onLocation(location => {
        // console.log(`Latitude: ${location.coords.latitude}`);
        // console.log(`Longitude: ${location.coords.longitude}`);
      }),
    );

    subscribe(
      BackgroundGeolocation.onActivityChange(event => {
        console.log('[onActivityChange]', event);
        addEvent('onActivityChange', event);
      }),
    );

    subscribe(
      BackgroundGeolocation.onPowerSaveChange(enabled => {
        console.log('[onPowerSaveChange]', enabled);
        addEvent('onPowerSaveChange', {isPowerSaveMode: enabled});
      }),
    );

    /// Configure the plugin.
    const state = await BackgroundGeolocation.ready(
      {
        debug: true,
        logLevel: BackgroundGeolocation.LOG_LEVEL_NONE,
        distanceFilter: 10,
        stopOnTerminate: false,
        startOnBoot: true,
        disableMotionActivityUpdates: true,
        backgroundPermissionRationale: {
          title:
            '{applicationName} uses your location to provide you with relevant recommendations about homes near you, and notifications for price changes in homes near you, including when the app is in the background.',
          message:
            'If you will like to receive these recommendations and notifications, choose Allow all the time.',
          positiveAction: '{backgroundPermissionOptionLabel}',
          negativeAction: 'Cancel',
        },
        startOnBoot: false,

        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        stopTimeout: 5,
        batchSync: false,
        autoSync: true,
        locationAuthorizationAlert: true,
        locationUpdateInterval: 5000,
        locationAuthorizationRequest: true,
        reset: false,
        notification: {
          title: 'RentIt is accessing your location in background',
          text: 'We will use this to search for homes and monitor change in home prices to provide you discounts.',
        },
        debug: false,
      },
      state => {
        if (!state.enabled) {
          BackgroundGeolocation.start(() => {
            console.log(' - Start success');
          });
        }
      },
    );

    BackgroundGeolocation.start({
      foregroundService: true,
      BackgroundFetch: true,
      notificationTitle: null,
      notificationText: null,
      enableHeadless: true,
      stopOnTerminate: false,
      startOnBoot: true,
      disableMotionActivityUpdates: true,
      backgroundPermissionRationale: {
        title:
          '{applicationName} uses your location to provide you with relevant recommendations about homes near you, and notifications for price changes in homes near you, including when the app is in the background.',
        message:
          'If you will like to receive these recommendations and notifications, choose Allow all the time.',
        positiveAction: '{backgroundPermissionOptionLabel}',
        negativeAction: 'Cancel',
      },
    });

    addEvent('Current state', state);

    BackgroundGeolocation.setConfig({
      notification: {
        title: 'RentIt is accessing your location in background',
        text: 'We will use this to search for homes and monitor change in home prices to provide you discounts.',
      },
    });

    subscribe(
      BackgroundGeolocation.watchPosition(
        position => position,
        error => console.log(error),
        {
          interval: 1000,
        },
      ),
    );
    setTimeout(() => {
      navigation.navigate('Notifications');
    }, 4000);
  };
  const initBackgroundFetch = async () => {
    await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: true,
      },
      taskId => {
        console.log('[BackgroundFetch] ', taskId);
        BackgroundFetch.finish(taskId);
      },
      taskId => {
        console.log('[BackgroundFetch] TIMEOUT: ', taskId);
        BackgroundFetch.finish(taskId);
      },
    );
  };

  useEffect(() => {
    // getLocation();
    if (Platform.OS === 'ios') {
      BackgroundGeolocation.start();
      setTimeout(() => {
        navigation.navigate('Notifications');
      }, 10000);
    } else {
      BackgroundGeolocation.start();
      initBackgroundFetch();
      initBackgroundGeolocation();
      setTimeout(() => {
        navigation.navigate('Notifications');
      }, 10000);
    }
    if (allow) {
      navigation.navigate('Notifications');
    }

    return () => {
      unsubscribe();
    };
  }, [allow]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <Image
          source={require('../../../assets/data/images/locationPin.png')}
          style={{width: 300, height: 380}}
        />
        <View style={{paddingHorizontal: 15}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text style={{fontSize: 18, fontWeight: '800'}}>
              Enable Geolocation
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              marginTop: 20,
            }}>
            Rentit uses your location to provide you with relevant
            recommendations about homes near you, and notifications for price
            changes in homes near you, including when the app is in the
            background.
          </Text>
          <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setAllow(true);
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'blue',
                width: '90%',
                height: '23%',
                backgroundColor: 'blue',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Montserrat-Bold',
                  color: 'white',
                }}>
                Allow
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 0,
                width: '30%',
                height: '20%',
                marginTop: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Montserrat-Bold',
                  color: 'blue',
                }}>
                Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default LocationPermissions;
