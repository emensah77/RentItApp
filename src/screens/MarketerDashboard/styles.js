import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  footer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  dateRangeText: {
    fontSize: 16,
    marginBottom: 15,
  },
  fetchButton: {
    backgroundColor: '#1f9fff',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  fetchButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
