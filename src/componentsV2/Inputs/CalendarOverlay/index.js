import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Calendar from 'react-native-calendar-range-picker';

// import {RangeCalendar} from '@ui-kitten/components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {styles} from './styles';
import Typography from '../../DataDisplay/Typography';
import CircleButton from '../CircleButton';
import {offsets} from '../../../styles/globalStyles';
import Reserve from '../Reserve';
import {extractDate} from '../../../utils/formatter';

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

const CalendarOverlay = ({title, bottomSheetRef, handleSheetChanges, onClose, onPositive}) => {
  const snapPoints = useMemo(() => ['25%', '95%'], []);

  const [range, setRange] = useState({});

  const onClearDates = useCallback(() => {
    setRange({});
  });

  const handleClosePress = () => {
    bottomSheetRef?.current?.close();
    onClose();
  };

  const dateToTitle = useCallback(() => {
    if (!range.startDate && !range.endDate) {
      return '';
    }
    const startDate = extractDate(range.startDate);
    const endDate = extractDate(range.endDate);

    let secTitle = `${startDate?.weekDay} ${startDate.day} ${startDate?.month}`;

    if (endDate) {
      secTitle += ` - ${endDate?.weekDay} ${endDate.day} ${endDate?.month}`;
    }

    return secTitle;
  }, [range]);

  return (
    <BottomSheet
      enablePanDownToClose
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View style={styles.main}>
        <View style={styles.top_actions}>
          <CircleButton
            onPress={handleClosePress}
            image={<FontAwesome name="close" size={18} color="black" />}
            minimal
          />
          <Pressable onPress={onClearDates}>
            <Typography style={styles.clear_dates}>Clear Dates</Typography>
          </Pressable>
        </View>
        <View>
          <Typography variant="headingLarge" bold>
            {title}
          </Typography>
          {range?.startDate && (
            <Typography style={{marginTop: offsets.offsetA}}>{dateToTitle()}</Typography>
          )}
        </View>
        <View style={{marginTop: offsets.offsetB}}>
          <Calendar
            locale={CUSTOM_LOCALE}
            isMonthFirst
            disabledBeforeToday
            style={styles.calendar}
            startDate={new Date().toISOString()}
            onChange={({startDate, endDate}) => console.log({startDate, endDate})}
          />
          {/* <RangeCalendar range={range} onSelect={nextRange => setRange(nextRange)} /> */}
        </View>
        <View style={styles.bottom_actions}>
          <Reserve
            buttonText="Save"
            onPress={() => onPositive(range)}
            topComponent={
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Typography variant="large" bold>
                  $132
                </Typography>
                <Typography style={{marginLeft: wp(2)}}>Night</Typography>
              </View>
            }
            bottomComponent={
              <View
                style={{marginTop: offsets.offsetA, flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome name="star" size={14} color="black" />
                <Typography style={{marginLeft: wp(2)}} bold variant="large">
                  4.76
                </Typography>
              </View>
            }
          />
        </View>
      </View>
    </BottomSheet>
  );
};

export default CalendarOverlay;
