import React, {useCallback, useEffect, useState} from 'react';
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
// import BackgroundFetch from 'react-native-background-fetch';

import locationPin from '../../../assets/data/images/locationPin.png';

const LocationPermissions = () => {
  const navigation = useNavigation();
  const [allow, setAllow] = useState(false);

  const subscribe = (/* subscription */) => {};

  const unsubscribe = () => {};

  const addEvent = (/* name, params */) => {};

  const onPress = useCallback(() => {
    setAllow(true);
  }, []);

  const goToNotifications = useCallback(
    () => navigation.navigate('Notifications'),
    [navigation],
  );

  // Configure the BackgroundGeolocation plugin.
  const initBackgroundGeolocation = useCallback(async () => {
    // subscribe(
    //   BackgroundGeolocation.onProviderChange(event => {
    //     console.log('[onProviderChange]', event);
    //     addEvent('onProviderChange', event);
    //   }),
    // );

    // subscribe(
    //   BackgroundGeolocation.onLocation(
    //     location => {
    //       console.log('[onLocation]', location);
    //       addEvent('onLocation', location);
    //     },
    //     error => {
    //       console.error('[onLocation] ERROR: ', error);
    //     },
    //   ),
    // );

    // subscribe(
    //   BackgroundGeolocation.onMotionChange(location => {
    //     console.log('[onMotionChange]', location);
    //     addEvent('onMotionChange', location);
    //   }),
    // );

    // subscribe(
    //   BackgroundGeolocation.onGeofence(event => {
    //     console.log('[onGeofence]', event);
    //     addEvent('onGeofence', event);
    //   }),
    // );

    // subscribe(
    //   BackgroundGeolocation.onConnectivityChange(event => {
    //     console.log('[onConnectivityChange]', event);
    //     addEvent('onConnectivityChange', event);
    //   }),
    // );

    // subscribe(
    //   BackgroundGeolocation.onEnabledChange(enabled => {
    //     console.log('[onEnabledChange]', enabled);
    //     addEvent('onEnabledChange', {enabled});
    //   }),
    // );

    // subscribe(
    //   BackgroundGeolocation.onHttp(event => {
    //     console.log('[onHttp]', event);
    //     addEvent('onHttp', event);
    //   }),
    // );

    // subscribe(
    //   BackgroundGeolocation.onLocation(() => {
    //     // console.log(`Latitude: ${location.coords.latitude}`);
    //     // console.log(`Longitude: ${location.coords.longitude}`);
    //   }),
    // );

    // subscribe(
    //   BackgroundGeolocation.onActivityChange(event => {
    //     console.log('[onActivityChange]', event);
    //     addEvent('onActivityChange', event);
    //   }),
    // );

    // subscribe(
    //   BackgroundGeolocation.onPowerSaveChange(enabled => {
    //     console.log('[onPowerSaveChange]', enabled);
    //     addEvent('onPowerSaveChange', {isPowerSaveMode: enabled});
    //   }),
    // );

    /// Configure the plugin.
    const state = await BackgroundGeolocation.ready(
      {
        logLevel: BackgroundGeolocation.LOG_LEVEL_NONE,
        distanceFilter: 10,
        stopOnTerminate: false,
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
      _state => {
        if (!_state.enabled) {
          BackgroundGeolocation.start(() => {
            // Background Geolocation Started
            console.debug('Success enabled the background geolocation');
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
        error => console.error(error),
        {
          interval: 1000,
        },
      ),
    );

    setTimeout(goToNotifications, 4000);
  }, [goToNotifications]);

  // const initBackgroundFetch = useCallback(async () => {
  //   await BackgroundFetch.configure(
  //     {
  //       minimumFetchInterval: 15,
  //       stopOnTerminate: true,
  //     },
  //     taskId => {
  //       console.log('[BackgroundFetch] ', taskId);
  //       BackgroundFetch.finish(taskId);
  //     },
  //     taskId => {
  //       console.log('[BackgroundFetch] TIMEOUT: ', taskId);
  //       BackgroundFetch.finish(taskId);
  //     },
  //   );
  // }, []);

  useEffect(() => {
    BackgroundGeolocation.start();

    if (Platform.OS === 'ios') {
      setTimeout(goToNotifications, 10000);
    } else {
      // initBackgroundFetch();
      initBackgroundGeolocation();
      setTimeout(goToNotifications, 10000);
    }

    if (allow) {
      goToNotifications();
    }

    return () => {
      unsubscribe();
    };
  }, [
    allow,
    // initBackgroundFetch,
    initBackgroundGeolocation,
    goToNotifications,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.innerContainer}>
        <Image source={locationPin} style={styles.locationPin} />
        <View style={styles.horizontalPadding}>
          <View style={styles.geolocationContainer}>
            <Text style={styles.enableGeoLocation}>Enable Geolocation</Text>
          </View>
          <Text style={styles.locationDescription}>
            Rentit uses your location to provide you with relevant
            recommendations about homes near you, and notifications for price
            changes in homes near you, including when the app is in the
            background.
          </Text>
          <View style={styles.options}>
            <TouchableOpacity onPress={onPress} style={styles.allow}>
              <Text style={styles.allowText}>Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNotifications} style={styles.later}>
              <Text style={styles.laterText}>Later</Text>
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
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  horizontalPadding: {paddingHorizontal: 15},
  locationPin: {width: 300, height: 380},
  geoLocationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  locationDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
  },
  enableGeoLocation: {fontSize: 18, fontWeight: '800'},
  allow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'blue',
    width: '90%',
    height: '23%',
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  options: {justifyContent: 'flex-end', alignItems: 'center'},
  allowText: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
  },
  later: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    width: '30%',
    height: '20%',
    marginTop: 20,
    borderRadius: 10,
  },
  laterText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: 'blue',
  },
});

export default LocationPermissions;
