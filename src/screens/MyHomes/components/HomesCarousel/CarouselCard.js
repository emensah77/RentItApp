import React from 'react';
import {Image, View} from 'react-native';
import styles from './HomesCarousel.styles';

export default ({uri}) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.cardImage}
        source={{
          uri,
        }}
      />

      <View style={styles.darkMode} />
    </View>
  );
};
