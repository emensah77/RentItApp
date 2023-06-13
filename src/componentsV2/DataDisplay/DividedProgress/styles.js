import {Platform, StyleSheet} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors, offsets} from '../../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressBar: {
    width: '31%',
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: colors.gray,
  },
  progress: {
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#194CC3',
  },
});
