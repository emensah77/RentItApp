import {colors} from '@assets/styles';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.palette.textInverse600,
    paddingVertical: 13,
  },
  mapView: {
    width: 128,
    height: 128,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.palette.textInverse100,
    justifyContent: 'center',
    marginRight: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: colors.palette.textInverse,
    height: 70,
    paddingHorizontal: 25,
  },

  btn: {
    backgroundColor: colors.palette.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default styles;
