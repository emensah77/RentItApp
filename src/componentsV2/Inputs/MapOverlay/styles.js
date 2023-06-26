import {Platform, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, offsets} from '../../../styles/globalStyles';

export const styles = StyleSheet.create({
  top_actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: offsets.offsetB,
    paddingLeft: offsets.offsetB,
  },
});
