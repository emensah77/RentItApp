import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {fonts, offsets} from '../../styles/globalStyles';

export const mainSkeletonLayout = [
  // long line
  {
    width: '100%',
    height: 300,
    marginBottom: offsets.offsetA,
    borderRadius: offsets.offsetA,
  },
  {width: 220, height: 20, marginBottom: offsets.offsetA},
  // short line
  {width: 90, height: 20, marginBottom: offsets.offsetA},
  {width: 40, height: 20, marginBottom: 80},

  {width: '100%', height: 150, marginBottom: 100},

  {
    width: '100%',
    height: 20,
    marginBottom: offsets.offsetA,
    paddingHorizontal: 40,
  },
  {width: '100%', height: 20, marginBottom: offsets.offsetA},
  {width: '100%', height: 20, marginBottom: offsets.offsetA},
  {width: '100%', height: 20, marginBottom: offsets.offsetA},
  {width: '100%', height: 20, marginBottom: offsets.offsetA},
  {width: '100%', height: 20, marginBottom: offsets.offsetA},
  {width: '100%', height: 20, marginBottom: offsets.offsetA},

  // ...
];

export const styles = StyleSheet.create({
  skeleton: {paddingBottom: 0, width: '100%'},
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    // marginTop: offsets.offsetC,
  },
  helpCenter: {
    textDecorationLine: 'underline',
  },
  imgBlock: {
    width: 100,
    height: 100,
    backgroundColor: '#D9D9D9',
    marginTop: 8,
    marginBottom: 8,
  },
  checkBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  border: {
    width: 1,
    backgroundColor: '#DEDEDE',
  },
  leftHostData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  confirmationCode: {
    marginTop: 10,
    marginBottom: 10,
  },
  readMoreText: {
    flexDirection: 'row',
  },
});
