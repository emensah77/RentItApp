import React, {useMemo, useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {AuthContext} from './AuthProvider';
import mixpanel from '../MixpanelConfig';

import DestinationSearchScreen from '../screens/DestinationSearch';
import GuestsScreen from '../screens/GuestsScreen';
import PostScreen from '../screensV2/PostScreen';
import HouseTypeScreen from '../screens/HouseTypeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import EFeedback from '../screens/Feedback';
import Review from '../screens/Reviews';
import HomeTabNavigator from './HomeTabNavigator';
import CancelationPolicy from '../screensV2/CancelationPolicy';
import HealthSafety from '../screensV2/HealthSafety';
import HouseRules from '../screensV2/HouseRules';
import Amenities from '../screensV2/Amenities';
import Reviews from '../screensV2/Reviews';

const Stack = createStackNavigator();

const onNavigationStateChange = user => state => {
  const currentRoute = state.routes[state.index];
  const currentScreen = currentRoute.name;

  mixpanel.track('Screen Viewed', {
    screenName: currentScreen,
    userId: user ? user.uid : 'guest',
  });
};

const AppStack = () => {
  const {user} = useContext(AuthContext);

  const noHeader = useMemo(
    () => ({
      headerShown: false,
      lazy: true,
    }),
    [],
  );

  const noHeaderWithATitle = useMemo(
    () => ({
      title: 'Search your destination',
      headerShown: false,
      lazy: true,
    }),
    [],
  );

  return (
    <Stack.Navigator onStateChange={onNavigationStateChange(user)}>
      <Stack.Screen name="Home" component={HomeTabNavigator} options={noHeader} />

      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={noHeader} />

      <Stack.Screen
        name="Destination Search"
        component={DestinationSearchScreen}
        options={noHeaderWithATitle}
      />

      <Stack.Screen name="Number of Guests" component={GuestsScreen} options={noHeader} />

      <Stack.Screen name="House Type" component={HouseTypeScreen} options={noHeader} />

      <Stack.Screen name="Post" component={PostScreen} options={noHeader} />

      <Stack.Screen name="Reviews" component={Review} options={noHeader} />

      <Stack.Screen name="Feedback" component={EFeedback} options={noHeader} />
      <Stack.Screen name="Policy" component={CancelationPolicy} options={noHeader} />
      <Stack.Screen name="Health" component={HealthSafety} options={noHeader} />
      <Stack.Screen name="Rules" component={HouseRules} options={noHeader} />
      <Stack.Screen name="Amenities" component={Amenities} options={noHeader} />
      <Stack.Screen name="ReviewsMore" component={Reviews} options={noHeader} />
    </Stack.Navigator>
  );
};

export default AppStack;
