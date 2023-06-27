import React from 'react';
import {View, Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useRoute} from '@react-navigation/native';
import SearchResults from '../screensV2/SearchResults';
import SearchResultsMaps from '../screens/SearchResultsMap';

const Tab = createMaterialTopTabNavigator();

const SearchResultsTabNavigator = props => {
  const route = useRoute();
  const {guests, dates, location} = route.params;

  return (
    <Tab.Navigator
      tabBar={() => <></>}
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0, // Add this line to remove the border
        },
      }}
      tabBarOptions={{
        display: 'none',
        activeTintColor: 'white',
        indicatorStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      <Tab.Screen
        name="list"
        options={{
          headerShown: false,
          lazy: true,
        }}
      >
        {() => <SearchResults guests={guests} dates={dates} location={location} />}
      </Tab.Screen>
      {/* <Tab.Screen */}
      {/*  name="list" */}
      {/*  options={{ */}
      {/*    headerTitle: '', // Set this to an empty string or null */}
      {/*    tabBarLabel: () => null, */}
      {/*  }}> */}
      {/*  {() => <SearchResults guests={guests} viewport={viewport} />} */}
      {/* </Tab.Screen> */}

      {/* <Tab.Screen
                name={"map"}
                >
                    {() => (
                        <SearchResultsMaps guests={guests} viewport={viewport} />
                    )}

                    </Tab.Screen> */}
    </Tab.Navigator>
  );
};

export default SearchResultsTabNavigator;
