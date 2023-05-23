import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {colors, fonts, offsets} from '../../../styles/globalStyles';

export const styles = StyleSheet.create({
  image: {
    width: wp(100),
    height: hp(36.25),
    resizeMode: 'cover',
  },
  counter: {
    position: 'absolute',
    bottom: offsets.offsetA,
    right: offsets.offsetA,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
