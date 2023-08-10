import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SearchHome, SearchResultsScreen} from '@screens/search';
import HomeScreen from '../screens/Home';
// import SearchResultsScreen from '../screens/SearchResults';
import SearchResultsTabNavigator from './SearchResultsTabNavigator';
import AboutScreen from '../screens/AboutScreen';
import AddressScreen from '../screens/AddressScreen';
import Pay from '../screens/Profile/Payments/Pay';
import House from '../screens/House';
import HouseDetailScreen from '../screens/HouseDetailScreen';
import HouseUploadScreen from '../screens/HouseUploadScreen';

import AccountManageScreen from '../screens/AccountManageScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
// import Notifications from '../screens/Notifications';
import ManageProfile from '../screens/ManageProfile';
import Marketer from '../screens/Marketer';
import MyHomes from '../screens/MyHomes';
import EditHome from '../screens/EditHome';
import HeatMapScreen from '../screens/HeatMapScreen';
import MarketerDashboard from '../screens/Profile/MarketerDashboard';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

const Router = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#000000',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <Stack.Screen
      name="Welcome"
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="About"
      component={AboutScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Address"
      component={AddressScreen}
      options={{
        headerShown: true,
        title: 'Confirm and Pay',
      }}
    />
    <Stack.Screen
      name="Payment"
      component={Pay}
      options={{
        headerShown: true,
        title: 'Confirm and Pay',
      }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{
        headerShown: true,
        title: 'Checkout',
      }}
    />
    <Stack.Screen
      name="House"
      component={House}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="HouseDetails"
      component={HouseDetailScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="HouseUpload"
      component={HouseUploadScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="AccountManage"
      component={AccountManageScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ManageProfile"
      component={ManageProfile}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="HeatMap"
      component={HeatMapScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="MarketerDashboard"
      component={MarketerDashboard}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Marketer"
      component={Marketer}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="MyHomes"
      component={MyHomes}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="EditHome"
      component={EditHome}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="SearchHome"
      component={SearchHome}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="SearchResults"
      component={SearchResultsScreen}
      options={{
        headerShown: false,
        title: '',
      }}
    />
  </Stack.Navigator>
);
export default Router;
