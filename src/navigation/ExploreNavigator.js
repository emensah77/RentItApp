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
import {SearchHome, SearchResultsScreen} from '@screens/search';

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

    <Stack.Screen
      name="OnboardingScreen7"
      component={OnboardingScreen7}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="OnboardingScreen8"
      component={OnboardingScreen8}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="OnboardingScreen9"
      component={OnboardingScreen9}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="OnboardingScreen10"
      component={OnboardingScreen10}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="OnboardingScreen11"
      component={OnboardingScreen11}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="OnboardingScreen12"
      component={OnboardingScreen12}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="OnboardingScreen13"
      component={OnboardingScreen13}
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
