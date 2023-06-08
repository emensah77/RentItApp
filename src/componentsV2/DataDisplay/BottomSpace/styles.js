import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../styles/globalStyles';
// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  bottomSpace: {
    height: 8,
    width: wp(100),
    backgroundColor: colors.border,
    // backgroundColor: 'red',
    marginBottom: 34,
    marginTop: 34,
  },
});
