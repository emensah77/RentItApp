import {StyleSheet} from 'react-native';

import {fonts, offsets} from '../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    marginTop: offsets.offsetC,
  },
  polictyText: {
    fontFamily: fonts.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
    marginTop: offsets.offsetA,
  },
});
