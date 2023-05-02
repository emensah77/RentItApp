import React, {useMemo, useContext, lazy, Suspense} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {AuthContext} from './AuthProvider';
import mixpanel from '../MixpanelConfig';

import PageSpinner from '../components/PageSpinner';

const DestinationSearchScreen = lazy(() => import('../screens/DestinationSearch'));
const GuestsScreen = lazy(() => import('../screens/GuestsScreen'));
const PostScreen = lazy(() => import('../screens/PostScreen'));
const HouseTypeScreen = lazy(() => import('../screens/HouseTypeScreen'));
const WelcomeScreen = lazy(() => import('../screens/WelcomeScreen'));
const EFeedback = lazy(() => import('../screens/Feedback'));
const Review = lazy(() => import('../screens/Reviews'));
const HomeTabNavigator = lazy(() => import('./HomeTabNavigator'));

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
    }),
    [],
  );

  return (
    <Suspense fallback={<PageSpinner />}>
      <Stack.Navigator onStateChange={onNavigationStateChange(user)}>
        <Stack.Screen name="Home" component={HomeTabNavigator} options={noHeader} />

        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={noHeader} />

        <Stack.Screen
          name="Destination Search"
          component={DestinationSearchScreen}
          options={{
            title: 'Search your destination',
            headerShown: false,
          }}
        />

        <Stack.Screen name="Number of Guests" component={GuestsScreen} options={noHeader} />
        <Stack.Screen name="House Type" component={HouseTypeScreen} options={noHeader} />

        <Stack.Screen name="Post" component={PostScreen} options={noHeader} />

        <Stack.Screen name="Reviews" component={Review} options={noHeader} />

        <Stack.Screen name="Feedback" component={EFeedback} options={noHeader} />
      </Stack.Navigator>
    </Suspense>
  );
};

export default AppStack;
