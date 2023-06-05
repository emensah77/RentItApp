import {Platform, StyleSheet} from 'react-native';
import {offsets, fonts} from '../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    paddingVertical: offsets.offsetC,
    marginTop: Platform.OS === 'ios' ? 50 : 0,
  },
  wishListTop: {
    backgroundColor: '#F7F7F7',
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 19,
    padding: 8,
    width: 75,
    textAlign: 'center',
    marginBottom: 31,
    marginTop: 31,
  },
  guestsText: {
    marginLeft: 15,
  },
  topContent: {
    flexDirection: 'row',
  },
  mapContent: {
    alignItems: 'center',
    backgroundColor: '#0047B3',
    width: 90,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 12,
  },
  mapBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalBg: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
  },
  modalHeader: {
    paddingLeft: 18,
    paddingRight: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#B0B0B0',
  },
  deleteButton: {
    fontFamily: fonts.primary,
    fontSize: 16,
    lineHeight: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  modalFooter: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelButton: {
    fontFamily: fonts.primary,
    fontSize: 16,
    lineHeight: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },
  createButtonBox: {
    backgroundColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 26,
    paddingVertical: 16,
  },
  createButton: {
    fontSize: 16,
    lineHeight: 16,
    color: '#FFFFFF',
  },
});
