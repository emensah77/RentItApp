import React from 'react'
import {View, Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SearchResults from '../screens/SearchResults';
import SearchResultsMaps from '../screens/SearchResultsMap';
import {useRoute} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const SearchResultsTabNavigator = (props) => {
    
    const route = useRoute();
    const {guests} = route.params; 
    return (
        <Tab.Navigator tabBarOptions={{
                activeTintColor: 'cyan',
                indicatorStyle: {
                    backgroundColor: 'cyan'
                }
        }}>
            <Tab.Screen 
                name={"list"}
               > 
               {() => (
                   <SearchResults guests={guests}/>
               )}
                    
               </Tab.Screen>

            <Tab.Screen 
                name={"map"}
                >
                    {() => (
                        <SearchResultsMaps guests={guests}/>
                    )}
                    
                    </Tab.Screen>
        </Tab.Navigator>
    );
};

export default SearchResultsTabNavigator;