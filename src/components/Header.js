import React from 'react';
import {View, Image, Pressable} from 'react-native';

import Typography from './Typography';

import {global} from '../assets/styles';
import close from '../assets/images/close.png';

const Header = props => {
  const {children, onClose, onMenuToggle, leftIcon, rightIcon} = props;
  return (
    <View style={global.header}>
      <Pressable onPress={onClose} style={global.leftHeaderIcon} hitSlop={50}>
        <Image style={global.leftHeaderIconImage} source={leftIcon || close} />
      </Pressable>

      {typeof children === 'string' ? (
        <Typography onPress={onClose} type="heading" center>
          {children}
        </Typography>
      ) : (
        children
      )}

      {rightIcon ? (
        <Pressable onPress={onMenuToggle} style={global.rightHeaderIcon} hitSlop={50}>
          <Image source={rightIcon || close} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default Header;
