/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useRoute} from '@react-navigation/native';
import {SearchResultsScreen} from '@screens/search';

const Tab = createMaterialTopTabNavigator();

const SearchResultsTabNavigator = () => {
  const route = useRoute();
  const {guests, location, dates} = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
        },
      }}
      tabBarOptions={{
        activeTintColor: 'white',
        indicatorStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Tab.Screen
        name="list"
        options={{
          headerTitle: '',
          tabBarLabel: () => null,
        }}>
        {() => <SearchResultsScreen guests={guests} viewport={location} dates={dates} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default SearchResultsTabNavigator;
