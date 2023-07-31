import {Platform, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, offsets} from '../../../assets/styles/global';

export const styles = StyleSheet.create({
  main: {
    container: {},
    monthContainer: {},
    weekContainer: {},
    monthNameText: {
      fontWeight: 'bold',
    },
    dayNameText: {},
    dayText: {},
    dayTextColor: 'black',
    holidayColor: 'black',
    todayColor: 'black',
    disabledTextColor: '#B0B0B0',
    selectedDayTextColor: 'white',
    selectedDayBackgroundColor: colors.active,
    selectedBetweenDayTextColor: '#000',
    selectedBetweenDayBackgroundTextColor: '#F2F2F2',
  },
});
