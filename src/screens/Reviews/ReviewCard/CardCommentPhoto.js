/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Text, Image, View} from 'react-native';

import firebase from '@react-native-firebase/app';
import StarRating from '../../../components/StarRating';
import styles from './styles';

export default function CardCommentPhoto({
  style,
  name,
  rate,
  date,
  title,
  comment,
  image,
  userID,
  hasReply,
}) {
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = async id => {
    if (id) {
      try {
        const data = await firebase
          .firestore()
          .collection('users')
          .doc(id)
          .get();
        setUserInfo(data.data());
        return data.data();
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getUserInfo(userID);
  }, []);

  return (
    <View style={[styles.contain, style]}>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Image
          source={{
            uri:
              userInfo?.userImg ||
              'https://w7.pngwing.com/pngs/754/2/png-transparent-samsung-galaxy-a8-a8-user-login-telephone-avatar-pawn-blue-angle-sphere-thumbnail.png',
            width: 200,
            height: 200,
          }}
          style={styles.thumb}
        />
        <View
          style={{
            flex: 1,
          }}>
          <Text style={{fontWeight: '600', marginLeft: 3}} numberOfLines={1}>
            {userInfo?.displayName || userInfo?.fname}
          </Text>

          <View style={styles.contentRate}>
            {!hasReply && (
              <StarRating
                disabled
                starSize={14}
                maxStars={5}
                rating={rate}
                selectedStar={rating => {}}
                fullStarColor="orange"
              />
            )}
            <Text
              footnote
              grayColor
              numberOfLines={1}
              style={{paddingHorizontal: 4, color: 'gray'}}>
              {date}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text
          style={{
            marginTop: 10,
            marginLeft: 10,
          }}>
          {comment}
        </Text>
      </View>
    </View>
  );
}

CardCommentPhoto.defaultProps = {
  style: {},
  image: '',
  name: '',
  rate: 0,
  date: '',
  title: '',
  comment: '',
  images: [],
  onYes: () => {},
  onNo: () => {},
  totalLike: 0,
  openGallery: () => {},
};
