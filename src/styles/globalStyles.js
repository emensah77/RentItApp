import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const fonts = {
  primary: 'Manrope ExtraLight',
};

export const colors = {
  primary: '',
  secondary: '#FFFFFF',
  text: '#1F2D3D',
  border: 'lightgrey',
  gray: '#DDDDDD',
  active: '#0047B3',
};

export const offsets = {
  minor: wp(1),
  offsetA: wp(2.56),
  offsetB: wp(4.1),
  offsetC: wp(5.64),
};

export default StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between'},
});
