import React, {useMemo} from 'react';
import {View, Image} from 'react-native';

const RentitImage = props => {
  const {width, height, circle, borderRadius, src, mode} = props;

  const containerStyle = useMemo(
    () => ({
      width: width || circle,
      height: height || circle,
      borderRadius: borderRadius || circle || 0,
      borderColor: '#000000',
      overflow: 'hidden',
      // borderWidth: __DEV__ ? 1 : 0,
    }),
    [circle, width, height, borderRadius],
  );

  const imageStyle = useMemo(
    () => ({
      width: circle || width,
      height: circle || height,
      alignSelf: 'flex-start',
      resizeMode: mode || 'cover',
    }),
    [circle, width, height, mode],
  );

  return (
    <View style={containerStyle}>
      <Image style={imageStyle} source={src} />
    </View>
  );
};

export default RentitImage;
