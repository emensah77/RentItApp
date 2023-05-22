import React from 'react';
import {View, Image, Pressable} from 'react-native';

import Typography from './Typography';

import {global} from '../assets/styles';
import close from '../assets/images/close.png';

const Header = props => {
  const {children, onClose} = props;
  return (
    <View style={global.header}>
      <Pressable onPress={onClose} style={global.headerIcon} hitSlop={50}>
        <Image source={close} />
      </Pressable>
      {typeof children === 'string' ? (
        <Typography type="heading" center>
          {children}
        </Typography>
      ) : (
        children
      )}
    </View>
  );
};

export default Header;
