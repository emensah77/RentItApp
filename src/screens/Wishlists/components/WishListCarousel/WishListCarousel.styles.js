import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  dot: {
    backgroundColor: '#DDDDDD',
    width: 6,
    aspectRatio: 1,
    borderRadius: 20,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 7,
  },
  dots: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 14,
    flexDirection: 'row',
  },
});
