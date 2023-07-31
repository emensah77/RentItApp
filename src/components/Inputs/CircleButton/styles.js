import {Platform, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors} from '../../../assets/styles/global';

export const styles = StyleSheet.create({
  main: {
    width: wp(8.8),
    height: wp(8.8),
    borderRadius: wp(4.4),
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  minimal: {
    backgroundColor: undefined,
    elevation: 0,
    shadowOffset: undefined,
    shadowColor: undefined,
    shadowOpacity: 0,
    shadowRadius: 0,
  },
});
