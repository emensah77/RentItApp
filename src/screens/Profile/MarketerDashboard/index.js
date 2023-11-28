import React, {useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MarketerHome from './MarketerHome';
import MyRequests from './MyRequests';
import AllDemands from './AllDemands';
import MyClaims from './MyClaims';
import StatsAndEarnings from './StatsAndEarnings';
import Report from './Report';
import MyViewings from './MyViewings';
import CompletedViewings from './CompletedViewings';
import SupervisorDashboard from './SupervisorDashboard';

const noHeader = {
  headerShown: false,
  lazy: true,
};

const Drawer = createDrawerNavigator();

const MarketerDashboard = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const {currentUser} = auth();
      if (currentUser) {
        try {
          const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserRole(userData.role);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserRole();
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Drawer.Navigator initialRouteName="Marketer Home">
        <Drawer.Screen name="Marketer Home" component={MarketerHome} options={noHeader} />

        <Drawer.Screen name="My Requests" component={MyRequests} options={noHeader} />

        <Drawer.Screen name="All Demands" component={AllDemands} options={noHeader} />

        <Drawer.Screen name="My Claims" component={MyClaims} options={noHeader} />

        <Drawer.Screen name="My Viewings" component={MyViewings} options={noHeader} />

        <Drawer.Screen name="Completed Viewings" component={CompletedViewings} options={noHeader} />

        <Drawer.Screen name="Stats And Earnings" component={StatsAndEarnings} options={noHeader} />

        {userRole === 'SUPERVISOR' && (
          <Drawer.Screen
            name="Supervisor Dashboard"
            component={SupervisorDashboard}
            options={noHeader}
          />
        )}

        <Drawer.Screen name="Report" component={Report} options={noHeader} />
      </Drawer.Navigator>
    </>
  );
};

export default MarketerDashboard;
