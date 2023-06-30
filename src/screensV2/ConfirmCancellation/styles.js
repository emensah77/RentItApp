import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {offsets} from '../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    paddingVertical: offsets.offsetC,
  },
  cancellationPolicy: {
    paddingVertical: 20,
  },
  cancellationPolicyHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  policyText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  cancelText: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 16,
    color: '#252525',
    textDecorationLine: 'underline',
  },
  cancellationPolicyText: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
  },
  myPayments: {
    paddingVertical: 24,
  },
  myPaymentsTitle: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 2,
  },
  myPaymentsText: {
    fontWeight: '800',
    fontSize: 26,
    lineHeight: 34,
    color: '#000000',
  },
  refundDetails: {
    paddingVertical: 24,
  },
  refundDetailsTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 24,
  },
  textInfoBox: {
    paddingVertical: 20,
  },
  textInfo: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: '#717171',
  },
  cancelButtonBox: {
    paddingTop: 16,
    paddingBottom: 38,
    borderTopWidth: 1,
    borderColor: '#DEDEDE',
    width: wp(90),
    marginLeft: wp(5),
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    lineHeight: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    margin: 0,
    padding: 0,
  },
});
