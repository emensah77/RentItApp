import React, {useCallback, useState, useEffect} from 'react';
import {Image, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGeolocation from 'react-native-background-geolocation';

import {Page, Button, Typography, Whitespace, PageSpinner} from '../../components';
import {global} from '../../assets/styles';
import locationPermission from '../../assets/images/location-permission.png';

const Location = props => {
  const {noRender, interval, getPosition} = props;

  const [enabled, setEnabled] = useState(null);
  const [count, setCount] = useState(1);

  const navigation = useNavigation();

  const goToNotifications = useCallback(() => navigation.navigate('Notification'), [navigation]);

  const init = useCallback(async () => {
    return new Promise(resolve => {
      BackgroundGeolocation.ready(
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
        async state => {
          if (!state.enabled) {
            await BackgroundGeolocation.start({
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

            await BackgroundGeolocation.setConfig({
              notification: {
                title: 'RentIt is accessing your location in background',
                text: 'We will use this to search for homes and monitor change in home prices to provide you discounts.',
              },
            });
          }

          if (state.enabled) {
            await BackgroundGeolocation.watchPosition(
              position => {
                AsyncStorage.setItem('position', JSON.stringify(position.coords));
                if (__DEV__ && !getPosition) {
                  console.debug('[watchPosition] -', position);
                }

                if (getPosition && typeof getPosition === 'function') {
                  getPosition(position);
                }
              },
              e => console.error('[watchPosition] ERROR -', e),
              {
                interval: interval || 30000,
                desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
                persist: true,
              },
            );
          }

          resolve(state.enabled);
        },
      );
    });
  }, [getPosition, interval]);

  const request = useCallback(async () => {
    const location = await init();

    setCount(count + 1);
    setEnabled(!!location);
    const data = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    await AsyncStorage.setItem(
      'authentication::data',
      JSON.stringify({...data, location: !!location}),
    );

    if (!location && count > 2) {
      Linking.openSettings();
      return !!location;
    }

    setTimeout(goToNotifications, 1000);
    return !!location;
  }, [count, goToNotifications, init]);

  useEffect(() => {
    (async () => {
      const location = await init();

      if (location && !noRender) {
        return goToNotifications(location);
      }
      setEnabled(!!location);
    })();
  }, [goToNotifications, init, noRender]);

  if (noRender) {
    return null;
  }

  if (enabled === null) {
    return <PageSpinner />;
  }

  return (
    <Page>
      <Image source={locationPermission} style={global.largeIcon} />

      <Typography type="largeHeading">Enable Geolocation?</Typography>

      <Whitespace marginTop={24} />

      <Typography type="heading" width="100%">
        Rentit use your location to provide you with relevant recommendations about homes near you,
        and notifications for price changes in homes near you, including when the app is in the
        background.
      </Typography>

      <Whitespace marginTop={64} />

      <Whitespace marginBottom={-30} />

      <Button type="standard" onPress={request} fitWidth>
        Yes, allow
      </Button>

      <Button type="primary" onPress={goToNotifications} fitWidth>
        Later
      </Button>
    </Page>
  );
};

export default Location;
