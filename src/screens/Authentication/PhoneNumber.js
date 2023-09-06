import React, {useState, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {PhoneNumberUtil} from 'google-libphonenumber';
import auth from '@react-native-firebase/auth';
import {startCase, camelCase} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Social from './Social';

import {Page, Input, Typography, Button, Divider, Dropdown} from '../../components';
import {usePreviousValue} from '../../utils';
import arrowDown from '../../assets/images/arrow-down.png';

const PhoneNumber = props => {
  const {
    route: {params: {returnTo = ''} = {}} = {},
    inline,
    onChangeData,
    initialCountryCode = '',
    initialPhoneNumber = '',
  } = props;

  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [country, setCountry] = useState({code: initialCountryCode});
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ranOnce, setRanOnce] = useState(false);

  const navigation = useNavigation();

  const goToOTP = useCallback(
    data => {
      navigation.navigate('OTP', {...data, returnTo});
    },
    [navigation, returnTo],
  );

  const submit = useCallback(async () => {
    setLoading(true);
    if (error || !phoneNumber) {
      setLoading(false);
      return;
    }
    const _phoneNumber = `+${country.code}${phoneNumber}`;
    const confirmation = await auth()
      .verifyPhoneNumber(_phoneNumber)
      .catch(e => {
        console.error(
          'Something went wrong with phone number verification: ',
          e,
          JSON.stringify(e),
        );
        switch (e.code) {
          case 'auth/too-many-requests':
            setError('Too many retrails. Try again');
            break;
          default:
            setError(e.message);
            break;
        }
      });
    if (confirmation) {
      goToOTP({confirmation, phoneNumber: _phoneNumber});
    } else {
      setError('We were unable to verify your phone number. Try again.');
    }
    setLoading(false);
  }, [error, goToOTP, country, phoneNumber]);

  const getRowLabel = useCallback(
    _country => `(+${_country.callingCodes?.[0]}) ${_country?.name}`,
    [],
  );

  const onPhoneNumberChange = useCallback(
    async (_phoneNumber, _country) => {
      setPhoneNumber(_phoneNumber);

      if (_phoneNumber.length <= 3) return;

      const phoneUtil = PhoneNumberUtil.getInstance();
      const newCountry = _country || country;
      if (
        phoneUtil.isValidNumberForRegion(
          phoneUtil.parse(`+${newCountry.code}${_phoneNumber}`, newCountry.alpha2Code),
          newCountry.alpha2Code,
        ) &&
        !Number.isNaN(_phoneNumber)
      ) {
        setDisabled(false);
        setError('');
        if (inline) {
          onChangeData(`+${newCountry?.code}${_phoneNumber}`);
        }
      } else {
        setDisabled(true);
        setError('Enter your valid mobile number without the country code.');
        if (inline) {
          onChangeData('');
        }
      }
    },
    [country, inline, onChangeData],
  );

  const onCountryChange = useCallback(
    _country => {
      const code = _country.callingCodes?.[0];
      setCountry({
        ..._country,
        code,
        name:
          code.length + _country?.name.length > 30
            ? `${_country?.name.substring(0, 25)}...`
            : _country?.name,
      });
      onPhoneNumberChange(phoneNumber, {
        ..._country,
        code,
        name:
          code.length + _country?.name.length > 30
            ? `${_country?.name.substring(0, 25)}...`
            : _country?.name,
      });
    },
    [onPhoneNumberChange, phoneNumber],
  );

  const prevInitialPhoneNumber = usePreviousValue(initialPhoneNumber);

  useEffect(() => {
    // Run once if the previous value of the initial phone number was falsy
    // but it's current value is truthsy
    if (!ranOnce && !prevInitialPhoneNumber && !!initialPhoneNumber) {
      setRanOnce(true);
      setPhoneNumber(initialPhoneNumber);

      const phoneUtil = PhoneNumberUtil.getInstance();
      let phoneNumberLib;
      try {
        phoneNumberLib = phoneUtil.parse(initialPhoneNumber);
      } catch (e) {
        try {
          phoneNumberLib = phoneUtil.parse(`+${initialCountryCode}${initialPhoneNumber}`);
        } catch (err) {
          console.error(
            'An error occured while parsing the initial phone number:',
            initialCountryCode,
            initialPhoneNumber,
            e,
            err,
          );
        }
      }

      if (
        !phoneNumberLib ||
        (phoneNumberLib && !phoneNumberLib.getCountryCode()) ||
        (phoneNumberLib && phoneNumberLib.getCountryCode() !== '+')
      ) {
        return;
      }
      setCountry({code: phoneNumberLib.getCountryCode()});
    }
  }, [initialPhoneNumber, initialCountryCode, prevInitialPhoneNumber, ranOnce]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let countryData = JSON.parse((await AsyncStorage.getItem('country::data')) || '[]');
        if (countryData.length === 0) {
          const response = await fetch('https://restcountries.com/v2/all');
          countryData = await response.json();
          await AsyncStorage.setItem('country::data', JSON.stringify(countryData));
        }
        const defaultCountry =
          countryData.find(_country => _country.callingCodes?.[0] === initialCountryCode) ||
          countryData?.[0];
        const code = defaultCountry?.callingCodes?.[0];
        setCountry({
          ...defaultCountry,
          code,
          name:
            code.length + defaultCountry?.name.length > 30
              ? `${defaultCountry?.name.substring(0, 25)}...`
              : defaultCountry?.name,
        });
        setCountries(countryData);
      } catch (e) {
        console.error(e, new Error().stack);
        setError(
          'An error occurred with parsing the countries. Check your internet connection and try again',
        );
      }
      setLoading(false);
    })();
  }, [initialCountryCode]);

  return (
    <Page header={startCase(camelCase(returnTo)) || 'Sign up'} inline={inline}>
      <Dropdown
        onChange={onCountryChange}
        value={country.name ? `(+${country.code}) ${country.name}` : ''}
        data={countries}
        displayKey="name"
        getRowLabel={getRowLabel}
        imageKey="flags.png"
        label="Country/Region"
        suffix={arrowDown}
        groupAfter
      />

      <Input
        placeholder="Phone number"
        type="phone-pad"
        value={phoneNumber}
        onChange={onPhoneNumberChange}
        error={error}
        trim
        groupBefore
      />

      {!inline && (
        <>
          <Typography type="label">
            We&apos;ll call or text to confirm your number. Standard message and data rates apply.
          </Typography>

          <Button loading={loading} type="standard" disabled={disabled} onPress={submit}>
            Continue
          </Button>

          {!returnTo && (
            <>
              <Divider>or</Divider>

              <Social />
            </>
          )}
        </>
      )}
    </Page>
  );
};

export default PhoneNumber;
