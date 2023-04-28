import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  PermissionsAndroid,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Permissions from 'react-native-permissions';

const Notifications = () => {
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
            authStatus === messaging.AuthorizationStatus.AUTHORIZED;
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
              authStatus === messaging.AuthorizationStatus.AUTHORIZED;
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            setNotification(enabled);
          }
        },
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <Image
          source={require('../../../assets/data/images/notifications.png')}
          style={{width: 300, height: 380}}
        />
        <View style={{paddingHorizontal: 15}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text style={{fontSize: 18, fontWeight: '800'}}>
              Enable Notifications
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              marginTop: 20,
            }}>
            Don't miss important notifications like new coming homes and
            updates.
          </Text>
          <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
            <TouchableOpacity
              disabled={notification}
              onPress={() => {
                if (!notification) {
                  Linking.openSettings();
                  navigation.navigate('Login');
                } else {
                  console.log('notification are enabled');
                }
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'blue',
                width: '90%',
                height: '22%',
                backgroundColor: 'blue',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Montserrat-Bold',
                  color: 'white',
                }}>
                {notification ? 'Already Enabled' : 'Turn on'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '23%',
                marginTop: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Montserrat-Bold',
                  color: 'blue',
                }}>
                {notification ? 'Skip' : 'Later'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
