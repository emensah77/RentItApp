import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    marginTop: wp(20),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 24,
  },
  text: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: '#4D4D4D',
  },
});

