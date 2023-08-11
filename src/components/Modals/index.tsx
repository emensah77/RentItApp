/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React, {useCallback, useMemo, useState} from 'react';
import {Modal, View, TouchableOpacity, ScrollView} from 'react-native';
import {Icon, SizedBox, Text, Input, Dropdown, Button} from '@components';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Calendar from 'react-native-calendar-range-picker';
import Video from 'react-native-video';
import {colors} from '@assets/styles';
import styles from './styles';
import {getSubLocalities, default as localities} from '../../utils/localities';

interface ModalProps {
  show: boolean;
  onClose: any;
  onComplete?: any;
  onChange?: any;
  type: 'location' | 'calender' | 'video' | 'form';
  handleVideoPlaybackComplete?: any;
  videoUrl?: string;
  handleSubmit?: () => void;
  onEmptySubmit?: (e?: string) => void;
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
  const [subLocalities, setSubLocalities] = useState([]);
  const [selectedHomeType, setSelectedHomeType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [selectedSubLocality, setSelectedSubLocality] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const modes = useMemo(
    () => [
      {
        value: 'For Rent',
      },

      {
        value: 'For Sale',
      },
    ],
    [],
  );
  const hometypes = useMemo(
    () => [
      {
        value: 'Apartment',
      },

      {
        value: 'Full Home',
      },
      {
        value: 'Entire Flat',
      },
      {
        value: 'Self-Contained',
      },
      {
        value: 'Single Room',
      },
      {
        value: 'Mansion',
      },
      {
        value: 'Chamber and Hall',
      },
    ],

    [],
  );

  // Update this handler
  const handleLocalityChange = selectedValue => {
    setSubLocalities(getSubLocalities(selectedValue.value)); // Assuming getSubLocalities accepts the value and returns the corresponding sub-localities
    onChange && onChange({name: 'localities', value: selectedValue}); // Assuming you still want to call onChange
  };
  const {show, onClose, onComplete, type, onChange, handleVideoPlaybackComplete, videoUrl} = props;
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
              textInputProps={{
                onSubmitEditing: event => {
                  const inputText = event.nativeEvent.text;
                  props.onEmptySubmit(inputText);
                },
              }}
              // suppressDefaultStyles
              renderRow={renderRow}
            />
          ) : type === 'calender' ? (
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
          ) : type === 'video' ? (
            <Video
              source={{uri: videoUrl}}
              resizeMode="cover"
              style={styles.video}
              onEnd={handleVideoPlaybackComplete}
            />
          ) : type === 'form' ? (
            <View style={styles.form}>
              <Text
                text="Let us know what you want so we can help you find it"
                weight="bold"
                size="lg"
                style={styles.headerTitle}
              />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}>
                <Input
                  label="Name"
                  name="name"
                  type="text"
                  onChange={onChange}
                  placeholder="Enter your name"
                />
                <SizedBox height={20} />
                <Input
                  label="Price"
                  placeholder="Enter your budget"
                  name="price"
                  type="numeric"
                  onChange={onChange}
                />
                <SizedBox height={20} />
                <Input
                  label="Phone"
                  placeholder="Enter your phone number"
                  name="clientNumber"
                  type="phone-pad"
                  onChange={onChange}
                />
                <SizedBox height={20} />
                <Input
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Type what you want. The more details the better."
                  multiLine={1}
                  onChange={onChange}
                />
                <SizedBox height={20} />
                <Input
                  label="Neighborhood"
                  name="neighborhood"
                  type="text"
                  onChange={onChange}
                  placeholder="Type the exact place you want"
                />
                <SizedBox height={20} />
                <Dropdown
                  label="Select the home type you want"
                  data={hometypes}
                  name="homeType"
                  displayKey="value"
                  onChange={selectedValue => {
                    setSelectedHomeType(selectedValue.value);
                    onChange(selectedValue.value, 'homeType');
                  }}
                  value={selectedHomeType} // To set the current value
                />
                <SizedBox height={20} />
                <Dropdown
                  label="Select whether you want to rent or buy"
                  name="type"
                  data={modes}
                  displayKey="value"
                  onChange={selectedValue => {
                    setSelectedMode(selectedValue.value);
                    onChange(selectedValue.value, 'type');
                  }}
                  value={selectedMode} // To set the current value
                />

                <Dropdown
                  label="Select the region you want"
                  name="localities"
                  placholder="Select a locality"
                  data={localities}
                  displayKey="name"
                  onChange={selectedValue => {
                    handleLocalityChange(selectedValue);
                    setSelectedLocality(selectedValue.name); // Set the selected value
                    onChange(selectedValue.name, 'locality');
                  }}
                  value={selectedLocality} // To set the current value
                />

                <Dropdown
                  label="Select the district you want"
                  name="subLocalities"
                  data={subLocalities}
                  displayKey="name"
                  onChange={selectedValue => {
                    setSelectedSubLocality(selectedValue.name); // Set the selected value
                    onChange(selectedValue.name, 'sublocality');
                  }}
                  value={selectedSubLocality} // To set the current value
                />

                <SizedBox height={20} />
                <Button type="primary" onPress={props.handleSubmit}>
                  Submit
                </Button>
              </ScrollView>
            </View>
          ) : null}
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
