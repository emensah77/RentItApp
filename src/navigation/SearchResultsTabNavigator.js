import React from 'react'
import {View, Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SearchResults from '../screens/SearchResults';
import SearchResultsMaps from '../screens/SearchResultsMap';
import {useRoute} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const SearchResultsTabNavigator = (props) => {
    
    const route = useRoute();
    const {guests, viewport } = route.params; 
    
    return (
        
        <Tab.Navigator 
            screenOptions={{
                tabBarStyle: {
                    borderTopWidth: 0, // Add this line to remove the border
                  },
            }}
        
            tabBarOptions={{
                activeTintColor: 'white',
                indicatorStyle: {
                    backgroundColor: 'white'
                }
                
        }}>
            
            <Tab.Screen 
                name={"list"}
                options={{
                    headerTitle: '', // Set this to an empty string or null
                    tabBarLabel: () => null,                    

                  }}
               > 
               {() => (
                   <SearchResults guests={guests} viewport={viewport}/>
               )}
                    
               </Tab.Screen>

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