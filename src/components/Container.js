import React from 'react';
import {View} from 'react-native';

import {global} from '../assets/styles';

const Container = ({row, type, children}) => (
  <View style={[row ? global.row : {}, global[type]]}>{children}</View>
);

export default Container;
