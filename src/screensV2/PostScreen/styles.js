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
    marginTop: offsets.offsetC,
  },
  hostText: {
    textDecorationLine: 'underline',
    color: '#717171',
    textDecorationColor: '#717171',
    fontSize: 14,
  },
  starBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coHosts: {
    flexDirection: 'row',
    marginTop: 40,
  },
  imgHosts: {
    marginLeft: 15,
  },
  superHost: {
    marginBottom: 30,
  },

  reportText: {
    textDecorationLine: 'underline',
    color: '#252525',
    textDecorationColor: '#252525',
    paddingLeft: 10,
    fontWeight: 'bold',
    fontFamily: fonts.primary,
  },
  reportBlock: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  reserveBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: offsets.offsetC,
    paddingTop: 10,
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  reserveBlockInfo: {
    // width: wp(55),
  },
});
