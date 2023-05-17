import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

import mixpanel from '../MixpanelConfig';

import Onboarding from '../screens/Onboarding';
import Email from '../screens/Authentication/Email';
import PhoneNumber from '../screens/Authentication/PhoneNumber';
import OTP from '../screens/Authentication/OTP';
import Password from '../screens/Authentication/Password';
import Finish from '../screens/Authentication/Finish';
import Agreement from '../screens/Authentication/Agreement';
import Notification from '../screens/Authentication/Notification';
import {PageSpinner} from '../components';

const Stack = createStackNavigator();

// AsyncStorage.removeItem('authentication::data');
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
      userId: user ? user.uid : 'guest',
    });
  }, []);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('authentication::data');
      if (data === null) {
        await AsyncStorage.setItem('authentication::data', '{}');
      }

      let _initialRouteName = 'Onboarding';

      if (!data?.notification) {
        _initialRouteName = 'Notification';
      }

      if (!data?.firstname || !data?.lastname || !data?.birthDay || !data?.agreement) {
        _initialRouteName = 'Finish';
      }

      if (!data?.phoneNumber) {
        _initialRouteName = 'PhoneNumber';
      }

      if (!data?.email) {
        _initialRouteName = 'Email';
      }

      setInitialRouteName(_initialRouteName);
    })();

    GoogleSignin.configure({
      webClientId: '953170635360-od4bkrcumj7vevf695hh0sa2ecpossbp.apps.googleusercontent.com',
    });
  }, []);

  if (initialRouteName === '') {
    return <PageSpinner />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRouteName} onStateChange={onNavigationStateChange}>
      <Stack.Screen name="Onboarding" component={Onboarding} options={noHeader} />

      <Stack.Screen name="Email" component={Email} options={noHeader} />

      <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={noHeader} />

      <Stack.Screen name="OTP" component={OTP} options={noHeader} />

      <Stack.Screen name="Password" component={Password} options={noHeader} />

      <Stack.Screen name="Finish" component={Finish} options={noHeader} />

      <Stack.Screen name="Agreement" component={Agreement} options={noHeader} />

      <Stack.Screen name="Notification" component={Notification} options={noHeader} />
    </Stack.Navigator>
  );
};

export default AuthStack;
