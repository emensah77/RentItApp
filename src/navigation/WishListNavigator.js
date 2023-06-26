import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WishList from '../screensV2/WishList';
import WishtListItem from '../screensV2/WishListItem';

const WishListNavigation = () => {
  const Stack = createStackNavigator();
  const SCREENS = [
    {
      name: 'Wishlists',
      component: WishList,
      options: {
        headerShown: false,
      },
    },
    {
      name: 'WishlistItem',
      component: WishtListItem,
      options: {
        headerShown: false,
      },
    },
  ];
  return (
    <Stack.Navigator initialRouteName="Wishlists">
      {SCREENS.map(screen => (
        <Stack.Screen key={screen.name} name={screen.name} options={screen.options} component={screen.component} />
      ))}
    </Stack.Navigator>
  );
};

export default WishListNavigation;
