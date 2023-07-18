/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {View} from 'react-native';
import {Icon} from '@components/Icon';
import {colors} from '@theme';
import ExploreNavigator from './ExploreNavigator';
import ProfileScreen from '../screens/Profile';
import Wishlists from '../screens/Wishlists';
import House from '../screens/House';
import AppNotifications from '../screens/AppNotifications/AppNotifications';

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
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
  ];
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'blue',
      }}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#00000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen
        name="Explore"
        component={ExploreNavigator}
        // eslint-disable-next-line react/jsx-no-bind
        options={({route}) => ({
          tabBarIcon: ({color}) => <Icon icon="search" size={22} color={color} />,
          tabBarVisible: (route => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';

      <Tab.Screen
        name="Wishlists"
        component={Wishlists}
        options={{
          tabBarIcon: ({color}) => (
            <View>
              <Icon icon="heart" size={22} color={color} />
              <View
                style={{
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
                }}>
                {/* <Text style={{color:'white', fontSize:12, fontWeight:'bold'}}>
                        3
                    </Text> */}
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Homes"
        component={House}
        options={{
          tabBarIcon: ({color}) => <Icon icon="home" size={22} color={color} />,
        }}
      />

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
      <Tab.Screen
        name="Inbox"
        component={AppNotifications}
        options={{
          tabBarIcon: ({color}) => <Icon icon="inbox" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => <Icon icon="user" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
