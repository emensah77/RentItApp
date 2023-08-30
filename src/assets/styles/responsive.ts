import {Dimensions} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');

export const getWidthPercentage = (value: number, creativeWidth = width) =>
  (value / creativeWidth) * 100;

export const getHeightPercentage = (value: number, creativeHeight = height) =>
  (value / creativeHeight) * 100;

export const RW = (value: number | string) => {
  return widthPercentageToDP(typeof value === 'string' ? value : getWidthPercentage(value));
};

export const RH = (value: number | string) => {
  return heightPercentageToDP(typeof value === 'string' ? value : getHeightPercentage(value));
};
