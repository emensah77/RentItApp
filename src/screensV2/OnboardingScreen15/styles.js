import {StyleSheet} from 'react-native';
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
    fontSize: 20,
    lineHeight: 32,
    color: '#1F2D3D',
  },
  titleText: {
    color: '#4D4D4D',
    marginBottom: 65,
  },
  upload: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  placesList: {
    marginTop: 50,
  },
  text: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: '#4D4D4D',
    marginBottom: 50,
  },
  itemHome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemImage: {
    width: 150,
    height: 88,
    borderRadius: 10,
  },
  bottomItem: {
    marginBottom: 60,
  },
});
