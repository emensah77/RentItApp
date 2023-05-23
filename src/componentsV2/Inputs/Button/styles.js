import {StyleSheet} from 'react-native';
import {offsets} from '../../../styles/globalStyles';

// eslint-disable-next-line import/prefer-default-export
export const styles = StyleSheet.create({
  default: {
    borderWidth: 1,
    borderColor: '#194CC3',
    textAlign: 'center',
    borderRadius: 8,
    backgroundColor: '#194CC3',
    paddingHorizontal: offsets.offsetC,
  },
  defaultText: {
    textAlign: 'center',
    paddingVertical: 16,
    color: '#fff',
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#333',
    textAlign: 'center',
    borderRadius: 14,
  },
  outlinedText: {
    textAlign: 'center',
    paddingVertical: 16,
  },
});
