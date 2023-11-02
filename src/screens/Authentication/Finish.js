import React, {useState, useCallback, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import PhoneNumber from './PhoneNumber';

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
    which => value => {
      setNewData(prevNewData => {
        const updatedNewData = {...prevNewData, [which]: value};

        // Perform validation inside the updater function
        if (which === 'email' && /.+@.+\..+/.test(value)) {
          setError(prevError => ({...prevError, email: ''}));
        } else if (which === 'email') {
          setError(prevError => ({...prevError, email: 'Enter a valid email address'}));
          updatedNewData.email = ''; // Clear the invalid email
        } else if (
          which === 'password' &&
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(value)
        ) {
          setError(prevError => ({...prevError, password: ''}));
        } else if (which === 'password') {
          setError(prevError => ({
            ...prevError,
            password:
              'Password must have a minimum six characters, at least one letter, one number and one special character',
          }));
          updatedNewData.password = ''; // Clear the invalid password
        }

        // After validation, determine if the 'Agree and continue' button should be disabled
        const isDisabled =
          !updatedNewData.email ||
          !updatedNewData.firstname ||
          !updatedNewData.lastname ||
          !updatedNewData.birthDay ||
          !(updatedNewData.provider ? updatedNewData.phoneNumber : updatedNewData.password);
        setDisabled(isDisabled);

        // Save the updated data to AsyncStorage
        AsyncStorage.setItem('authentication::data', JSON.stringify(updatedNewData)).catch(err => {
          console.error('Failed to save data to AsyncStorage:', err);
        });

        // Return the updated state
        return updatedNewData;
      });
    },
    [],
  );

  const submit = useCallback(async () => {
    // No need to destructure newData here since we're using it directly
    setDisabled(true); // Prevent multiple submissions

    if (
      !newData.email ||
      !newData.firstname ||
      !newData.lastname ||
      !newData.birthDay ||
      !(newData.provider ? newData.phoneNumber : newData.password)
    ) {
      showError('general')('You need to fill in the form completely before you can continue.');
      setDisabled(false); // Re-enable submission if there's an error
      return;
    }

    // Since we're not updating newData here, we can avoid the async function and AsyncStorage call
    goToAgreement();
  }, [newData, goToAgreement, showError]);

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

      <Typography type="label">We&apos;ll email you trip confirmations and receipts.</Typography>

      <Whitespace marginTop={30} />

      {oldData.provider ? (
        <PhoneNumber inline onChangeData={onChangeData('phoneNumber')} />
      ) : (
        <Input
          placeholder="Password"
          type="password"
          name="password"
          value={newData.password}
          error={error.password}
          onChange={onChangeData('password')}
        />
      )}

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
