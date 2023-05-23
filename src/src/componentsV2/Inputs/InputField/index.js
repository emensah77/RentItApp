import React from 'react';
import {View, TextInput, Image} from 'react-native';
import {styles} from './styles.js';
import SearchIcon from '../../../../assets/data/images/icons/search.png';

const InputField = () => {
  return (
    <View style={styles.InputFieldBox}>
      <Image source={SearchIcon} width={16} height={16} style={styles.image} />
      <TextInput
        placeholder="Search reviews"
        placeholderTextColor="#717171"
        style={styles.InputField}
      />
    </View>
  );
};

export default InputField;
