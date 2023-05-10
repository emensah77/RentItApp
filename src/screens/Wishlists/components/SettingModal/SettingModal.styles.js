import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    borderRadius: 13,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 17,
  },
  main: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#DEDEDE',
    borderBottomColor: '#DEDEDE',
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerTitle: {
    fontWeight: '800',
    fontSize: 17,
    lineHeight: 24,
    color: '#252525',
  },
  headerDeleteText: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17,
    color: '#717171',
  },
  input: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#252525',
  },
  inputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  inputSubTitle: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 17,
    color: '#717171',
    paddingTop: 8,
    paddingBottom: 24,
  },
  noTextDecoration: {
    textDecorationLine: 'none',
  },
  whiteText: {
    color: '#ffffff',
  },
  deleteButton: {
    paddingVertical: 17,
    paddingHorizontal: 26,
    backgroundColor: '#000',
    borderRadius: 8,
  },
});
