import React, {useMemo} from 'react';
import {View} from 'react-native';
import {Text} from '@components';
import {Marker} from 'react-native-maps';

const CustomMarker = props => {
  const {coordinate, price, onPress, isSelected} = props;
  const $style = useMemo(() => {
    return {
      backgroundColor: isSelected ? 'black' : 'white',
      padding: 5,
      elevation: isSelected ? 3 : 0,
      borderRadius: 20,
      borderColor: 'grey',
      borderWidth: 1,
      height: 30,
    };
  }, [isSelected]);
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={$style}>
        <Text
          text={`GH₵ ${Math.round(price * 1.07)}`}
          color={isSelected ? 'white' : 'black'}
          weight="bold"
          size="xs"
        />
      </View>
    </Marker>
  );
};

export default CustomMarker;
