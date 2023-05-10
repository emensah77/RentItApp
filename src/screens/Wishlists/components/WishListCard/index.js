import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import useVisibility from '../../../../hooks/useVisibility';

import styles from './WishListCard.styles';

export default () => {
  const likeVisiblity = useVisibility();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={likeVisiblity.toggleVisibility}
        activeOpacity={0.7}
        style={styles.heartContainer}>
        <Icon
          name="heart"
          size={30}
          style={[styles.heartIcon, likeVisiblity.visible && styles.activeHeart]}
        />
      </TouchableOpacity>
      <FastImage
        style={styles.image}
        source={{
          uri: 'https://www.oregonlive.com/resizer/kynoG4zvtdSW-sKjVJYfQwsdTxE=/800x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/7OGYYKDSJVBKBNVLQQ3W5OHOUM.jpg',
          headers: {Authorization: 'token'},
          priority: FastImage.priority.high,
        }}
      />

      <View style={styles.imageBackground} />
    </View>
  );
};
