import React, {useCallback, useRef, useState} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, offsets} from '../../../styles/globalStyles';
import {styles} from './styles';

import CircleButton from '../../Inputs/CircleButton';
import Typography from '../Typography';

const Carousel = ({
  images,
  round,
  minimal,
  leftAction,
  leftImage,
  rightAction,
  rightImage,
  rightAction2,
  rightImage2,
}) => {
  const [imageWidth, setImageWidth] = useState();
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems?.[0]?.index || 0);
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

  const renderItem = useCallback(
    ({item}) => {
      if (!item) {
        return <></>;
      }

      return (
        <FastImage
          style={[styles.image, {width: imageWidth}]}
          source={{
            uri: item,
            headers: {Authorization: 'token'},
            priority: FastImage.priority.high,
          }}
        />
      );
    },
    [imageWidth],
  );

  const onLayout = useCallback(event => setImageWidth(event.nativeEvent.layout.width), []);

  return (
    <View style={round ? styles.round : undefined}>
      <FlatList
        onLayout={onLayout}
        data={images?.filter(image => !!image)}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={imageWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      {leftAction && (
        <CircleButton
          onPress={leftAction}
          image={leftImage}
          minimal={minimal}
          style={{position: 'absolute', top: offsets.offsetA, left: offsets.offsetA}}
        />
      )}

      {rightAction && (
        <CircleButton
          onPress={rightAction}
          image={rightImage}
          minimal={minimal}
          style={{position: 'absolute', top: offsets.offsetA, right: offsets.offsetA}}
        />
      )}

      {rightAction2 && (
        <CircleButton
          onPress={rightAction2}
          image={rightImage2}
          minimal={minimal}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            top: offsets.offsetA,
            position: 'absolute',
            right: offsets.offsetA * 2 + wp(8.8),
          }}
        />
      )}

      {!minimal && (
        <View style={styles.counter}>
          <Typography variant="small" style={{color: colors.secondary}} bold>
            {activeIndex + 1}/{images?.length}
          </Typography>
        </View>
      )}
      {minimal && (
        <View style={styles.dotsWrapper}>
          {images?.map((image, index) => (
            <View
              key={image}
              style={[styles.dot, index === activeIndex ? {backgroundColor: '#ffffff'} : undefined]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default Carousel;
