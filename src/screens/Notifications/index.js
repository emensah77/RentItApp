import React, {useContext, useEffect, useState} from 'react';
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../navigation/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import messaging from '@react-native-firebase/messaging';
import Permissions from 'react-native-permissions';
import {Linking} from 'react-native';
import {PermissionsAndroid} from 'react-native';

const Notifications = () => {
  const {user, logout} = useContext(AuthContext);
  const navigation = useNavigation();
  const [notification, setNotification] = useState();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Permissions.request('notification').then(async response => {
        if (response === 'authorized') {
          // Permission granted
        } else {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          setNotification(enabled);
        }
      });
    } else {
      // Request permission to send notifications
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS).then(
        async granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('android check yes');
          } else {
            const authStatus = await messaging().hasPermission();
            const enabled =
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            setNotification(enabled);
          }
        },
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <LinearGradient
        colors={['purple', 'deeppink']}
        start={{x: 0.1, y: 0.2}}
        end={{x: 1, y: 0.5}}
        style={[
          {
            backgroundColor: 'blue',
            height: '25%',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingHorizontal: 20,
            justifyContent: 'center',
          },
        ]}>
        <View
          style={{
            paddingTop: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 32,
              color: 'white',
              fontFamily: 'Montserrat-Bold',
            }}>
            Notifications
          </Text>
          <Icon name="bell-alert-outline" color="blue" size={45} />
        </View>
      </LinearGradient>

      <View style={{padding: 15}}>
        <Text
          style={{
            fontFamily: 'Montserrat-Bold',
            fontSize: 20,
          }}>
          Turn on notifications?
        </Text>
        <View style={{padding: 10, marginVertical: 10}}>
          <Text style={{fontSize: 16, fontFamily: 'Montserrat-Regular'}}>
            Don't miss important notifications like new coming homes and updates
          </Text>
        </View>

        <TouchableOpacity
          disabled={notification}
          onPress={() => {
            if (!notification) {
              Linking.openSettings();
              navigation.goBack();
            } else {
              console.log('notification are enabled');
            }
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'blue',
            width: '50%',
            height: '15%',
            backgroundColor: 'blue',
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Montserrat-Bold',
              color: 'white',
            }}>
            {notification ? 'Already Enabled' : 'Yes, Notify me'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'blue',
            width: '30%',
            height: '15%',
            marginTop: 20,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Montserrat-Bold',
              color: 'blue',
            }}>
            {notification ? 'Back' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default Notifications;
