import React from 'react';
import Calendar from 'react-native-calendar-range-picker';

import {styles} from './styles';

const CUSTOM_LOCALE = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  dayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  today: '',
  year: '', // letter behind year number -> 2020{year}
};

const CalendarWrapper = ({onChange}) => {
  return (
    <Calendar
      locale={CUSTOM_LOCALE}
      isMonthFirst
      disabledBeforeToday
      style={styles.main}
      startDate={new Date().toISOString()}
      onChange={onChange}
    />
  );
};

export default CalendarWrapper;
