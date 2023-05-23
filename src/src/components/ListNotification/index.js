import PropTypes from 'prop-types';
import React from 'react';
import {Image, ImageBackground, TouchableOpacity, View} from 'react-native';
import {Avatar, Layout, Text} from '@ui-kitten/components';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';

const ListNotification = props => {
  const navigation = useNavigation();
  const {notification} = props;

  const onNotificationPress = () => {
    navigation.navigate('Post', {postId: notification.postId});
  };

  return (
    <TouchableOpacity onPress={onNotificationPress}>
      <Layout
        style={[
          styles.container,
          {
            backgroundColor: '#D3D3D3',
            marginVertical: 2,
            marginHorizontal: 5,
            borderRadius: 10,
          },
        ]}
        level="1">
        <View style={{backgroundColor: 'pink', borderRadius: 10}}>
          <Image
            source={{uri: notification?.image}}
            style={[styles.avatar, {borderRadius: 10}]}
          />
        </View>
        <View
          style={{
            marginHorizontal: 10,
            flex: 1,
            justifyContent: 'space-around',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text category="h6">{notification.title?.slice(0, 15)}</Text>
            <Text category="label">
              {moment(new Date(notification?.createdAt)).fromNow()}
            </Text>
          </View>
          <View>
            <Text category="c1">{notification.description}</Text>
          </View>
        </View>
      </Layout>
    </TouchableOpacity>
  );
};

ListNotification.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  avatar: PropTypes.node.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

ListNotification.defaultProps = {
  style: {},
  image: '',
  avatar: '',
  name: '',
  description: '',
  title: '',
  onPress: () => {},
};

export default ListNotification;
