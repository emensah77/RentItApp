import React from 'react';
import {StatusBar} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import MarketerHome from './MarketerHome';
import MyRequests from './MyRequests';
import AllDemands from './AllDemands';
import MyClaims from './MyClaims';
import StatsAndEarnings from './StatsAndEarnings';

const noHeader = {
  headerShown: false,
  lazy: true,
};

const Drawer = createDrawerNavigator();

const MarketerDashboard = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Drawer.Navigator initialRouteName="Stats And Earnings">
        <Drawer.Screen name="Marketer Home" component={MarketerHome} options={noHeader} />

        <Drawer.Screen name="My Requests" component={MyRequests} options={noHeader} />

        <Drawer.Screen name="All Demands" component={AllDemands} options={noHeader} />

        <Drawer.Screen name="My Claims" component={MyClaims} options={noHeader} />

        <Drawer.Screen name="Stats And Earnings" component={StatsAndEarnings} options={noHeader} />
      </Drawer.Navigator>
    </>
  );
};

export default MarketerDashboard;
