import {Platform, StyleSheet} from 'react-native';

import {offsets} from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    paddingVertical: offsets.offsetC,
    marginTop: Platform.OS === 'ios' ? 40 : 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 80,
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
  rentSaleStep: {
    paddingTop: 50,
  },
  rentSaleStepOption: {
    borderWidth: 1,
    borderColor: '#BFBFBF',
    borderRadius: 21,
    padding: 20,
    marginBottom: 32,
  },
  rentSaleStepBoldText: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
    color: '#1F2D3D',
    marginBottom: 8,
  },
  rentSaleStepLightText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: '##4D4D4D',
  },
  placesList: {
    marginTop: 30,
  },
  placeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  placeName: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 22,
    color: '#1F2D3D',
    textAlign: 'center',
    marginLeft: 24,
  },
  bottomFixedButtonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#DEDEDE',
    // boxShadow: 0px 2px 9px rgba(0, 0, 0, 0.25);
  },
  bottomFixedTextButton: {
    textAlign: 'left',
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  bottomFixedTextButtonText: {
    fontWeight: '700',
    paddingVertical: 16,
    paddingHorizontal: 15,
    color: '#252525',
  },
  bottomFixedButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    height: 50,
    backgroundColor: '#0047B3',
    borderRadius: 8,
  },
  bottomFixedButtonText: {
    fontSize: 16,
    lineHeight: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    margin: 0,
    padding: 0,
  },
});
