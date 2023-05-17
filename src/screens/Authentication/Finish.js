import React, {useState, useCallback, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import {Page, Input, Typography, Button, Whitespace, Container, Error} from '../../components';
import arrowDown from '../../assets/images/arrow-down.png';

const Finish = () => {
  const [oldData, setOldData] = useState({});
  const [newData, setNewData] = useState({
    email: '',
    phoneNumber: '',
    firstname: '',
    lastname: '',
    birthDay: '04/01/2023',
    password: '',
  });
  const [error, setError] = useState({
    general: '',
    email: '',
    password: '',
  });
  const [disabled, setDisabled] = useState(true);

  const navigation = useNavigation();

  const showError = useCallback(
    which => async value => {
      setError({...error, [which]: value});
    },
    [error],
  );

  const goToAgreement = useCallback(() => {
    navigation.navigate('Agreement');
  }, [navigation]);

  const onChangeData = useCallback(
    which => async value => {
      const _newData = {...newData, [which]: value};
      setNewData({..._newData});

      if (which === 'email' && /.+@.+\..+/.test(value)) {
        showError('email')('');
      } else if (which === 'email') {
        showError('email')('Enter a valid email address');
        _newData.email = '';
      } else if (
        which === 'password' &&
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{6,}$/.test(value)
      ) {
        showError('password')('');
      } else if (which === 'password') {
        showError('password')(
          'Password must have a minimum six characters, at least one letter, one number and one special character',
        );
        _newData.password = '';
      }

      await AsyncStorage.setItem('authentication::data', JSON.stringify({...oldData, ..._newData}));
      const {email, firstname, lastname, birthDay, password} = _newData;
      setDisabled(!email || !firstname || !lastname || !birthDay || !password);
    },
    [newData, oldData, showError],
  );

  const submit = useCallback(async () => {
    const {email, firstname, lastname, birthDay, password} = newData;

    if (!email || !firstname || !lastname || !birthDay || !password) {
      return showError('general')(
        'You need to fill in the form completely before you can continue.',
      );
    }

    await AsyncStorage.setItem('authentication::data', JSON.stringify({...newData}));
    goToAgreement();
  }, [newData, showError, goToAgreement]);

  useEffect(() => {
    (async () => {
      const data = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
      setOldData(data);
      setNewData(data);

      const {email, firstname, lastname, birthDay, password} = data;
      setDisabled(!email || !firstname || !lastname || !birthDay || !password);
    })();
  }, []);

  return (
    <Page header="Finish signing up">
      <Input
        placeholder="First name"
        type="text"
        name="firstname"
        label="First name"
        disabled={!!oldData.firstname}
        value={newData.firstname}
        onChange={onChangeData('firstname')}
        groupAfter
      />

      <Input
        placeholder="Last name"
        type="text"
        name="lastname"
        label="Last name"
        disabled={!!oldData.lastname}
        value={newData.lastname}
        onChange={onChangeData('lastname')}
        groupBefore
      />

      <Typography type="label">Make sure it matches the name on your government ID.</Typography>

      <Input
        placeholder="Birthday (mm/dd/yyyy)"
        type="date"
        name="birthDay"
        label="Birthday (mm/dd/yyyy)"
        disabled={!!oldData.birthDay}
        value={newData.birthDay}
        onChange={onChangeData('birthDay')}
        suffix={arrowDown}
      />

      <Typography type="label">
        To sign up, you need to be at least 18. Your birthday won&apos;t be shared with other people
        who use Rentit.
      </Typography>

      <Whitespace marginTop={30} />

      <Input
        placeholder="Email"
        type="email-address"
        name="email"
        disabled={!!oldData.email}
        value={newData.email}
        error={error.email}
        onChange={onChangeData('email')}
      />

      <Typography type="label">We&apos;ll email you trip confirmations and reciepts.</Typography>

      <Whitespace marginTop={30} />

      <Input
        placeholder="Password"
        type="password"
        name="password"
        value={newData.password}
        error={error.password}
        onChange={onChangeData('password')}
      />

      <Typography type="notice">
        By Selecting Agree and continue, I agree to Rentit&apos;s{' '}
        <Typography type="link">
          Terms of Service, Payments Terms of Service and Nondiscrimination Policy
        </Typography>{' '}
        and acknowledge the <Typography type="link">Privacy Policy.</Typography>
      </Typography>

      <Whitespace marginTop={30} />

      <Error text={error.general} />

      <Whitespace marginBottom={-20} />

      <Button type="standard" disabled={disabled} onPress={submit}>
        Agree and continue
      </Button>

      <Typography type="label">
        Rentit will send you members-only deals, inspiration, marketing emails, and push
        notifications. You can opt out of receiving these at any time in your account settings or
        directly from the marketing notification.
      </Typography>

      <Whitespace marginBottom={20} />

      <Container row type="spaceBetween">
        <Input type="checkbox" name="checkbox" onChange={onChangeData('marketing')} />
        <Typography type="inline" width="auto">
          {' '}
          I don&apos;t want to receive marketing messages from Rentit.
        </Typography>
      </Container>
    </Page>
  );
};

export default Finish;
