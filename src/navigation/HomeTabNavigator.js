/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {View} from 'react-native';
import {Icon} from '@components/Icon';
import {palette} from '@theme/colors';
import ExploreNavigator from './ExploreNavigator';
import ProfileScreen from '../screens/Profile';
import Trending from '../screens/TrendingScreen';
import AppNotifications from '../screens/AppNotifications/AppNotifications';
import WishListNavigation from './WishListNavigator';

const Tab = createBottomTabNavigator();

// eslint-disable-next-line no-unused-vars
const HomeTabNavigator = _props => {
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
    'OnboardingScreen17',
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
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreNavigator}
        options={({route}) => ({
          tabBarIcon: ({color}) => <Icon icon="search" size={22} color={color} />,
          // eslint-disable-next-line no-shadow
          tabBarVisible: (route => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';

            if (routes.includes(routeName)) {
              return false;
            }

            return true;
          })(route),
        })}
      />

      <Tab.Screen
        name="Wishlists"
        component={WishListNavigation}
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
                  backgroundColor: palette.pink,
                  top: -3,
                  right: -10,
                  borderRadius: 10,
                }}
              >
                {/* <Text style={{color:'white', fontSize:12, fontWeight:'bold'}}>
                            3
                        </Text> */}
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Trending}
        options={{
          tabBarIcon: ({color}) => <Icon icon="home" size={22} color={color} />,
        }}
      />
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
