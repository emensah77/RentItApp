import React from 'react';
import {StatusBar} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import MarketerHome from './MarketerHome';

const noHeader = {
  headerShown: false,
  lazy: true,
};

const Drawer = createDrawerNavigator();

const MarketerDashboard = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Drawer.Navigator initialRouteName="Marketer Home">
        <Drawer.Screen name="Marketer Home" component={MarketerHome} options={noHeader} />

        <Drawer.Screen name="My Requests" component={MarketerHome} options={noHeader} />

        <Drawer.Screen name="All Demands" component={MarketerHome} options={noHeader} />

        <Drawer.Screen name="My Claims" component={MarketerHome} options={noHeader} />
      </Drawer.Navigator>
    </>
  );
};

export default MarketerDashboard;
