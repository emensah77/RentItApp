import React, {useCallback, useMemo, useState} from 'react';
import {Modal, View, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {Icon, SizedBox, Text, Input, Dropdown, Button} from '@components';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Calendar from 'react-native-calendar-range-picker';
import Video from 'react-native-video';
import {colors} from '@assets/styles';
import auth from '@react-native-firebase/auth';
import styles from './styles';
import localities, {getSubLocalities} from '../../utils/localities';

interface ModalProps {
  show: boolean;
  onClose: any;
  onComplete?: any;
  onChange?: any;
  type: 'location' | 'calender' | 'video' | 'form';
  handleVideoPlaybackComplete?: any;
  videoUrl?: string;
  onEmptySubmit?: (e?: string) => typeof e & void;
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

const padding20 = {paddingBottom: 20};

export const SearchModal = (props: ModalProps) => {
  const [subLocalities, setSubLocalities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    clientNumber: '',
    type: '',
    homeType: '',
    neighborhood: '',
    description: '',
    locality: '',
    sublocality: '',
  });

  const handleInputChange = useCallback((value, name) => {
    setFormData(prevState => {
      const updatedState = {...prevState, [name]: value};
      return updatedState;
    });
  }, []);

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

  const {
    show,
    onClose,
    onComplete,
    type,
    onChange,
    handleVideoPlaybackComplete,
    videoUrl,
    onEmptySubmit,
  } = props;

  const autoCompleteStyle = useMemo(
    () => ({
      textInput: styles.searchInput,
    }),
    [],
  );

  const query = useMemo(
    () => ({
      key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
      language: 'en',

      components: 'country:gh',
    }),
    [],
  );

  const textInputProps = useMemo(
    () => ({
      onSubmitEditing: event => {
        const inputText = event.nativeEvent.text;
        onEmptySubmit?.(inputText);
      },
    }),
    [onEmptySubmit],
  );

  const source = useMemo(() => ({uri: videoUrl}), [videoUrl]);

  // Update this handler
  const handleLocalityChange = useCallback(
    selectedValue => {
      setSubLocalities(getSubLocalities(selectedValue.value)); // Assuming getSubLocalities accepts the value and returns the corresponding sub-localities
      onChange && onChange({name: 'localities', value: selectedValue}); // Assuming you still want to call onChange
    },
    [onChange],
  );

  const onChangeCallback = useCallback(
    _type => selectedValue => {
      let value = selectedValue.name;

      if (_type === 'locality') {
        handleLocalityChange(selectedValue);
        handleInputChange(value, 'locality'); // Update formData
      } else if (_type === 'sublocality') {
        handleInputChange(value, 'sublocality'); // Update formData
      } else if (_type === 'type') {
        value = selectedValue.value;
        handleInputChange(value, 'type'); // Update formData
      } else if (_type === 'homeType') {
        value = selectedValue.value;
        handleInputChange(value, 'homeType'); // Update formData
      }

      onChange && onChange(value, _type); // Assuming you still want to call the external onChange
    },
    [handleLocalityChange, onChange, handleInputChange],
  );

  const handleSubmit = useCallback(() => {
    // Copy formData
    const formattedFormData = {...formData};

    // Remove the undefined key
    delete formattedFormData.undefined;
    Object.keys(formattedFormData).forEach(key => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      formattedFormData[capitalizedKey] = formattedFormData[key];
      delete formattedFormData[key];
    });

    formattedFormData.MarketerID = auth()?.currentUser?.uid;

    // Validate formattedFormData
    if (
      !formattedFormData.Name ||
      !formattedFormData.Price ||
      !formattedFormData.ClientNumber ||
      !formattedFormData.HomeType ||
      !formattedFormData.Neighborhood ||
      !formattedFormData.Locality ||
      !formattedFormData.Sublocality ||
      !formattedFormData.Type
    ) {
      Alert.alert('Please fill out all required fields.');
      return;
    }

    fetch('https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/demands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedFormData),
    })
      .then(response => response.json())
      .then(() => {
        onClose();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [formData, onClose]);

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
              placeholder="Type where or what you want"
              fetchDetails
              styles={autoCompleteStyle}
              onPress={onComplete}
              query={query}
              textInputProps={textInputProps}
              // suppressDefaultStyles
              renderRow={renderRow}
            />
          ) : type === 'calender' ? (
            <View>
              <Text text="When are you moving in?" weight="bold" size="xl" />
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
              source={source}
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

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={padding20}>
                <Input
                  label="Name"
                  name="name"
                  type="text"
                  onChange={handleInputChange}
                  value={formData?.name}
                  placeholder="Enter your name"
                />

                <SizedBox height={20} />
                <Input
                  label="Price"
                  placeholder="Enter your budget"
                  name="price"
                  type="numeric"
                  value={formData?.price}
                  onChange={handleInputChange}
                />

                <SizedBox height={20} />

                <Input
                  label="Phone"
                  placeholder="Enter your phone number"
                  name="clientNumber"
                  type="phone-pad"
                  value={formData?.clientNumber}
                  onChange={handleInputChange}
                />

                <SizedBox height={20} />

                <Input
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Type what you want. The more details the better."
                  multiLine={1}
                  value={formData?.description}
                  onChange={handleInputChange}
                />

                <SizedBox height={20} />

                <Input
                  label="Neighborhood"
                  name="neighborhood"
                  type="text"
                  onChange={handleInputChange}
                  value={formData?.neighborhood}
                  placeholder="Type the exact place you want"
                />

                <SizedBox height={20} />

                <Dropdown
                  label="Select the home type you want"
                  data={hometypes}
                  name="homeType"
                  displayKey="value"
                  onChange={onChangeCallback('homeType')}
                  value={formData.homeType}
                />

                <Dropdown
                  label="Select whether you want to rent or buy"
                  name="type"
                  data={modes}
                  displayKey="value"
                  onChange={onChangeCallback('type')}
                  value={formData.type}
                />

                <Dropdown
                  label="Select the region you want"
                  name="localities"
                  placholder="Select a locality"
                  data={localities}
                  displayKey="name"
                  onChange={onChangeCallback('locality')}
                  value={formData.locality}
                />

                <Dropdown
                  label="Select the district you want"
                  name="subLocalities"
                  data={subLocalities}
                  displayKey="name"
                  onChange={onChangeCallback('sublocality')}
                  value={formData.sublocality}
                />

                <SizedBox height={20} />
                <Button type="primary" onPress={handleSubmit}>
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
