import React, {useMemo, useState, useCallback} from 'react';
import {PhoneNumberUtil} from 'google-libphonenumber';

import Base from './Base';
import PhoneNumber from '../Authentication/PhoneNumber';

const OnboardingScreen14 = props => {
  const {
    route: {
      params: {phoneNumber} = {
        phoneNumber: '',
      },
    },
  } = props;

  const [data, setData] = useState({phoneNumber});

  const initialValues = useMemo(() => {
    if (phoneNumber) {
      const phoneUtil = PhoneNumberUtil.getInstance();
      const parsed = phoneUtil.parse(phoneNumber);

      return {code: `${parsed.getCountryCode()}`, phoneNumber: parsed.getNationalNumber()};
    }
    return {code: '', phoneNumber: ''};
  }, [phoneNumber]);

  const onChangeData = useCallback(_phoneNumber => {
    setData({phoneNumber: _phoneNumber});
  }, []);

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
        initialCountryCode={initialValues.code}
        onChangeData={onChangeData}
      />
    </Base>
  );
};

export default OnboardingScreen14;
