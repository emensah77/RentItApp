import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import WishListCard from '../WishListCard';
import styles from './WishListCarousel.styles';

export default ({images = []}) => {
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

  const renderItem = useCallback(({item: imageUrl}) => {
    return <WishListCard uri={imageUrl} />;
  }, []);

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        data={images}
        renderItem={renderItem}
        decelerationRate="fast"
        snapToAlignment="center"
        viewabilityConfig={viewabilityConfig}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChange}
      />

      <View style={styles.dots}>
        {images.map((i, index) => (
          <View key={i} style={[styles.dot, activeIndex === index && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};
