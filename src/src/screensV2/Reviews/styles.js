import {StyleSheet} from 'react-native';

import {offsets} from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: offsets.offsetC,
    marginTop: offsets.offsetC,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
});
