import React, {useEffect, useState, useCallback} from 'react';
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

import notificationImage from '../../../assets/data/images/notifications.png';

const Notifications = () => {
  const navigation = useNavigation();
  const [notification, setNotification] = useState();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Permissions.request('notification').then(async response => {
        if (response === 'authorized') {
          // Permission granted
          console.debug('Permission for notification granted.');
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
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS).then(async granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission granted
          console.debug('Permission for notification granted.');
        } else {
          const authStatus = await messaging().hasPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          setNotification(enabled);
        }
      });
    }
  }, []);

  const goToLogin = useCallback(() => navigation.navigate('Login'), [navigation]);

  const onPress = useCallback(() => {
    if (!notification) {
      Linking.openSettings();
      goToLogin();
    } else {
      console.error('Notification already enabled.');
    }
  }, [goToLogin, notification]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.innerContainer}>
        <Image source={notificationImage} style={styles.notificationImage} />
        <View style={styles.headContainer}>
          <View style={styles.enableNotification}>
            <Text style={styles.heading}>Enable Notifications</Text>
          </View>
          <Text style={styles.subHeading}>
            Don&pos;t miss important notifications like new coming homes and updates.
          </Text>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              disabled={notification}
              onPress={onPress}
              style={styles.positiveActionTextWrapper}
            >
              <Text style={styles.positiveActionText}>
                {notification ? 'Already Enabled' : 'Turn on'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToLogin} style={styles.negativeActionTextWrapper}>
              <Text style={styles.negativeActionText}>{notification ? 'Skip' : 'Later'}</Text>
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
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  headContainer: {paddingHorizontal: 15},
  notificationImage: {width: 300, height: 380},
  enableNotification: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  actionContainer: {justifyContent: 'flex-end', alignItems: 'center'},
  positiveActionTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'blue',
    width: '90%',
    height: '22%',
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  negativeActionTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: '23%',
    marginTop: 20,
    borderRadius: 10,
  },
  positiveActionText: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
  },
  negativeActionText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: 'blue',
  },
  heading: {fontSize: 18, fontWeight: '800'},
  subHeading: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
  },
});

export default Notifications;
