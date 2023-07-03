import React from 'react';
import {View, Text, Pressable, Image} from 'react-native';

import {global, button, typography} from '../assets/styles';

const Button = props => {
  const {
    children,
    type,
    onPress,
    prefix,
    suffix,
    disabled,
    groupAfter,
    groupBefore,
    loading,
    width,
    fitWidth,
    color,
    accessibilityLabel,
  } = props;
  return (
    <Pressable
      accessible
      accessibilityLabel={accessibilityLabel}
      onPress={disabled ? null : onPress}
      hitSlop={20}>
      <View
        style={[
          button[type] || button.primary,
          groupBefore ? global.groupBefore : groupAfter ? global.groupAfter : {},
          fitWidth ? button.fitWidth : {},
          width ? {width} : {},
          color ? {backgroundColor: color} : {},
          disabled ? button.disabled : {},
        ]}>
        {prefix && (
          <Image
            source={prefix}
            style={groupAfter || groupBefore ? global.groupPrefix : global.prefix}
          />
        )}
        <Text style={[typography[`${type}Button`], fitWidth ? typography.fitWidth : {}]}>
          {loading ? 'Loading...' : children}
        </Text>
        {suffix && (
          <Image
            source={suffix}
            style={groupAfter || groupBefore ? global.groupSuffix : global.suffix}
          />
        )}
      </View>
    </Pressable>
  );
};

export default Button;
