import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {offsets} from '../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    paddingVertical: offsets.offsetC,
    paddingTop: Platform.OS === 'ios' ? 80 : 0,
    backgroundColor: '#fff',
    height: hp(100),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 80,
  },
  topButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topButton: {
    borderWidth: 1,
    borderColor: '#BFBFBF',
    borderRadius: 147,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  topButtonText: {
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 14,
    color: '#252525',
  },
  stepText: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
    color: '#4D4D4D',
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 32,
    color: '#1F2D3D',
    marginBottom: 50,
  },
  titleText: {
    color: '#4D4D4D',
    marginBottom: 65,
  },
  text: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: '#4D4D4D',
    marginBottom: 50,
  },
  input: {
    height: 52,
    // background: '#F7F7F7',
    // borderWidth: 1,
    // borderColor: '#B0B0B0',
    // borderRadius: 25,
    // paddingLeft: 42,
    // paddingRight: 16,
  },
  textInput: {
    height: 52,
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    paddingLeft: 12,
    paddingRight: 16,
  },
});
