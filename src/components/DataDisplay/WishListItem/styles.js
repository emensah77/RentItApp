import {StyleSheet} from 'react-native';

import {fonts, offsets} from '../../../assets/styles/global';

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
    flex: 1, // This ensures it takes up only the available space after the image
    fontFamily: fonts.primary,
    fontSize: 14,
    lineHeight: 22,
    color: '#252525',
    marginLeft: 16,
  },
});
