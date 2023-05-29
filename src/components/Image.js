import React, {useMemo} from 'react';
import {View, Image} from 'react-native';

const RentitImage = props => {
  const {width, height, circle, src} = props;

  const containerStyle = useMemo(
    () => ({
      width: width || circle,
      height: height || circle,
      borderRadius: circle || 0,
      // borderWidth: __DEV__ ? 1 : 0,
      borderColor: '#000000',
      marginTop: -3,
      overflow: 'hidden',
    }),
    [circle, width, height],
  );

  const imageStyle = useMemo(
    () => ({width: circle || width, height: circle || height}),
    [circle, width, height],
  );

  return (
    <View style={containerStyle}>
      <Image style={imageStyle} source={src} />
    </View>
  );
};

export default RentitImage;
