import {StyleSheet} from 'react-native';

import {standardWidth} from './global';

const fontType = {
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  maxWidth: standardWidth,
  width: '100%',
  alignSelf: 'center',
};

const typography = StyleSheet.create({
  largeHeading: {
    ...fontType,
    fontWeight: '800',
    fontSize: 32,
    lineHeight: 38.4,
    color: '#000000',
    alignSelf: 'center',
  },
  heading: {
    ...fontType,
    fontWeight: '800',
    fontSize: 17,
    lineHeight: 24,
    color: '#252525',
  },
  regular: {
    ...fontType,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#000000',
    opacity: 0.6,
  },
  label: {
    ...fontType,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#000000',
    opacity: 0.6,
  },
  inline: {
    ...fontType,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#000000',
    opacity: 0.6,
    marginHorizontal: 5,
  },
  link: {
    color: '#194CC3',
  },
  notice: {
    ...fontType,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
  },
  standardButton: {
    ...fontType,
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  primaryButton: {
    ...fontType,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    color: '#252525',
    textAlign: 'center',
  },
  regularButton: {
    ...fontType,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
    textAlign: 'left',
    opacity: 0.6,
  },
  fitWidth: {
    width: 'auto',
  },
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
});

export default typography;