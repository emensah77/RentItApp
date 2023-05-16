import React, {useState, useEffect, useContext, useMemo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-community/google-signin';

import mixpanel from '../MixpanelConfig';
import {AuthContext} from './AuthProvider';

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

const onNavigationStateChange = user => state => {
  const currentRoute = state.routes[state.index];
  const screenName = currentRoute.name;

  mixpanel.track('Screen Viewed', {
    screenName,
    userId: user ? user.uid : 'guest',
  });
};

const AuthStack = () => {
  const {user} = useContext(AuthContext);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  const noHeader = useMemo(
    () => ({
      headerShown: false,
      lazy: true,
    }),
    [],
  );

  let routeName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        // No need to wait for `setItem` to finish, although you might want to handle errors
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    }); // Add some error handling, also you can simply do setIsFirstLaunch(null)

    GoogleSignin.configure({
      webClientId: '953170635360-od4bkrcumj7vevf695hh0sa2ecpossbp.apps.googleusercontent.com',
    });
  }, []);

  if (isFirstLaunch === null) {
    // This is the 'tricky' part: The query to AsyncStorage is not finished,
    // but we have to present something to the user. Null will just render
    // nothing, so you can also put a placeholder of some sort, but
    // effectively the interval between the first mount and AsyncStorage
    // retrieving your data won't be noticeable to the user. But if you
    // want to display anything then you can use a LOADER here
    return <PageSpinner />;
  }

  if (isFirstLaunch === true) {
    routeName = 'Onboarding';
  } else {
    routeName = 'Email';
  }

  return (
    <Stack.Navigator initialRouteName={routeName} onStateChange={onNavigationStateChange(user)}>
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
