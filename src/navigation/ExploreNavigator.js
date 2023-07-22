import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/Home';
import SearchResultsTabNavigator from './SearchResultsTabNavigator';
import AboutScreen from '../screens/AboutScreen';
import AddressScreen from '../screens/AddressScreen';
import PaymentScreen from '../screens/PaymentScreen';
import House from '../screens/House';
import HouseDetailScreen from '../screens/HouseDetailScreen';
import HouseUploadScreen from '../screens/HouseUploadScreen';
import AccountManageScreen from '../screens/AccountManageScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ManageProfile from '../screens/ManageProfile';
import Marketer from '../screens/Marketer';
import MyHomes from '../screens/MyHomes';
import EditHome from '../screens/EditHome';
import HeatMapScreen from '../screens/HeatMapScreen';
import MarketerDashboard from '../screens/MarketerDashboard';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTintColor: '#000000',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const noHeaderShown = {
  headerShown: false,
};

const headerShown = title => ({
  headerShown: false,
  title,
});

const Router = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Welcome" component={HomeScreen} options={noHeaderShown} />

    <Stack.Screen name="About" component={AboutScreen} options={noHeaderShown} />

    <Stack.Screen
      name="Address"
      component={AddressScreen}
      options={headerShown('Confirm and Pay')}
    />

    <Stack.Screen
      name="Payment"
      component={PaymentScreen}
      options={headerShown('Confirm and Pay')}
    />

    <Stack.Screen name="Checkout" component={CheckoutScreen} options={headerShown('Checkout')} />

    <Stack.Screen name="House" component={House} options={noHeaderShown} />

    <Stack.Screen name="HouseDetails" component={HouseDetailScreen} options={noHeaderShown} />

    <Stack.Screen name="HouseUpload" component={HouseUploadScreen} options={noHeaderShown} />

    <Stack.Screen name="AccountManage" component={AccountManageScreen} options={noHeaderShown} />

    <Stack.Screen name="ManageProfile" component={ManageProfile} options={noHeaderShown} />

    <Stack.Screen name="HeatMap" component={HeatMapScreen} options={noHeaderShown} />

    <Stack.Screen name="MarketerDashboard" component={MarketerDashboard} options={noHeaderShown} />

    <Stack.Screen name="Dashboard" component={DashboardScreen} options={noHeaderShown} />

    <Stack.Screen name="Marketer" component={Marketer} options={noHeaderShown} />

    <Stack.Screen name="MyHomes" component={MyHomes} options={noHeaderShown} />

    <Stack.Screen name="EditHome" component={EditHome} options={noHeaderShown} />

    <Stack.Screen
      name="SearchResults"
      component={SearchResultsTabNavigator}
      options={noHeaderShown}
    />
  </Stack.Navigator>
);
export default Router;
