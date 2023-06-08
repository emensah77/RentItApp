import {Platform, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {offsets} from '../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    paddingVertical: offsets.offsetC,
    marginTop: Platform.OS === 'ios' ? 30 : 0,
    height: hp(80),
  },
  backButton: {
    marginBottom: 80,
  },
  title: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 32,
    color: '#1F2D3D',
    marginBottom: 48,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 35,
  },
  left: {
    width: 250,
    marginRight: 30,
  },
  boldText: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
    color: '#1F2D3D',
    marginBottom: 10,
  },
  lightText: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    color: '#4D4D4D',
    marginLeft: 15,
  },

  bottomFixedButtonBox: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#DEDEDE',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  bottomFixedButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    height: 50,
    backgroundColor: '#0047B3',
    borderRadius: 8,
  },
  bottomFixedButtonText: {
    fontSize: 16,
    lineHeight: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    margin: 0,
    padding: 0,
  },
});
