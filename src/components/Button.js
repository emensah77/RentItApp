import React, {useMemo} from 'react';
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

  const style = useMemo(
    () => [
      button[type] || button.primary,
      groupBefore ? global.groupBefore : groupAfter ? global.groupAfter : {},
      fitWidth ? button.fitWidth : {},
      width ? {width} : {},
      color ? {backgroundColor: color} : {},
      disabled ? button.disabled : {},
    ],
    [color, disabled, fitWidth, groupAfter, groupBefore, type, width],
  );

  const textStyle = useMemo(
    () => [typography[`${type}Button`], fitWidth ? typography.fitWidth : {}],
    [fitWidth, type],
  );

  return (
    <Pressable
      accessible
      accessibilityLabel={accessibilityLabel}
      onPress={disabled ? null : onPress}
      hitSlop={20}>
      <View style={style}>
        {prefix && (
          <Image
            source={prefix}
            style={groupAfter || groupBefore ? global.groupPrefix : global.prefix}
          />
        )}
        <Text style={textStyle}>{loading ? 'Loading...' : children}</Text>
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
