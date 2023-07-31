import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  privacyItem: {
    flexDirection: 'row',
  },
  leftItem: {
    width: wp(30),
  },
});
