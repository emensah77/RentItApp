import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {View} from 'react-native';

import {Icon} from '@components/Icon';
import {colors} from '@theme';
import ExploreNavigator from './ExploreNavigator';
import ProfileScreen from '../screens/Profile/Menu';
import Wishlists from '../screens/Wishlists';
import House from '../screens/House';
import Inbox from '../screens/Profile/Inbox';

const Tab = createBottomTabNavigator();

const options = icon => ({
  tabBarIcon: ({color}) => <Icon icon={icon} size={22} color={color} />,
});

const wishlistStyle = {
  borderWidth: 1,
  borderColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  width: 10,
  height: 10,
  backgroundColor: colors.palette.pink,
  top: -3,
  right: -10,
  borderRadius: 10,
};

const wishListOptions = {
  tabBarIcon: ({color}) => (
    <View>
      <Icon icon="heart" size={22} color={color} />
      <View style={wishlistStyle}>
        {/* <Text style={{color:'white', fontSize:12, fontWeight:'bold'}}>
                3
            </Text> */}
      </View>
    </View>
  ),
};

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
  'SearchHome',
];

const exploreOptions = ({route}) => ({
  tabBarIcon: ({color}) => <Icon icon="search" size={22} color={color} />,
  tabBarVisible: (_route => {
    const routeName = getFocusedRouteNameFromRoute(_route) ?? '';

    if (routes.includes(routeName)) {
      return false;
    }

    return true;
  })(route),
});

const tabBarOptions = {
  activeTintColor: 'blue',
};

const screenOptions = {
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTintColor: '#00000',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}>
      <Tab.Screen name="Explore" component={ExploreNavigator} options={exploreOptions} />

      <Tab.Screen name="Wishlists" component={Wishlists} options={wishListOptions} />

      <Tab.Screen name="Homes" component={House} options={options('home')} />

      {/* <Tab.Screen
        name="Discount"
        component={LowPriceScreen}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faCoins} size={25} color={color} />,
        }}
      />

      <Tab.Screen
        name="Trending"
        component={Trending}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faChartLine} size={25} color={color} />,
        }}
      /> */}
      <Tab.Screen name="Inbox" component={Inbox} options={options('inbox')} />

      <Tab.Screen name="Profile" component={ProfileScreen} options={options('user')} />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
