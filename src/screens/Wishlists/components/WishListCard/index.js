import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

import styles from './WishListCard.styles';

export default ({uri = ''}) => {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {!!uri && (
          <FastImage
            style={styles.image}
            source={{
              uri,
              headers: {Authorization: 'token'},
              priority: FastImage.priority.high,
            }}
          />
        )}

        <View style={styles.imageBackground} />
      </View>
    </View>
  );
};
