import React, {useState, useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {PhoneNumberUtil} from 'google-libphonenumber';

import {Page, Input, Typography, Button, Dropdown, Whitespace} from '../../../components';
import arrowDown from '../../../assets/images/arrow-down.png';

const ReadyToPay = () => {
  const [paymentType, setPaymentType] = useState('');
  const [amount, setAmount] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const paymentTypes = useMemo(() => ['Rent', 'S'], []);

  const goToOTP = useCallback(
    data => {
      navigation.navigate('OTP', data);
    },
    [navigation],
  );

  const submit = useCallback(async () => {
    goToOTP();
    setLoading(false);
  }, [goToOTP]);

  const onPhoneNumberChange = useCallback(async _phoneNumber => {
    setPhoneNumber(_phoneNumber);

    if (_phoneNumber.length <= 3) return;

    const phoneUtil = PhoneNumberUtil.getInstance();
    if (
      !(phoneUtil.parse(_phoneNumber, 'ZZ') || phoneUtil.IsPossibleNumber(_phoneNumber, 'ZZ')) &&
      !Number.isNaN(_phoneNumber)
    ) {
      setDisabled(false);
      setError('');
    } else {
      setDisabled(true);
      setError('Enter your valid mobile number without the country code.');
    }
  }, []);

  // const onAmountChange = useCallback(item => {
  //   console.log(item);
  // }, []);

  return (
    <Page type="large" header="Ready to pay">
      <Typography type="notice" left width="100%">
        Select the type of payment and type in the amount to pay.
      </Typography>

      <Whitespace marginTop={55} />

      <Typography type="heading" weight="400" width="100%">
        Payment Type
      </Typography>

      <Whitespace marginTop={-15} />

      <Dropdown
        value={paymentType}
        data={paymentTypes}
        displayKey="value"
        label="Select type of payment"
        suffix={arrowDown}
        onChange={setPaymentType}
      />

      <Whitespace marginTop={35} />

      <Typography type="heading" weight="400" width="100%">
        Amount
      </Typography>

      <Whitespace marginTop={10} />

      <Input
        placeholder="Type in the payment amount"
        type="numeric"
        value={amount}
        onChange={setAmount}
      />

      <Whitespace marginTop={26} />

      <Typography type="label">
        Enter you mobile money number. This is the same number you will use to make payments
      </Typography>

      <Whitespace marginTop={9} />

      <Input
        placeholder="Type in the phone number"
        type="phone-pad"
        value={phoneNumber}
        onChange={onPhoneNumberChange}
        error={error}
      />

      <Whitespace marginTop={26} />

      <Button loading={loading} type="standard" disabled={disabled} onPress={submit}>
        Submit
      </Button>
    </Page>
  );
};

export default ReadyToPay;
