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
      name="MarketerDashboard"
      component={MarketerDashboard}
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
