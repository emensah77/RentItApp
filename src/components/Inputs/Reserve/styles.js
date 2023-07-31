import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, offsets} from '../../../assets/styles/global';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  main: {
    width: wp(100),
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: offsets.offsetC,
    paddingTop: offsets.offsetB,
    paddingBottom: offsets.offsetC,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
