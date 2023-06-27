import React from 'react';
import {View, Text, Platform} from 'react-native';
import {Marker} from 'react-native-maps';

const CustomMarker = props => {
  const {coordinate, price, onPress, isSelected} = props;
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View
        style={{
          backgroundColor: isSelected ? 'black' : 'white',
          padding: 5,
          elevation: isSelected ? 2 : 0,
          borderRadius: 20,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: isSelected ? 'white' : 'black',
            fontWeight: 'bold',
          }}>
          GH₵ {Math.round(price * 1.07)}
        </Text>
      </View>
    </Marker>
  );
};

export default CustomMarker;
