import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {fonts, offsets} from '../../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: offsets.offsetA,
  },
  image: {
    borderRadius: 12,
  },
  text: {
    fontFamily: fonts.primary,
    fontSize: 16,
    lineHeight: 22,
    color: '#252525',
    marginLeft: 16,
  },
});
