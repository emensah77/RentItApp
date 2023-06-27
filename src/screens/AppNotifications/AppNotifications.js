import React, {useContext, useEffect, useState} from 'react';
import {StatusBar, View, FlatList, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {Button, Text} from '@ui-kitten/components';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheckDouble} from '@fortawesome/free-solid-svg-icons';
import ListNotification from '../../components/ListNotification';
import Post from '../../components/Post';
import {AuthContext} from '../../navigation/AuthProvider';

const AppNotifications = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const totalUnRead = notifications.filter(item => item.read === false).length;

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    firestore()
      .collection('users')
      // .doc('S1e9IadGFJRPaDIe8nb0AszDPMx1')
      .doc(user?.uid)
      .collection('notifications')
      .onSnapshot(querySnapshot => {
        const temp = querySnapshot.docs.map(doc => doc.data());
        setNotifications(temp);
      });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [user?.uid]);

  const clearHandler = () => {
    firestore()
      .collection('users')
      .doc(user?.uid)
      .collection('notifications')
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          doc.ref.delete();
        });
      });
    Alert.alert('Success', 'All notifications have been cleared');
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <StatusBar hidden />
      <LinearGradient
        colors={['purple', 'deeppink']}
        start={{x: 0.1, y: 0.2}}
        end={{x: 1, y: 0.5}}
        style={[
          {
            height: '20%',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingHorizontal: 20,
            justifyContent: 'center',
          },
        ]}>
        <View style={{paddingTop: 15}}>
          <Text
            style={{
              fontSize: 32,
              color: 'white',
              fontFamily: 'Montserrat-Bold',
            }}
            category="h6">
            Notifications
          </Text>
        </View>
      </LinearGradient>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 5,
        }}>
        <Text
          style={{
            fontFamily: 'Montserrat-Bold',
            fontSize: 17,
            color: '#3366FF',
          }}
          category="s1">
          New Notifications ({totalUnRead})
        </Text>
        <Button
          disabled={notifications?.length === 0}
          appearance="ghost"
          status="primary"
          onPress={clearHandler}>
          CLEAR ALL
          <View style={{paddingLeft: 5}}>
            <FontAwesomeIcon
              icon={faCheckDouble}
              size={17}
              color={notifications?.length === 0 ? '#D3D3D3' : '#3366FF'}
            />
          </View>
        </Button>
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            marginVertical: 20,
            marginHorizontal: 20,
            justifyContent: 'flex-start',
            alignContent: 'center',
          }}>
          <SkeletonContent
            containerStyle={{paddingBottom: 100, width: 400}}
            animationDirection="horizontalLeft"
            layout={[
              {
                width: 350,
                height: 80,
                marginBottom: 10,
                borderRadius: 10,
              },
              {
                width: 350,
                height: 80,
                marginBottom: 10,
                borderRadius: 10,
              },
              {
                width: 350,
                height: 80,
                marginBottom: 10,
                borderRadius: 10,
              },
              {
                width: 350,
                height: 80,
                marginBottom: 10,
                borderRadius: 10,
              },
              {
                width: 350,
                height: 80,
                marginBottom: 10,
                borderRadius: 10,
              },
              {
                width: 350,
                height: 80,
                marginBottom: 10,
                borderRadius: 10,
              },
            ]}
          />
        </View>
      ) : (
        <View style={{flex: 1}}>
          {notifications?.length !== 0 ? (
            <FlatList
              data={notifications}
              renderItem={({item}) => <ListNotification notification={item} />}
            />
          ) : (
            <View style={{alignSelf: 'center', marginTop: 10}}>
              <Text>There are no new Notifications</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default AppNotifications;
