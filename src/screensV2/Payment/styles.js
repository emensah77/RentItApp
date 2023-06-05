import {Platform, StyleSheet} from 'react-native';

import {offsets} from '../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    paddingVertical: offsets.offsetC,
    marginTop: Platform.OS === 'ios' ? 40 : 0,
  },
  container: {
    paddingHorizontal: offsets.offsetC,
  },
  payBlock: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  payData: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLeft: {
    flexDirection: 'row',
  },
});
