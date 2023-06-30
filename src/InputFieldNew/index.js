import React from 'react';
import {View, TextInput} from 'react-native';

import {styles} from './styles';
import Typography from '../componentsV2/DataDisplay/Typography';

const InputFieldNew = ({name, requirementText}) => {
  return (
    <>
      <View style={styles.InputFieldBox}>
        <Typography style={styles.inputLabel}>{name}</Typography>
        <TextInput placeholder={name} placeholderTextColor="#717171" style={styles.InputField} />
      </View>
      {requirementText && <Typography style={styles.requirementText}>{requirementText}</Typography>}
    </>
  );
};

export default InputFieldNew;
