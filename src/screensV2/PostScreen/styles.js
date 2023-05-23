import {StyleSheet} from 'react-native';

import {offsets} from '../../styles/globalStyles';

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
});
