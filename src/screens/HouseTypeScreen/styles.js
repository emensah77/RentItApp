import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {offsets} from '../../styles/globalStyles';

const styles = StyleSheet.create({
  container: {
    width: wp(88),
    marginLeft: wp(6),
    marginTop: offsets.offsetC,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    padding: wp(5.6),
    shadowOpacity: 0.12,
    // shadowColor: 'transparent',
    elevation: 5,
    borderWidth: 0.5,
    borderColor: '#DEDEDE',
    shadowRadius: 5,
    paddingLeft: offsets.offsetC,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    borderRadius: 26,
    backgroundColor: 'white',
    marginTop: wp(10),
  },
  contentMin: {
    borderRadius: 16,
    marginTop: offsets.offsetB,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContent: {
    position: 'relative',
    // justifyContent: 'center',
  },
  contentActive: {
    flexDirection: 'column',
  },
  searchInput: {
    flexDirection: 'row',
    background: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 12,
    paddingHorizontal: wp(4.1),
    height: wp(15.8),
    alignItems: 'center',
    marginTop: offsets.offsetB,
    paddingLeft: wp(13),
  },
  searchIcon: {
    position: 'absolute',
    left: offsets.offsetB,
    top: 8 + wp(7.9),
  },
  switcher: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: offsets.offsetB,
    height: wp(10.7),
    // justifyContent: 'space-around',
    backgroundColor: '#F2F2F2',
    borderRadius: wp(5.3),
  },
  switcherItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: wp(8.2),
    borderRadius: wp(4.1),
    width: '50%',
    marginLeft: wp(1.5),
  },
  switcherItemActive: {
    backgroundColor: 'white',
  },
  counterInfoWrapper: {
    marginTop: offsets.offsetA,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#DEDEDE',
    paddingBottom: offsets.offsetA,
  },
  bottomWrapper: {
    position: 'absolute',
    width: wp(100),
    bottom: 0,
    left: 0,
  },
  contentTop: {
    marginTop: wp(10),
  },
});

export default styles;
