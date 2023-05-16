import React from 'react';
import {Text} from 'react-native';

import {global, typography} from '../assets/styles';

const Error = ({text}) =>
  text ? <Text style={[typography.regular, global.error]}>{text}</Text> : null;

export default Error;
