import {StyleSheet} from 'react-native';
import {HOMES_CAROUSEL_HEIGHT} from '../components/HomesCarousel/HomesCarousel.styles';

export default StyleSheet.create({
  container: {},
  carouselTitle: {
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 40,
    color: '#ffffff',
    position: 'absolute',
    top: HOMES_CAROUSEL_HEIGHT * 0.3,
    left: 24,
  },
  stickyHeader: {
    position: 'absolute',
    top: HOMES_CAROUSEL_HEIGHT * 0.1,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stickyHeaderButton: {
    width: 34,
    aspectRatio: 1,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyHeaderIcon: {
    color: '#000000',
  },
});
