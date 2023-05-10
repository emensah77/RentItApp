import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeaderTitle: {
    flex: 1,
    textAlign: 'center',
  },
  modalHeaderRight: {
    padding: 16,
  },
  modal: {
    minHeight: '100%',
  },
});
