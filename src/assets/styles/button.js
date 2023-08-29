import {StyleSheet} from 'react-native';

import {pageInnerHorizontalPadding, sizing} from './global';

const button = StyleSheet.create({
  standard: {
    ...sizing,
    height: 58,
    backgroundColor: '#194CC3',
    color: '#FFF',
    paddingVertical: 19,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  primary: {
    ...sizing,
    height: 58,
    backgroundColor: 'transparent',
    paddingVertical: 19,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    marginTop: 8,
    marginBottom: 5,
  },
  tertiary: {
    ...sizing,
    height: 50,
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 5,
  },
  regular: {
    ...sizing,
    color: '#000000',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingRight: 8,
    paddingBottom: 10,
    paddingLeft: pageInnerHorizontalPadding / 2,
    height: 60,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderStyle: 'solid',
    borderRadius: 8,
    opacity: 0.6,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 26,
    marginBottom: 0,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#BFBFBF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: '#BFBFBF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  error: {
    height: 58,
    paddingVertical: 19,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 5,
    borderColor: '#F00',
    backgroundColor: '#F00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    height: 12,
    width: 12,
    backgroundColor: '#BFBFBF',
  },
  radioSelected: {
    height: 12,
    width: 12,
    backgroundColor: '#BFBFBF',
    borderRadius: 6,
  },
  fitWidth: {
    width: 'auto',
    maxWidth: 'auto',
    alignSelf: 'flex-start',
  },
  disabled: {
    backgroundColor: '#DDDDDD',
  },
});

export default button;
