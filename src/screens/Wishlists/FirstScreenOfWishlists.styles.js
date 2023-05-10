import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  title: {
    fontWeight: '800',
    fontSize: 30,
    lineHeight: 44,
    color: '#000000',
    paddingBottom: 56,
  },
  subTitle: {
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 26,
    color: '#000000',
    paddingBottom: 8,
  },
  body: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
  wishListItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wishListItemImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
    resizeMode: 'cover',
    marginRight: 17,
  },
  wishListItemTitle: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
  },
});
