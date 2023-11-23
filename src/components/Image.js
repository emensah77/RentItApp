import React, {useMemo} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

const RentitImage = props => {
  const {width, height, circle, borderRadius, src, mode} = props;

  const containerStyle = useMemo(
    () => ({
      width: width || circle,
      height: height || circle,
      borderRadius: borderRadius || circle || 0,
      borderColor: '#000000',
      overflow: 'hidden',
    }),
    [circle, width, height, borderRadius],
  );

  const imageStyle = useMemo(
    () => ({
      width: circle || width,
      height: circle || height,
      alignSelf: 'flex-start',
    }),
    [circle, width, height],
  );

  // Ensure `src` is correctly formatted for FastImage
  const imageSource = typeof src === 'string' ? {uri: src} : src;

  return (
    <View style={containerStyle}>
      <FastImage
        style={imageStyle}
        source={imageSource}
        resizeMode={FastImage.resizeMode[mode] || FastImage.resizeMode.cover}
      />
    </View>
  );
};

export default RentitImage;
