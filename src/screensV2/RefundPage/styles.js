import {StyleSheet} from 'react-native';

import {offsets} from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  closeBox: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#DEDEDE',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  titleCenter: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 42,
  },
  mainPrice: {
    fontSize: 32,
    lineHeight: 38,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 3,
  },
  mainSubtitle: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  mainText: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
  detailsTitle: {
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailsRowText: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  yourReservationTitle: {
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 24,
  },
  getReceipButtonBox: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#DEDEDE',
  },
  getReceipButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    height: 50,
    backgroundColor: '#0047B3',
    borderRadius: 8,
  },
  getReceipButtonText: {
    fontSize: 16,
    lineHeight: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    margin: 0,
    padding: 0,
  },
  detailStepsTitle: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#252525',
  },
  detailStepsText: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    color: '#717171',
  },
});
