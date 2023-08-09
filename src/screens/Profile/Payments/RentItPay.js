import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {PhoneNumberUtil} from 'google-libphonenumber';
import firestore from '@react-native-firebase/firestore';

import {Page, Input, Typography, Button, Dropdown, Whitespace} from '../../../components';
import arrowDown from '../../../assets/images/arrow-down.png';

const RentItPay = () => {
  const [data, setData] = useState({paymentType: {value: ''}, amount: '', phoneNumber: ''});
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

  const onChangeData = useCallback(
    type => async _data => {
      setData(oldData => ({...oldData, [type]: _data}));

      if (type === 'phoneNumber') {
        if (_data.length <= 3) return;

        const phoneUtil = PhoneNumberUtil.getInstance();
        if (!phoneUtil.isPossibleNumberString(`+${_data}`, 'ZZ') || Number.isNaN(_data)) {
          setError('Enter your valid mobile number including the country code.');
          return setDisabled(true);
        }
      }

      setError('');
      return setDisabled(!data.phoneNumber || data.amount <= 0 || !data.paymentType.value);
    },
    [data],
  );

  return (
    <Page type="large" header="RentIt Pay">
      <Typography type="notice" left width="100%">
        Select the type of payment and type in the amount to pay.
      </Typography>

      <Whitespace marginTop={55} />

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

      <Whitespace marginTop={26} />

      <Typography type="label">
        Enter you mobile money number. This is the same number you will use to make payments
      </Typography>

      <Whitespace marginTop={9} />

      <Input
        placeholder="Type in the phone number"
        type="phone-pad"
        value={data.phoneNumber}
        onChange={onChangeData('phoneNumber')}
        error={error}
      />

      <Whitespace marginTop={26} />

      <Button type="standard" disabled={disabled} onPress={goToPayments}>
        Submit
      </Button>
    </Page>
  );
};

export default RentItPay;
