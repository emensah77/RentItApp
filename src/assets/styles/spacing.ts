/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const spacing = {
  micro: 2,
  tiny: 4,
  extraSmall: 8,
  small: 12,
  medium: 16,
  large: 24,
  extraLarge: 32,
  huge: 48,
  massive: 64,
} as const;

export const offsets = {
  minor: wp(1),
  offsetA: wp(2.56),
  offsetB: wp(4.1),
  offsetC: wp(5.64),
};

export type Spacing = keyof typeof spacing;
