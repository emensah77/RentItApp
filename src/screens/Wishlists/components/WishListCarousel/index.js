import React, {useCallback} from 'react';
import {FlatList, View, Dimensions} from 'react-native';
import WishListCard from '../WishListCard';
import styles from './WishListCarousel.styles';

export default () => {
  const renderItem = useCallback(() => {
    return <WishListCard />;
  }, []);
  return (
    <View>
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={Dimensions.get('screen').width - 48}
        snapToAlignment="center"
        decelerationRate="fast"
      />

      <View style={styles.dots}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};
