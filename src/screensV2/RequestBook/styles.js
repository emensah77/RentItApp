import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, offsets} from '../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: offsets.offsetC,
    paddingVertical: offsets.offsetC,
    backgroundColor: '#fff',
  },
  rentitImgTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 15,
  },
  img: {
    width: 100,
    height: 28,
    resizeMode: 'contain',
  },
  bottomSpace: {
    height: 8,
    width: wp(100),
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 24,
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    marginBottom: 8,
  },
  value: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  editText: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },
  priceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceDetailLabel: {
    fontWeight: '500',
    fontsize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  priceDetailValue: {
    fontWeight: '500',
    fontsize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  priceDetailValueGreen: {
    fontWeight: 800,
    fontSize: 16,
    lineHeight: 20,
    color: '#3C8826',
  },
  priceDetailTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  priceDetailTotalLabel: {
    fontWeight: '800',
    fontsize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  priceDetailTotalValueGreen: {
    fontWeight: '800',
    fontsize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  moreButton: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },
  requiredForTripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  requiredForTripTextBox: {
    width: 250,
  },
  addRoundedButton: {
    borderWidth: 1,
    borderColor: '#3333333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addRoundedButtonText: {
    fontWeight: '600',
    fontSize: 16,
    lineheight: 20,
    color: '#333333',
  },
  cancellationText: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
  },
  cancellationMoreButtonText: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },
  reservationInfo: {
    flexDirection: 'row',
  },
  requestBookButton: {
    width: wp(90),
    marginLeft: wp(5),
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    height: 50,
    backgroundColor: '#0047B3',
    borderRadius: 8,
  },
  requestBookButtonText: {
    fontSize: 16,
    lineHeight: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    margin: 0,
    padding: 0,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  payBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payIcon: {marginRight: 8},
  payText: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  couponBox: {
    paddingTop: 28,
    borderTopWidth: 1,
    borderColor: '#DEDEDE',
  },
  couponButtonText: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },
});
