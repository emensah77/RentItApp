import {Platform, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, offsets} from '../../../styles/globalStyles';

export const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: wp(8.2),
    height: wp(8.2),
    borderRadius: wp(4.1),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B0B0B0',
  },
  value: {
    marginHorizontal: offsets.offsetC,
  },
});
