import {Dimensions, StyleSheet} from 'react-native';

const {height, width} = Dimensions.get('window');
export const HOMES_CAROUSEL_HEIGHT = height * 0.4;

export default StyleSheet.create({
  dotContainer: {
    width: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: '#DDDDDD',
    width: 6,
    aspectRatio: 1,
    borderRadius: 20,
  },
  activeDotContainer: {
    alignItems: 'flex-start',
  },
  activeDot: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 3,
    borderRadius: 10,
    marginBottom: 1,
  },
  width7: {
    width: 7,
  },
  dots: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 14,
    flexDirection: 'row',
  },
  dvider: {
    width: 10,
  },
  cardImage: {
    width,
    height: HOMES_CAROUSEL_HEIGHT,
    resizeMode: 'cover',
  },
  darkMode: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
  },
});
