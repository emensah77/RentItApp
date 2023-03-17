import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/Onboarding';
import HomeTabNavigator from "./HomeTabNavigator"
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-community/google-signin';
import LocationPermissions from '../screens/LocationPermissions';
import Notifications from '../screens/Notifications';
import mixpanel from '../../src/MixpanelConfig';
import useDwellTimeTracking from '../../src/hooks/useDwellTimeTracking';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../navigation/AuthProvider';

const Stack = createStackNavigator();

const onNavigationStateChange = (state) => {
  const currentRoute = state.routes[state.index];
  const currentScreen = currentRoute.name;

  const { user } = useContext(AuthContext);

  mixpanel.track('Screen Viewed', {
    screenName: currentScreen,
    userId: user ? user.uid : 'guest',
  });
};


const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  
  
  let routeName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
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
    return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
  } else if (isFirstLaunch == true) {
    routeName = 'Onboarding';
  } else {
    routeName = 'Login';
  }




  return (
    <Stack.Navigator 
    initialRouteName={routeName}
    onStateChange={(state) =>
      onNavigationStateChange(state)
    }
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name={'LocationPermissions'}
        component={LocationPermissions}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Notifications'}
        component={Notifications}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={({ navigation }) => ({
          title: '',
          headerStyle: {
            backgroundColor: '#f9fafd',
            shadowColor: '#f9fafd',
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <FontAwesome.Button
                name="long-arrow-left"
                size={25}
                backgroundColor="#f9fafd"
                color="#333"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;