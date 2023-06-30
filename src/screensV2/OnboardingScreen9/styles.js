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
    backgroundColor: '#fff',
    height: hp(100),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 80,
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
    marginBottom: offsets.offsetB,
    marginTop: wp(12),
    // marginBottom: 50,
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
  itemData: {
    borderWidth: 1,
    borderColor: '#BFBFBF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
  },
  itemCheckData: {
    borderWidth: 2,
    borderColor: '#0047B3',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#B0B0B0',
    padding: 12,
    width: 180,
    marginTop: 6,
    marginLeft: wp(20),
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(50),
    marginLeft: wp(15),
    marginTop: 15,
  },
  btnYes: {
    width: 80,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.16,
    shadowRadius: 4.65,
    elevation: 6,
  },
  btnNo: {
    backgroundColor: '#fff',

    width: 80,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.16,
    shadowRadius: 4.65,
    elevation: 6,
  },
  homeOwner: {
    textAlign: 'center',
    paddingTop: 40,
  },
  customHeader: {
    padding: 10,
  },
});
