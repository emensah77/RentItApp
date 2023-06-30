import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {offsets} from '../../../styles/globalStyles';

export const styles = StyleSheet.create({
  InputFieldBox: {
    // marginBottom: 34,
    // position: 'relative',
    flexDirection: 'row',
    background: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 12,
    paddingHorizontal: wp(4.1),
    height: wp(15.8),
    alignItems: 'center',
  },
  InputField: {
    marginLeft: wp(4.1),
    // paddingLeft: 42,
    // paddingRight: 16,
  },
  image: {
    // position: 'absolute',
    // left: 16,
    // top: 16,
  },
});
