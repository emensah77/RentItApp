import React from 'react';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  contain: {
    borderRadius: 8,
    // paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentLeft: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  contentRight: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  contentRate: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'row',
  },
});
