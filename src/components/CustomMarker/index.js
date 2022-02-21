import React from 'react';
import {View, Text} from 'react-native';
import {Marker} from 'react-native-maps';

const CustomMarker = (props) => {

    const {coordinate, price, onPress, isSelected} = props;
    return (
        <Marker
                
                coordinate={coordinate}
                onPress={onPress}
                
                
                >
                    <View style={{
                        backgroundColor: isSelected ? 'black': 'white', 
                        padding: isSelected? 10: 5,
                        elevation: isSelected ? 3 : 0,
                        borderRadius: 20,
                        borderColor: 'grey',
                        borderWidth: 1,
                        }}>
                        <Text style={{fontSize: isSelected ? 16 :14 ,color: isSelected ? 'white' : 'black' , fontWeight: 'bold'}}>GH₵ {Math.round(price * 1.07)}</Text>
                    </View>
                </Marker>
    );
};

export default CustomMarker;