import React from 'react';
import {View, Text} from 'react-native';

import {global, typography} from '../assets/styles';

const Divider = props => {
  const {children, small} = props;
  return (
    <View style={[global.dividerContainer, small ? global.noTextDividerContainer : {}]}>
      <View style={[global.dividerTextContainer, small ? global.noTextDividerTextContainer : {}]}>
        {children ? <Text style={[typography.heading, global.dividerText]}>{children}</Text> : null}
      </View>
      <View style={[global.divider, small ? global.noTextDivider : {}]} />
    </View>
  );
};

export default Divider;
