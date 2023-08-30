import React, {useMemo, useState, useCallback, useEffect} from 'react';
import {PhoneNumberUtil} from 'google-libphonenumber';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import the auth function

import Base from './Base';
import PhoneNumber from '../Authentication/PhoneNumber';
import {Typography} from '../../components';

const OnboardingScreen14 = props => {
  const {
    route: {
      params: {phoneNumber} = {
        phoneNumber: '',
      },
    },
  } = props;

  const [data, setData] = useState({phoneNumber});
  const [isMarketer, setIsMarketer] = useState(false);

  const {
    currentUser: {uid}, // Destructure uid from currentUser
  } = auth();

  const initialValues = useMemo(() => {
    if (phoneNumber) {
      const phoneUtil = PhoneNumberUtil.getInstance();
      const parsed = phoneUtil.parse(phoneNumber);

      return {code: `${parsed.getCountryCode()}`, phoneNumber: `${parsed.getNationalNumber()}`};
    }
    return {code: '', phoneNumber: ''};
  }, [phoneNumber]);

  const onChangeData = useCallback(_phoneNumber => {
    setData(prevData => ({...prevData, phoneNumber: _phoneNumber}));
  }, []);

  const onChangeMarketerData = useCallback(_phoneNumber => {
    setData(prevData => ({...prevData, marketerNumber: _phoneNumber}));
  }, []);

  useEffect(() => {
    const checkMarketer = async () => {
      const doc = firestore().collection('users').doc(uid);
      const docSnapshot = await doc.get().catch(console.error);
      if (docSnapshot) {
        const u = docSnapshot.data();
        if (u && u.marketer_status === 'ACCEPTED') {
          setIsMarketer(true);
        } else {
          setIsMarketer(false);
        }
      }
    };

    checkMarketer();
  }, [uid]);

  return (
    <Base
      index={14}
      total={17}
      isComplete={!!data.phoneNumber}
      data={data}
      title="What's your phone number?"
      label="We will call to verify the number">
      <PhoneNumber
        inline
        initialPhoneNumber={initialValues.phoneNumber}
        initialCountryCode="233"
        onChangeData={onChangeData}
      />
      {isMarketer && (
        <>
          <Typography>Add Marketer Number</Typography>
          <PhoneNumber initialCountryCode="233" inline onChangeData={onChangeMarketerData} />
        </>
      )}
    </Base>
  );
};

export default OnboardingScreen14;
