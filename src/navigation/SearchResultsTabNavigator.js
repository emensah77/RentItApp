import React from 'react'
import {View, Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SearchResults from '../screens/SearchResults';
import SearchResultsMaps from '../screens/SearchResultsMap';

const Tab = createMaterialTopTabNavigator();

const SearchResultsTabNavigator = (props) => {
    return (
        <Tab.Navigator tabBarOptions={{
                activeTintColor: 'cyan',
                indicatorStyle: {
                    backgroundColor: 'cyan'
                }
        }}>
            <Tab.Screen 
                name={"list"}
                component={SearchResults} />

            <Tab.Screen 
                name={"map"}
                component={SearchResultsMaps} />
        </Tab.Navigator>
    );
};

export default SearchResultsTabNavigator;