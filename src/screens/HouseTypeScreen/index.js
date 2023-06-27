import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import styles from './styles.js';

import CloseIcon from '../../../assets/data/images/icons/close-icon.png';

import CircleButton from '../../componentsV2/Inputs/CircleButton';
import Typography from '../../componentsV2/DataDisplay/Typography';
import SuggestionRow from '../DestinationSearch/SuggestionRow';
import SearchIcon from '../../../assets/data/images/icons/search-icon.svg';
import CalendarWrapper from '../../componentsV2/Inputs/CalendarWrapper';
import {extractDate} from '../../utils/formatter';
import PlusMinus from '../../componentsV2/Inputs/PlusMinus';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const HouseTypeScreen = props => {
  const navigation = useNavigation();
  const route = useRoute();

  const [showLocationSearch, setShowLocationSearch] = useState(true);
  const [viewPort, setViewPort] = useState(null);
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [sublocality, setSubLocality] = useState('');

  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState({startDate: null, endDate: null});

  const fromObj = dates.startDate ? extractDate(new Date(dates.startDate)) : null;
  const toObj = dates.endDate ? extractDate(new Date(dates.endDate)) : null;

  const [showGuests, setShowGuests] = useState(false);

  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [petsCount, setPetsCount] = useState(0);

  const ref = useRef();

  const renderRow = useCallback(item => <SuggestionRow item={item} />, []);

  const autoComplete = useCallback(
    async (_, details = null) => {
      setViewPort(details.geometry.viewport);
      setLocality(details.address_components[0].short_name);
      setAddress(details.address_components[0].long_name);
      if (details.address_components?.[1]) {
        setSubLocality(details.address_components[1].short_name);
      }

      setShowLocationSearch(false);
      if (!dates.startDate || !dates.endDate) {
        setShowCalendar(true);
      }
    },
    [dates],
  );

  return (
    <SafeAreaView style={{height: '100%'}}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <CircleButton
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            image={<Image source={CloseIcon} width={20} height={20} />}
          />
          <View>
            <Typography bold variant="large" style={{borderBottomWidth: 1}}>
              Stays
            </Typography>
          </View>
        </View>
        {showLocationSearch && !showCalendar && (
          <View style={[styles.content]}>
            <Typography bold variant="xlarge">
              Where to?
            </Typography>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.searchContent}>
              <SearchIcon width={16} height={16} style={styles.searchIcon} />

              <GooglePlacesAutocomplete
                placeholder="Search destinations"
                ref={ref}
                onPress={autoComplete}
                fetchDetails
                styles={{
                  textInput: styles.searchInput,
                }}
                query={{
                  key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
                  language: 'en',

                  components: 'country:gh',
                }}
                suppressDefaultStyles
                renderRow={renderRow}
              />
            </KeyboardAvoidingView>
          </View>
        )}
        {locality && !showLocationSearch && (
          <View style={[styles.content, styles.contentMin, styles.contentTop]}>
            <Typography>Where</Typography>
            <Pressable>
              <Typography bold>{locality}</Typography>
            </Pressable>
          </View>
        )}

        {!showCalendar && (
          <View style={[styles.content, styles.contentMin]}>
            <Typography>When</Typography>
            <Pressable onPress={() => setShowCalendar(true)}>
              <Typography bold>
                {fromObj && toObj
                  ? `${fromObj.day} ${fromObj.month === toObj.month ? '' : fromObj.month} - ${
                      toObj.day
                    } ${toObj.month}`
                  : 'Any week'}
              </Typography>
            </Pressable>
          </View>
        )}
        {showCalendar && (
          <View style={[styles.content, styles.contentMin, styles.contentActive]}>
            <Typography bold variant="xlarge">
              When’s your trip?
            </Typography>
            <View style={styles.switcher}>
              <Pressable style={[styles.switcherItem, styles.switcherItemActive]}>
                <Typography>Choose dates</Typography>
              </Pressable>
              <Pressable style={styles.switcherItem}>
                <Typography>I'm flexible</Typography>
              </Pressable>
            </View>
            <CalendarWrapper
              onChange={({startDate, endDate}) => {
                setDates({startDate, endDate});

                if (startDate && endDate) {
                  setShowCalendar(false);
                  setShowGuests(true);
                }
              }}
            />
          </View>
        )}

        {!showGuests && (
          <View style={[styles.content, styles.contentMin]}>
            <Typography>Who</Typography>
            <Pressable onPress={() => setShowGuests(true)}>
              <Typography bold>Any guests</Typography>
            </Pressable>
          </View>
        )}

        {showGuests && (
          <View style={[styles.content, styles.contentMin, styles.contentActive]}>
            <Typography bold variant="xlarge">
              Who’s coming?
            </Typography>
            <View style={styles.counterInfoWrapper}>
              <View>
                <Typography bold>Adults</Typography>
                <Typography variant="small">Ages 13 and above</Typography>
              </View>
              <PlusMinus value={adultsCount} min={1} onChange={value => setAdultsCount(value)} />
            </View>
            <View style={styles.counterInfoWrapper}>
              <View>
                <Typography bold>Children</Typography>
                <Typography variant="small">Ages 2-12</Typography>
              </View>
              <PlusMinus
                value={childrenCount}
                min={0}
                onChange={value => setChildrenCount(value)}
              />
            </View>
            <View style={styles.counterInfoWrapper}>
              <View>
                <Typography bold>Infants</Typography>
                <Typography variant="small">Under 2</Typography>
              </View>
              <PlusMinus value={infantsCount} min={0} onChange={value => setInfantsCount(value)} />
            </View>
            <View style={styles.counterInfoWrapper}>
              <View>
                <Typography bold>Pets</Typography>
                <Typography variant="small" style={{textDecorationLine: 'underline'}}>
                  Bringing a service animal?
                </Typography>
              </View>
              <PlusMinus value={petsCount} min={0} onChange={value => setPetsCount(value)} />
            </View>
          </View>
        )}
      </View>
      <View style={styles.bottomWrapper}>
        <BottomActionsBar
          leftText="Clear all"
          rightText="Search"
          leftAction={() => {
            setShowLocationSearch(true);
            setShowCalendar(false);
            setShowGuests(false);
          }}
          rightAction={() => {
            navigation.navigate('Home', {
              screen: 'Explore',
              params: {
                screen: 'SearchResults',
                params: {
                  guests: {
                    adultsCount,
                    childrenCount,
                    infantsCount,
                    petsCount,
                  },
                  dates,
                  location: {
                    viewPort,
                    locality,
                    sublocality,
                    address,
                  },
                },
              },
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HouseTypeScreen;
