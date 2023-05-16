import React from 'react';
import {View, Text} from 'react-native';

import {global, typography} from '../assets/styles';

const Divider = props => {
  const {children} = props;
  return (
    <View style={global.dividerContainer}>
      <View style={global.dividerTextContainer}>
        <Text style={[typography.heading, global.dividerText]}>{children}</Text>
      </View>
      <View style={global.divider} />
    </View>
  );
};

export default Divider;
