import React, {useMemo, useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import mixpanel from '../MixpanelConfig';

import DestinationSearchScreen from '../screens/DestinationSearch';
import GuestsScreen from '../screens/GuestsScreen';
import PostScreen from '../screensV2/PostScreen';
import HomeScreen from '../screensV2/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import EFeedback from '../screens/Feedback';
import Review from '../screens/Reviews';
import HomeTabNavigator from './HomeTabNavigator';
import CancelationPolicy from '../screensV2/CancelationPolicy';
import HealthSafety from '../screensV2/HealthSafety';
import HouseRules from '../screensV2/HouseRules';
import Amenities from '../screensV2/Amenities';
import Reviews from '../screensV2/Reviews';
import WishtListItem from '../screensV2/WishListItem';
import SelectReason from '../screensV2/SelectReason';
import ConfirmCancellation from '../screensV2/ConfirmCancellation';
import RefundPage from '../screensV2/RefundPage';
import ListingSteps from '../screensV2/ListingSteps';

const Stack = createStackNavigator();

const AppStack = () => {
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

  const onNavigationStateChange = useCallback(state => {
    const currentRoute = state.routes[state.index];
    const screenName = currentRoute.name;
    const user = auth().currentUser;
    mixpanel.track('Screen Viewed', {
      screenName,
      userId: user ? user.uid : 'guest',
    });
  }, []);

  return (
    <Stack.Navigator onStateChange={onNavigationStateChange}>
      <Stack.Screen name="Home" component={HomeTabNavigator} options={noHeader} />

      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={noHeader} />

      <Stack.Screen
        name="Destination Search"
        component={DestinationSearchScreen}
        options={noHeaderWithATitle}
      />

      <Stack.Screen name="Number of Guests" component={GuestsScreen} options={noHeader} />

      {/* <Stack.Screen name="House Type" component={HouseTypeScreen} options={noHeader} /> */}

      <Stack.Screen name="Post" component={PostScreen} options={noHeader} />

      <Stack.Screen name="Reviews" component={Review} options={noHeader} />

      <Stack.Screen name="Feedback" component={EFeedback} options={noHeader} />
      <Stack.Screen name="Policy" component={CancelationPolicy} options={noHeader} />
      <Stack.Screen name="Health" component={HealthSafety} options={noHeader} />
      <Stack.Screen name="Rules" component={HouseRules} options={noHeader} />
      <Stack.Screen name="Amenities" component={Amenities} options={noHeader} />
      <Stack.Screen name="ReviewsMore" component={Reviews} options={noHeader} />
      <Stack.Screen name="Homes" component={HomeScreen} options={noHeader} />
      <Stack.Screen name="WishListItem" component={WishtListItem} options={noHeader} />
      <Stack.Screen name="Reason" component={SelectReason} options={noHeader} />
      <Stack.Screen name="Cancelation" component={ConfirmCancellation} options={noHeader} />
      <Stack.Screen name="Refund" component={RefundPage} options={noHeader} />
      <Stack.Screen name="ListingStep" component={ListingSteps} options={noHeader} />
    </Stack.Navigator>
  );
};

export default AppStack;
