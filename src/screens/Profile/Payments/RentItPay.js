import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {PhoneNumberUtil} from 'google-libphonenumber';
import firestore from '@react-native-firebase/firestore';

import {Page, Input, Typography, Button, Dropdown, Whitespace} from '../../../components';
import arrowDown from '../../../assets/images/arrow-down.png';
import PhoneNumber from '../../Authentication/PhoneNumber';

const RentItPay = ({route}) => {
  const {subscription = false} = route.params || {};
  const [data, setData] = useState({paymentType: {value: ''}, amount: '', phoneNumber: ''});
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [names, setNames] = useState([]);

  const navigation = useNavigation();

  const paymentTypes = useMemo(
    () => [
      {value: 'Financing'},
      {value: 'Rent'},
      {value: 'Viewing Fee'},
      {value: 'Processing Fee'},
    ],
    [],
  );

  useEffect(() => {
    if (subscription) {
      setData(prevData => ({
        ...prevData,
        amount: '20',
        paymentType: {value: 'Subscription'},
      }));
    }
  }, [subscription]);

  const goToPayments = useCallback(() => {
    navigation.navigate('Home', {
      screen: 'Explore',
      params: {
        screen: 'Payment',
        params: {
          totalAmount: parseFloat(data.amount),
          selectedType: data.paymentType.value,
          checkoutNumber: data.phoneNumber,
          homelatitude: '',
          homelongitude: '',
          homeimage: '',
          hometitle: '',
          homebed: '',
          homeyears: '',
          homeMonths: '',
          homeWeeks: '',
          homeDays: '',
          homeid: '',
          marketerName: data.marketer ? data.marketer.name : '',
        },
      },
    });
  }, [navigation, data]);

  // Fetch marketers in real-time
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('marketer_status', '==', 'ACCEPTED')
      .onSnapshot(snapshot => {
        const uids = new Set(); // to track unique uids
        const marketers = snapshot.docs
          .map(doc => ({
            id: doc.data().uid,
            name: doc.data().displayName,
            ...doc.data(),
          }))
          .filter(marketer => marketer.id && !uids.has(marketer.id))
          .filter(marketer => {
            if (uids.has(marketer.id)) {
              return false;
            } else {
              uids.add(marketer.id);
              return true;
            }
          });

        setNames(marketers);
      });

    return () => unsubscribe();
  }, []);

  const isPhoneNumberValid = phoneNumber => {
    if (phoneNumber.length <= 3) return false;

    const phoneUtil = PhoneNumberUtil.getInstance();
    return phoneUtil.isPossibleNumberString(`+${phoneNumber}`, 'ZZ') && !Number.isNaN(phoneNumber);
  };

  // Update the disabled state based on data validity
  useEffect(() => {
    const isAmountValid = data.amount > 0;
    const isPhoneNumberCorrect = data.phoneNumber && isPhoneNumberValid(data.phoneNumber);
    const isPaymentTypeSelected = data.paymentType.value !== '';

    const isDisabled = !isAmountValid || !isPhoneNumberCorrect || !isPaymentTypeSelected;
    setDisabled(isDisabled);
  }, [data]);

  const onChangeData = useCallback(
    type => _data => {
      setData(oldData => ({...oldData, [type]: _data}));

      if (type === 'phoneNumber') {
        if (!isPhoneNumberValid(_data)) {
          setError('Enter your valid mobile number including the country code.');
          return;
        }
      }

      setError('');
    },
    [],
  );

  return (
    <Page type="large" header="RentIt Pay">
      {subscription ? (
        <>
          <Typography type="notice" left width="100%">
            Type in your phone number to pay.
          </Typography>
          <Whitespace marginTop={55} />
        </>
      ) : (
        <>
          <Typography type="notice" left width="100%">
            Select the type of payment and type in the amount to pay.
          </Typography>

          <Whitespace marginTop={55} />
        </>
      )}

      {subscription ? (
        <>
          <Typography type="heading" weight="400" width="100%">
            Amount
          </Typography>

          <Whitespace marginTop={10} />

          <Input placeholder="Amount" type="numeric" value={data.amount} editable={false} />
        </>
      ) : (
        <>
          <Typography type="heading" weight="400" width="100%">
            Payment Type
          </Typography>

          <Whitespace marginTop={-15} />

          <Dropdown
            value={data.paymentType.value}
            data={paymentTypes}
            displayKey="value"
            label="Select type of payment"
            suffix={arrowDown}
            onChange={onChangeData('paymentType')}
          />

          <Whitespace marginTop={35} />

          <Typography type="heading" weight="400" width="100%">
            Choose a Marketer
          </Typography>

          <Whitespace marginTop={-15} />

          <Dropdown
            value={data.marketer?.name || ''}
            data={names}
            displayKey="name"
            label="Select a marketer"
            suffix={arrowDown}
            onChange={onChangeData('marketer')}
          />

          <Whitespace marginTop={35} />

          <Typography type="heading" weight="400" width="100%">
            Amount
          </Typography>

          <Whitespace marginTop={10} />

          <Input
            placeholder="Type in the payment amount"
            type="numeric"
            value={data.amount}
            onChange={onChangeData('amount')}
          />
        </>
      )}

      <Whitespace marginTop={26} />

      <Typography type="label">
        Enter your mobile money number. This is the same number you will use to make payments.
      </Typography>

      <Whitespace marginTop={9} />

      <PhoneNumber
        inline={true}
        onChangeData={onChangeData('phoneNumber')}
        initialCountryCode="233" // Set initial country code if required
      />

      <Whitespace marginTop={26} />

      <Button type="standard" disabled={disabled} onPress={goToPayments}>
        Submit
      </Button>
    </Page>
  );
};

export default RentItPay;
