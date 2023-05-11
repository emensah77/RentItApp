import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 13,
    borderTopEndRadius: 13,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
  },
  headerTitle: {
    fontWeight: '800',
    fontSize: 17,
    lineHeight: 24,
    color: '#252525',
  },
  icon: {
    position: 'absolute',
    left: 24,
    top: 18,
  },
  listItemContainer: {
    paddingVertical: 12,
  },
  basePadding: {
    paddingHorizontal: 24,
  },
  addListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addListItemImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
    marginRight: 17,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addListItemTitle: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
  },
});
