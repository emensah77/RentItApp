import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {colors, offsets} from '../../../assets/styles/global';

export const styles = StyleSheet.create({
  imageWrapper: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: hp(36.25),
    resizeMode: 'cover',
  },
  round: {
    borderRadius: 8,
    overflow: 'hidden',
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
  dotsWrapper: {
    position: 'absolute',
    bottom: offsets.offsetA,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    width: wp(1.53),
    height: wp(1.53),
    borderRadius: wp(0.75),
    backgroundColor: colors.gray,
    marginLeft: wp(1.53),
  },
});
