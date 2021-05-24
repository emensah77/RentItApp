import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import DestinationSearchScreen from "../screens/DestinationSearch";
import GuestsScreen from "../screens/GuestsScreen";
import HomeTabNavigator from "./HomeTabNavigator";
import PostScreen from '../screens/PostScreen';

const Stack = createStackNavigator();



const Router = (props) => {
    return (
        <NavigationContainer>

            <Stack.Navigator>
                <Stack.Screen 
                name={"Home"}
                component={HomeTabNavigator} 
                options={{
                    headerShown: false,
                }}
                    />
            




            
                <Stack.Screen 
                name={"Destination Search"}
                component={DestinationSearchScreen}
                options={{
                    title:"Search your destination"
                }} 
                
                />
            


            <Stack.Screen 
                name={"Number of Guests"}
                component={GuestsScreen} 
                
                />

            <Stack.Screen 
                name={"Post"}
                component={PostScreen} 
                
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Router;