/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React, {useCallback} from 'react';
import {Modal, View, TouchableOpacity} from 'react-native';
import {Icon, SizedBox, Text} from '@components';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Calendar from 'react-native-calendar-range-picker';
import {colors} from '@assets/styles';
import styles from './styles';

interface ModalProps {
  show: boolean;
  onClose: any;
  onComplete?: any;
  onChange?: any;
  type: 'location' | 'calender';
}

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

export const SearchModal = (props: ModalProps) => {
  const {show, onClose, onComplete, type, onChange} = props;
  const renderRow = useCallback(
    item => (
      <View style={styles.headerContainer}>
        <Icon icon="location" size={35} />
        <SizedBox width={10} />
        <Text text={item?.description} weight="400" size="sm" />
      </View>
    ),
    [],
  );
  return (
    <Modal animationType="slide" visible={show} transparent={true} onRequestClose={onClose}>
      <View style={styles.modal}>
        <View style={styles.modalContainer}>
          <View style={styles.close}>
            <Icon icon="closeCircle" onPress={onClose} />
          </View>
          <SizedBox height={20} />
          {type === 'location' ? (
            <GooglePlacesAutocomplete
              placeholder="Search destinations"
              fetchDetails
              styles={{
                textInput: styles.searchInput,
              }}
              onPress={onComplete}
              query={{
                key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
                language: 'en',

                components: 'country:gh',
              }}
              // suppressDefaultStyles
              renderRow={renderRow}
            />
          ) : (
            <View>
              <Text text="When's your trip?" weight="bold" size="xl" />
              <Calendar
                locale={CUSTOM_LOCALE}
                isMonthFirst
                disabledBeforeToday
                style={styles.main}
                startDate={new Date().toISOString()}
                onChange={onChange}
              />
            </View>
          )}
        </View>
        {type === 'calender' && (
          <View style={styles.footer}>
            <Text text="Skip" weight="bold" size="xs" style={$textStyle} onPress={onClose} />
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <View style={styles.headerContainer}>
                <Text text="Next" weight="bold" size="xs" color={colors.palette.textInverse} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const $textStyle = {
  textDecorationLine: 'underline',
};
