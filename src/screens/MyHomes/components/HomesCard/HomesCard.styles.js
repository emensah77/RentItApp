import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: '#DEDEDE',
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    backgroundColor: '#ffffff',
  },
  image: {
    height: 176,
    width: '100%',
    borderTopLeftRadius: 13,
    borderTopEndRadius: 13,
  },
  title: {
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 32,
    color: '#000000',
    paddingBottom: 9,
    paddingTop: 21,
  },
  description: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    paddingBottom: 28,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#DEDEDE',
  },
  cardFooter: {
    flexDirection: 'row',
    paddingTop: 16,
  },
  cardFooterTitle: {
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    paddingRight: 22,
  },
  cardFooterDescription: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
  },
  cardFooterRightSection: {
    borderLeftWidth: 1,
    borderLeftColor: '#DEDEDE',
    paddingLeft: 16,
  },
  mainPadding: {
    paddingHorizontal: 24,
    paddingBottom: 26,
  },
});
