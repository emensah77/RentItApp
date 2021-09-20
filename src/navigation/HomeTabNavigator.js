import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from '../screens/Home';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ExploreNavigator from './ExploreNavigator';
import SearchResultsMaps from "../screens/SearchResultsMap";
import PostScreen from "../screens/PostScreen";
import ProfileScreen from '../screens/Profile';
import LowPriceScreen from "../screens/LowPriceScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons"
import { faCoffee ,faHeart,faChartLine, faHouseUser ,faUser ,faCoins } from "@fortawesome/free-solid-svg-icons";
import Wishlists from "../screens/Wishlists";
import Trending from "../screens/TrendingScreen";

const Tab = createBottomTabNavigator();

const HomeTabNavigator = (props) => {
    return (
        <Tab.Navigator tabBarOptions={{
            activeTintColor: "blue"
        }}
        screenOptions={{
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTintColor: '#00000',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
            <Tab.Screen
            name={"Explore"}
            component={ExploreNavigator}
            
            options={{
                tabBarIcon: ({color}) => (
                    <FontAwesomeIcon icon={faHouseUser} size={25} color={color} />
                )
            }}
            />

            
            <Tab.Screen
                        name={"Discount"}
                        component={LowPriceScreen}
                        options={{
                            tabBarIcon: ({color}) => (
                                <FontAwesomeIcon icon={faCoins} size={25} color={color}/>
                                //<Fontisto name="user" size={25} color={color} />
                            )
                        }}
                        />

           
            <Tab.Screen
                        name={"Wishlists"}
                        component={Wishlists}
                        options={{
                            tabBarIcon: ({color}) => (
                                <FontAwesomeIcon icon={faHeart} size={25} color={color} />
                            )
                        }}
                        />
            <Tab.Screen
                        name={"Trending"}
                        component={Trending}
                        options={{
                            tabBarIcon: ({color}) => (
                                <FontAwesomeIcon icon={faChartLine} size={25} color={color} />
                            )
                        }}
                        />
            <Tab.Screen
                        name={"Profile"}
                        component={ProfileScreen}
                        options={{
                            tabBarIcon: ({color}) => (
                                <FontAwesomeIcon icon={faUser} size={25} color={color} />
                            )
                        }}
                        />


        {/*
            <Tab.Screen
                        name={"Messages"}
                        component={HomeScreen}
                        options={{
                            tabBarIcon: ({color}) => (
                                <Feather name="message-square" size={25} color={color} />
                            )
                        }}
                        />

                    */}







        </Tab.Navigator>    
    );
};


export default HomeTabNavigator;