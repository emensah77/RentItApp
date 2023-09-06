import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SearchHome, SearchResultsScreen} from '@screens/search';
import HomeScreen from '../screens/Home';
import AddressScreen from '../screens/AddressScreen';
import Pay from '../screens/Profile/Payments/Pay';
import House from '../screens/House';
import HouseDetailScreen from '../screens/HouseDetailScreen';
import MyHomes from '../screens/MyHomes';
import EditHome from '../screens/EditHome';
import MarketerDashboard from '../screens/Profile/MarketerDashboard';

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

const ExplorerNavigator = () => (
  <Stack.Navigator initialRouteName="MarketerDashboard" screenOptions={screenOptions}>
    <Stack.Screen name="Welcome" component={HomeScreen} options={noHeaderShown} />

    <Stack.Screen
      name="Address"
      component={AddressScreen}
      options={headerShown('Confirm and Pay')}
    />
    <Stack.Screen name="Payment" component={Pay} options={headerShown('Confirm and Pay')} />

    <Stack.Screen name="House" component={House} options={noHeaderShown} />

    <Stack.Screen name="HouseDetails" component={HouseDetailScreen} options={noHeaderShown} />

    <Stack.Screen name="MarketerDashboard" component={MarketerDashboard} options={noHeaderShown} />

    <Stack.Screen name="MyHomes" component={MyHomes} options={noHeaderShown} />

    <Stack.Screen name="EditHome" component={EditHome} options={noHeaderShown} />

    <Stack.Screen name="SearchHome" component={SearchHome} options={noHeaderShown} />

    <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={headerShown('')} />
  </Stack.Navigator>
);

export default ExplorerNavigator;
