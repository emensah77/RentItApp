// import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react';
// import {Image, Text} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import PhoneInput from 'react-native-phone-number-input';

// import {Page, Typography, Button, Divider} from '../../components';
// import {global, typography} from '../../assets/styles';
// import arrowDown from '../../assets/images/arrow-down.png';
// import email from '../../assets/images/social/email.png';
// import apple from '../../assets/images/social/apple.png';
// import google from '../../assets/images/social/google.png';
// import facebook from '../../assets/images/social/facebook.png';

// const PhoneNumber = () => {
//   const [data, setData] = useState({});
//   const [error, setError] = useState('');
//   const [open, setOpen] = useState(false);
//   const [disabled, setDisabled] = useState(true);
//   const [country, setCountry] = useState({});
//   const [countries, setCountries] = useState([]);
//   const phoneInput = useRef(null);
//   const countryPickerProps = useMemo(
//     () => ({
//       withAlphaFilter: true,
//       withCountryNameButton: true,
//       renderFlagButton: () => (
//         <>
//           <Text style={[global.inputLabel, typography.regular]}>Country/Region</Text>
//           <Text style={[typography.notice, typography.left, global.fullWidth]}>
//             {country?.name
//               ? `${country?.name} (+${country?.callingCode?.join(',')})`
//               : 'Afghanistan (+93)'}
//           </Text>
//           <Image source={arrowDown} style={global.groupSuffix} />
//         </>
//       ),
//     }),
//     [country?.callingCode, country?.name],
//   );

//   const onChange = useCallback(async value => {
//     const phoneNumber = value.replace('.', '');
//     // const phoneUtil = PhoneNumberUtil.getInstance();
//     if (
//       // !phoneUtil.isValidNumberForRegion(
//       //   phoneUtil.parse(`${country.countryCallingCodes[0]}${phoneNumber}`, country.alpha2),
//       //   country.alpha2,
//       // ) ||
//       Number.isNaN(phoneNumber)
//     ) {
//       setDisabled(true);
//       setError('Enter your valid mobile number without the country code.');
//     } else {
//       setDisabled(false);
//       setData(() => ({phoneNumber}));
//     }
//   }, []);

//   const submit = useCallback(async () => {}, []);

//   useEffect(() => {
//     (async () => {
//       const response = await fetch('https://restcountries.com/v2/all');
//       setCountries(await response.json());
//     })();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       await AsyncStorage.setItem('authentication::data', JSON.stringify(data));
//       setDisabled(false);
//     })();
//   }, [data]);

//   return (
//     <Page header="Log in or sign up">
//       <PhoneInput
//         ref={phoneInput}
//         defaultValue={data.phoneNumber}
//         defaultCode="GH"
//         onChangeText={onChange}
//         // onChangeFormattedText={(...text) => {
//         //   console.log(...text);
//         // }}
//         disableArrowIcon
//         layout=""
//         onChangeCountry={setCountry}
//         countryPickerProps={countryPickerProps}
//         withShadow
//         autoFocus
//         countryPickerButtonStyle={[global.input, global.groupAfter]}
//         containerStyle={[global.column, global.zeroElevation, global.fullWidth]}
//         textContainerStyle={[global.input, global.groupBefore]}
//       />

//       <Typography type="label">
//         We&apos;ll call or text to confirm your number. Standard message and data rates apply.
//       </Typography>

//       <Button type="standard" disabled={disabled} onPress={submit}>
//         Continue
//       </Button>

//       <Divider>or</Divider>

//       <Button type="primary" prefix={email}>
//         Continue with Email
//       </Button>

//       <Button type="primary" prefix={apple}>
//         Continue with Apple
//       </Button>

//       <Button type="primary" prefix={google}>
//         Continue with Google
//       </Button>

//       <Button type="primary" prefix={facebook}>
//         Continue with Facebook
//       </Button>
//     </Page>
//   );
// };

// export default PhoneNumber;
