import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#DEDEDE',
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 26,
    color: '#000000',
    paddingBottom: 8,
    paddingTop: 24,
  },
  box: {
    width: 100,
    aspectRatio: 1,
    backgroundColor: '#D9D9D9',
  },
  description: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#252525',
  },
  searchButtonText: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    color: '#333333',
  },
  searchButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    marginBottom: 24,
    marginTop: 21,
  },

  reservationTitle: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
    paddingTop: 24,
    paddingBottom: 4,
  },
  reservationHelpCenterText: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#DEDEDE',
  },
});
