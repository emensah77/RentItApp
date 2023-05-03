import React, {useState, useEffect, useContext, useMemo, useCallback} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-community/google-signin';

import SignupScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/Onboarding';
import LocationPermissions from '../screens/LocationPermissions';
import Notifications from '../screens/Notifications';
import mixpanel from '../MixpanelConfig';
import {AuthContext} from './AuthProvider';

const Stack = createStackNavigator();

const onNavigationStateChange = user => state => {
  const currentRoute = state.routes[state.index];
  const currentScreen = currentRoute.name;

  mixpanel.track('Screen Viewed', {
    screenName: currentScreen,
    userId: user ? user.uid : 'guest',
  });
};

const headerLeft = {marginLeft: 10};

const AuthStack = () => {
  const {user} = useContext(AuthContext);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  const header = useMemo(() => ({header: () => null}), []);

  const noHeader = useMemo(
    () => ({
      headerShown: false,
    }),
    [],
  );

  const goToLogin = useCallback(nav => () => nav.navigate('Login'), []);

  const options = useCallback(
    ({navigation}) => ({
      title: '',
      headerStyle: {
        backgroundColor: '#f9fafd',
        shadowColor: '#f9fafd',
        elevation: 0,
      },
      headerLeft: () => (
        <View style={headerLeft}>
          <FontAwesome.Button
            name="long-arrow-left"
            size={25}
            backgroundColor="#f9fafd"
            color="#333"
            onPress={goToLogin(navigation)}
          />
        </View>
      ),
    }),
    [goToLogin],
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
    return null;
  }
  if (isFirstLaunch) {
    routeName = 'Onboarding';
  } else {
    routeName = 'Login';
  }

  return (
    <Stack.Navigator
      initialRouteName={routeName}
      screenOptions={{
        header: () => null,
      }}
      onStateChange={state => onNavigationStateChange(state)}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={header} />

      <Stack.Screen name="LocationPermissions" component={LocationPermissions} options={noHeader} />

      <Stack.Screen name="Notifications" component={Notifications} options={noHeader} />

      <Stack.Screen name="Signup" component={SignupScreen} options={options} />
    </Stack.Navigator>
  );
};

export default AuthStack;
