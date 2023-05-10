import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import styles from '../FirstScreenOfWishlists.styles';

export default () => (
  <TouchableOpacity activeOpacity={0.5} style={styles.wishListItemContainer}>
    <Image
      style={styles.wishListItemImage}
      source={{
        uri: 'https://www.oregonlive.com/resizer/kynoG4zvtdSW-sKjVJYfQwsdTxE=/800x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/7OGYYKDSJVBKBNVLQQ3W5OHOUM.jpg',
      }}
    />

    <Text style={styles.wishListItemTitle}>Weekend away</Text>
  </TouchableOpacity>
);
