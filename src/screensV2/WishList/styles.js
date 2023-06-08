import {StyleSheet} from 'react-native';

import {offsets, fonts} from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    paddingVertical: offsets.offsetC,
  },
  subTitle: {
    fontFamily: fonts.primary,
    fontSize: 22,
    lineHeight: 28,
    color: '#000000',
    marginBottom: 5,
  },
  text: {
    fontFamily: fonts.primary,
    fontSize: 16,
    lineHeight: 24,
    color: '#717171',
  },
});
