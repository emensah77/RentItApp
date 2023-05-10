import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
export default StyleSheet.create({
  container: {
    width: width - 48,
    height: width * 0.95 - 24,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  heartContainer: {
    position: 'absolute',
    zIndex: 1,
    right: 16,
    top: 12,
  },
  heartIcon: {
    color: '#ddd',
  },
  activeHeart: {
    color: '#DF4058',
  },
  linearGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
  },
});
