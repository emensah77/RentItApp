import {StyleSheet} from 'react-native';
import {CONSTANTS} from '../../utils/constants';
const {isIOS} = CONSTANTS;

export const styles = StyleSheet.create({
  button: {
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    position: 'absolute',
    left: 0,
    top: -45,
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'black',
  },
});
