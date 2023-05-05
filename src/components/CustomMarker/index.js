import React, {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Marker} from 'react-native-maps';

const CustomMarker = props => {
  const {coordinate, price, onPress, isSelected} = props;

  const styles = useCallback(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: isSelected ? 'black' : 'white',
          padding: isSelected ? 10 : 5,
          elevation: isSelected ? 3 : 0,
          borderRadius: 20,
          borderColor: 'grey',
          borderWidth: 1,
        },
        title: {
          fontSize: isSelected ? 16 : 14,
          color: isSelected ? 'white' : 'black',
          fontWeight: 'bold',
        },
      }),
    [isSelected],
  );

  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={styles().container}>
        <Text style={styles().title}>GH₵ {Math.round(price * 1.07)}</Text>
      </View>
    </Marker>
  );
};

export default CustomMarker;
