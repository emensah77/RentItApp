import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, fonts} from '../../../assets/styles/global';

export const styles = StyleSheet.create({
  small: {
    fontFamily: fonts.primary,
    fontSize: wp(3.07),
    lineHeight: wp(4.3),
    color: colors.text,
  },
  default: {
    fontFamily: fonts.primary,
    fontSize: wp(3.5),
    lineHeight: wp(4.1),
    color: colors.text,
  },
  headingLarge: {
    fontFamily: fonts.primary,
    fontSize: wp(5.6),
    lineHeight: wp(6.6),
    color: colors.text,
  },
  large: {
    fontFamily: fonts.primary,
    fontSize: wp(4.1),
    lineHeight: wp(5.1),
    color: colors.text,
  },
  xlarge: {
    fontFamily: fonts.primary,
    fontSize: wp(6.66),
    lineHeight: wp(8.2),
    color: colors.text,
  },
});
