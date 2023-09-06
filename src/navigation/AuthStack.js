import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

import mixpanel from '../MixpanelConfig';

import Welcome from '../screens/Authentication/Welcome';
import Email from '../screens/Authentication/Email';
import PhoneNumber from '../screens/Authentication/PhoneNumber';
import OTP from '../screens/Authentication/OTP';
import Password from '../screens/Authentication/Password';
import Finish from '../screens/Authentication/Finish';
import Agreement from '../screens/Authentication/Agreement';
import Notification from '../screens/Authentication/Notification';
import Location from '../screens/Authentication/Location';

import {PageSpinner} from '../components';

const Stack = createStackNavigator();

// AsyncStorage.removeItem('authentication::data');
// auth().signOut();
// Test: UWHvpJ1XoObsFYTFR48zYe6jscJ2
const date = new Date();

const AuthStack = () => {
  const [initialRouteName, setInitialRouteName] = useState('');

  const noHeader = useMemo(
    () => ({
      headerShown: false,
      lazy: true,
    }),
    [],
  );

  const onNavigationStateChange = useCallback(state => {
    const currentRoute = state.routes[state.index];
    const screenName = currentRoute.name;
    const user = auth().currentUser;
    mixpanel.track('Screen Viewed', {
      screenName,
      userId: user ? user?.uid : 'guest',
    });
  }, []);

  useEffect(() => {
    let loaded = false;

    const id = setInterval(() => {
      console.debug(
        'Waiting for AsyncStorage',
        loaded,
        `${new Date().getTime() - date.getTime()}ms`,
      );

      if (loaded) {
        clearInterval(id);
      }
    }, 2000);

    (async () => {
      const data = await AsyncStorage.getItem('authentication::data');
      console.debug('Auth Data', data);

      loaded = true;

      let _initialRouteName;

      if (!data?.notification) {
        _initialRouteName = 'Notification';
      }

      if (!data?.location) {
        _initialRouteName = 'Location';
      }

      if (!data?.agreement) {
        _initialRouteName = 'Agreement';
      }

      if (!data?.firstname || !data?.lastname || !data?.birthDay) {
        _initialRouteName = 'Finish';
      }

      if (!data?.phoneNumber) {
        _initialRouteName = 'PhoneNumber';
      }

      if (!data?.email) {
        _initialRouteName = 'Email';
      }

      if (!data) {
        await AsyncStorage.setItem('authentication::data', '{}');
        _initialRouteName = 'Welcome';
      }

      setInitialRouteName(_initialRouteName);
    })();
  }, []);

  if (initialRouteName === '') {
    return <PageSpinner />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRouteName} onStateChange={onNavigationStateChange}>
      <Stack.Screen name="Welcome" component={Welcome} options={noHeader} />

      <Stack.Screen name="Email" component={Email} options={noHeader} />

      <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={noHeader} />

      <Stack.Screen name="OTP" component={OTP} options={noHeader} />

      <Stack.Screen name="Password" component={Password} options={noHeader} />

      <Stack.Screen name="Finish" component={Finish} options={noHeader} />

      <Stack.Screen name="Agreement" component={Agreement} options={noHeader} />

      <Stack.Screen name="Notification" component={Notification} options={noHeader} />

      <Stack.Screen name="Location" component={Location} options={noHeader} />
    </Stack.Navigator>
  );
};

export default AuthStack;
