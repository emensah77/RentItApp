import {Platform, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, offsets} from '../../../styles/globalStyles';

export const styles = StyleSheet.create({
  topInfo: {
    marginTop: offsets.offsetA,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  starBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prices: {
    marginTop: wp(1),
    alignSelf: 'flex-start',
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
});
