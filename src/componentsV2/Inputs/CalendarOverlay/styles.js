import {Platform, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {colors, offsets} from '../../../styles/globalStyles';

export const styles = StyleSheet.create({
  main: {
    height: '100%',
    paddingHorizontal: offsets.offsetC,
  },
  top_actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: offsets.offsetB,
  },
  clear_dates: {
    textDecorationLine: 'underline',
  },
  bottom_actions: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  calendar: {
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
