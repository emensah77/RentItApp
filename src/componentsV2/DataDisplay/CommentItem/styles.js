import {StyleSheet} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors, offsets} from '../../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  main: {
    overflow: 'hidden',
    marginRight: offsets.offsetA,
    width: wp(78),
    borderWidth: 1,
    borderColor: colors.border,
    padding: offsets.offsetA,
    borderRadius: 8,
  },
  userTitleWrapper: {
    width: wp(78),
    flexDirection: 'row',
  },
  userImage: {
    borderRadius: wp(5.4),
    width: wp(10.8),
    height: wp(10.8),
    resizeMode: 'cover',
  },
});
