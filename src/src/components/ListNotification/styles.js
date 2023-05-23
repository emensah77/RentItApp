import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  viewBackground: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: 10,
  },
  viewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  styleThumb: {
    borderWidth: 1,
    borderColor: 'white',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 8,
  },
  avatar: {
    margin: 0,
    height: 70,
    width: 70,
  },
});
