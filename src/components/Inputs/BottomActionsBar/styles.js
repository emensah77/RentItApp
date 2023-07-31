import {Platform, StyleSheet} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors, offsets} from '../../../assets/styles/global';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  main: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: offsets.offsetA,
    paddingHorizontal: offsets.offsetB,
    // elevation: 2,
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
});
