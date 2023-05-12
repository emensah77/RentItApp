import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import styles from './HomesCarousel.styles';
import CarouselCard from './CarouselCard';

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
    return <CarouselCard uri={imageUrl} />;
  }, []);

  const renderFlatlist = useCallback(
    () => (
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
    ),
    [images, onViewableItemsChange, renderItem, viewabilityConfig],
  );

  const renderActiveDot = useCallback(
    () => (
      <View>
        <View style={styles.activeDot} />
        <View style={[styles.activeDot, styles.width7]} />
      </View>
    ),
    [],
  );

  const renderDots = useCallback(
    () => (
      <View style={styles.dots}>
        {images.map((i, index) => (
          <View key={i} style={styles.dotContainer}>
            {activeIndex === index ? renderActiveDot() : <View style={styles.dot} />}
          </View>
        ))}
      </View>
    ),
    [activeIndex, images, renderActiveDot],
  );

  return (
    <View>
      {renderFlatlist()}

      {renderDots()}
    </View>
  );
};
