import React from 'react';
import {View, Text} from 'react-native';

import {global, typography} from '../assets/styles';

const Divider = props => {
  const {children, small, top: marginTop, bottom: marginBottom} = props;
  return (
    <View
      style={[
        global.dividerContainer,
        small ? global.noTextDividerContainer : {},
        typeof marginTop !== 'undefined' ? {marginTop} : {},
        typeof marginBottom !== 'undefined' ? {marginBottom} : {},
      ]}
    >
      {children ? (
        <View style={[global.dividerTextContainer, small ? global.noTextDividerTextContainer : {}]}>
          <Text style={[typography.heading, global.dividerText]}>{children}</Text>
        </View>
      ) : null}
      <View style={[global.divider, small ? global.noTextDivider : {}]} />
    </View>
  );
};

export default Divider;
