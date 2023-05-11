import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import WishListCard from '../WishListCard';
import styles from './WishListCarousel.styles';

export default () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = useMemo(
    () => ({
      viewAreaCoveragePercentThreshold: 50,
    }),
    [],
  );

  const onViewableItemsChange = useCallback(({viewableItems}) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems?.[0]?.index || 0);
    }
  }, []);

  const renderItem = useCallback(() => {
    return <WishListCard />;
  }, []);

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        data={[1, 2, 3, 4]}
        renderItem={renderItem}
        decelerationRate="fast"
        snapToAlignment="center"
        viewabilityConfig={viewabilityConfig}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChange}
      />

      <View style={styles.dots}>
        {[1, 2, 3, 4].map((i, index) => (
          <View key={i} style={[styles.dot, activeIndex === index && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};
