import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faSearch,
  faHeart,
  faChartLine,
  faHouseUser,
  faUser,
  faCoins,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import ExploreNavigator from './ExploreNavigator';
import ProfileScreen from '../screens/Profile/Menu';
import LowPriceScreen from '../screens/LowPriceScreen';
import Wishlists from '../screens/Wishlists';
import Trending from '../screens/TrendingScreen';
import House from '../screens/House';
import AppNotifications from '../screens/AppNotifications/AppNotifications';

const Tab = createBottomTabNavigator();

const exploreOptions = ({route}) => ({
  tabBarIcon: ({color}) => <FontAwesomeIcon icon={faSearch} size={25} color={color} />,
  tabBarVisible: (r => {
    const routes = [
      'HouseUpload',
      'OnboardingScreen1',
      'OnboardingScreen2',
      'OnboardingScreen3',
      'OnboardingScreen4',
      'OnboardingScreen5',
      'OnboardingScreen6',
      'OnboardingScreen7',
      'OnboardingScreen8',
      'OnboardingScreen9',
      'OnboardingScreen10',
      'OnboardingScreen11',
      'OnboardingScreen12',
      'OnboardingScreen13',
      'OnboardingScreen14',
      'OnboardingScreen15',
      'OnboardingScreen16',
    ];
    const routeName = getFocusedRouteNameFromRoute(r) ?? '';

    if (routes.includes(routeName)) {
      return false;
    }

    return true;
  })(route),
});

const alertStyle = () => ({
  borderWidth: 1,
  borderColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  width: 15,
  height: 15,
  backgroundColor: 'deeppink',
  top: -3,
  right: -3,
  borderRadius: 10,
});

const alertOptions = () => ({
  tabBarIcon: ({color}) => (
    <View>
      <FontAwesomeIcon icon={faBell} size={25} color={color} />
      <View style={alertStyle} />
    </View>
  ),
});

const tabBarOptions = () => ({
  activeTintColor: 'blue',
});

const screenOptions = () => ({
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTintColor: '#00000',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
});

const options = icon => ({
  tabBarIcon: ({color}) => <FontAwesomeIcon icon={icon} size={25} color={color} />,
});

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}>
      <Tab.Screen name="Explore" component={ExploreNavigator} options={exploreOptions} />

      <Tab.Screen name="House" component={House} options={options(faHouseUser)} />

      <Tab.Screen name="Discount" component={LowPriceScreen} options={options(faCoins)} />

      <Tab.Screen name="Wishlists" component={Wishlists} options={options(faHeart)} />

      <Tab.Screen name="Trending" component={Trending} options={options(faChartLine)} />

      <Tab.Screen name="Alerts" component={AppNotifications} options={alertOptions} />

      <Tab.Screen name="Profile" component={ProfileScreen} options={options(faUser)} />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
