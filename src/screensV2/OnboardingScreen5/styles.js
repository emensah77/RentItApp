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
    // marginTop: Platform.OS === 'ios' ? 40 : 0,
    // backgroundColor: '#fff',
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
    marginTop: offsets.offsetC,
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
  },
  bedCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomColor: '#DEDEDE',
    borderBottomWidth: 1,
  },
  currencySelect: {
    borderColor: '#194CC3',
  },
  textStyle: {
    padding: 15,
  },
  selectText: {
    color: '#194CC3',
  },
  currencyBlock: {
    backgroundColor: '#F7F7F7',
    borderColor: '#f2f2f2',
    borderWidth: 1,
    borderRadius: 10,
    width: wp(60),
    justifyContent: 'center',
    marginLeft: wp(10),
    marginBottom: 10,
  },
  currencyType: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  textMinus: {
    textAlign: 'center',
    fontSize: 20,
    alignItems: 'center',
    paddingTop: 8,
  },
  currencyInput: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    width: 150,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  changeMinus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  currencyContent: {
    backgroundColor: '#fff',
    marginTop: 40,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    borderRadius: 10,
    shadowOpacity: 0.16,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: hp(30),
    paddingBottom: 10,
  },
  placesText: {
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    width: wp(76),
    marginLeft: wp(7),
  },
});
