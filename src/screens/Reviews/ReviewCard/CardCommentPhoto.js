/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text} from 'react-native';
import {Image, View} from 'react-native';
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
}) {
  return (
    <View style={[styles.contain, style]}>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Image
          source={{uri: image, width: 200, height: 200}}
          style={styles.thumb}
        />
        <View
          style={{
            flex: 1,
          }}>
          <Text headline numberOfLines={1}>
            {name}
          </Text>

          <View style={styles.contentRate}>
            <StarRating
              disabled={true}
              starSize={14}
              maxStars={5}
              rating={rate}
              selectedStar={rating => {}}
              fullStarColor={'blue'}
            />
            <Text
              footnote
              grayColor
              numberOfLines={1}
              style={{paddingHorizontal: 4}}>
              {date}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text
          style={{
            marginTop: 10,
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
