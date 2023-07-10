import React, {useCallback, useMemo} from 'react';
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
import {View} from 'react-native';
import ExploreNavigator from './ExploreNavigator';
import ProfileScreen from '../screens/Profile/Menu';
import LowPriceScreen from '../screens/LowPriceScreen';
import Wishlists from '../screens/Wishlists';
import Trending from '../screens/TrendingScreen';
import House from '../screens/House';
import AppNotifications from '../screens/AppNotifications/AppNotifications';

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  const routes = useMemo(
    () => [
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
    ],
    [],
  );

  const exploreOptions = useCallback(
    ({route}) => ({
      tabBarIcon: ({color}) => <FontAwesomeIcon icon={faSearch} size={25} color={color} />,
      tabBarVisible: (r => {
        const routeName = getFocusedRouteNameFromRoute(r) ?? '';

        if (routes.includes(routeName)) {
          return false;
        }

        return true;
      })(route),
    }),
    [routes],
  );

  const alertStyle = useMemo(
    () => ({
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
    }),
    [],
  );

  const alertOptions = useMemo(
    () => ({
      tabBarIcon: ({color}) => (
        <View>
          <FontAwesomeIcon icon={faBell} size={25} color={color} />
          <View style={alertStyle}>
            {/* <Text style={{color:'white', fontSize:12, fontWeight:'bold'}}>
                          3
                      </Text> */}
          </View>
        </View>
      ),
    }),
    [alertStyle],
  );

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
      <Tab.Screen name="Explore" component={ExploreNavigator} options={exploreOptions} />

      <Tab.Screen
        name="House"
        component={House}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faHouseUser} size={25} color={color} />,
        }}
      />

      <Tab.Screen
        name="Discount"
        component={LowPriceScreen}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesomeIcon icon={faCoins} size={25} color={color} />
            // <Fontisto name="user" size={25} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Wishlists"
        component={Wishlists}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faHeart} size={25} color={color} />,
        }}
      />

      <Tab.Screen
        name="Trending"
        component={Trending}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faChartLine} size={25} color={color} />,
        }}
      />

      <Tab.Screen name="Alerts" component={AppNotifications} options={alertOptions} />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faUser} size={25} color={color} />,
        }}
      />

      {/*
      <Tab.Screen
        name="Messages"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => <Feather name="message-square" size={25} color={color} />,
        }}
      />
      */}
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
