import React, {useMemo} from 'react';
import {View, Text} from 'react-native';

import {global, typography} from '../assets/styles';

const Divider = props => {
  const {children, small, top: marginTop, bottom: marginBottom} = props;

  const style = useMemo(
    () => ({
      outerContainer: [
        global.dividerContainer,
        small ? global.noTextDividerContainer : {},
        typeof marginTop !== 'undefined' ? {marginTop} : {},
        typeof marginBottom !== 'undefined' ? {marginBottom} : {},
      ],
      dividerTextContainer: [
        global.dividerTextContainer,
        small ? global.noTextDividerTextContainer : {},
      ],
      dividerText: [typography.heading, global.dividerText],
      divider: [global.divider, small ? global.noTextDivider : {}],
    }),
    [marginBottom, marginTop, small],
  );

  return (
    <View style={style.outerContainer}>
      {children ? (
        <View style={style.dividerTextContainer}>
          <Text style={style.dividerText}>{children}</Text>
        </View>
      ) : null}
      <View style={style.divider} />
    </View>
  );
};

export default Divider;
