import {Platform, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, offsets} from '../../../assets/styles/global';

export const styles = StyleSheet.create({
  main: {
    overflow: 'hidden',
    marginRight: offsets.offsetA,
    width: wp(42),
  },
  image: {
    borderRadius: 8,
    width: wp(42),
    height: wp(28),
    resizeMode: 'cover',
  },
  textWrapper: {
    marginTop: offsets.minor,
    marginLeft: offsets.minor,
  },
});
