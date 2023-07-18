import React from 'react';
import {View} from 'react-native';
import Button from '../Button';

import {styles} from './styles';

const BottomActionsBar = ({leftText, rightText, leftAction, rightAction}) => {
  return (
    <View style={styles.main}>
      {leftText && (
        <Button type="primary" onPress={leftAction}>
          {leftText}
        </Button>
      )}
      {rightText && (
        <Button type="standard" onPress={rightAction}>
          {rightText}
        </Button>
      )}
    </View>
  );
};

export default BottomActionsBar;
