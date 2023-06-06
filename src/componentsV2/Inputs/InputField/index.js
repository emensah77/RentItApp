import React from 'react';
import {View, TextInput, Image} from 'react-native';
import {styles} from './styles';
import SearchIcon from '../../../../assets/data/images/icons/search-icon.svg';

const InputField = ({style, placeHolder}) => {
  return (
    <View style={styles.InputFieldBox}>
      <SearchIcon width={16} height={16} style={styles.image} />
      <TextInput
        placeholder={placeHolder || 'Search reviews'}
        placeholderTextColor="#717171"
        style={[styles.InputField, style]}
      />
    </View>
  );
};

export default InputField;
