import React from 'react';
import {View} from 'react-native';
import Button from '../Button';

import {styles} from './styles';
import {offsets} from '../../../assets/styles/global';

const BottomActionsBar = ({leftText, rightText, leftAction, rightAction}) => {
  return (
    <View style={styles.main}>
      {leftText && (
        <Button
          onPress={leftAction}
          text={leftText}
          variant="text"
          style={{marginLeft: offsets.offsetB}}
        />
      )}
      {rightText && <Button onPress={rightAction} text={rightText} />}
    </View>
  );
};

export default BottomActionsBar;
