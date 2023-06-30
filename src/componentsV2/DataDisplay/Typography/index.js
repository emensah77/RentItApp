import React, {useMemo} from 'react';
import {Pressable, Text} from 'react-native';

import {styles} from './styles';

const Typography = ({variant = 'default', style, bold, onPress, children}) => {
  const mainStyle = useMemo(() => {
    const completeStyles = {
      ...(styles[variant] || {}),
    };

    if (bold) {
      completeStyles.fontWeight = 'bold';
    }

    return completeStyles;
  }, [style, bold, variant]);

  const Comp = <Text style={[mainStyle, style]}>{children}</Text>;

  if (onPress) {
    return <Pressable onPress={onPress}>{Comp}</Pressable>;
  }

  return Comp;
};

export default Typography;
