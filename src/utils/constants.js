import {Dimensions, Platform} from 'react-native';

// window sizes
export const SIZES = Dimensions.get('window');

// platform
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const CONSTANTS = {
  SIZES,
  isAndroid,
  isIOS,
};
