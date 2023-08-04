import React, {useState, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Page,
  Whitespace,
  Divider,
  Typography,
  CardDisplay,
  Input,
  Dropdown,
  Button,
  Container,
} from '../../components';
import arrowDown from '../../assets/images/arrow-down.png';
import {TYPES} from '../../utils';

const EditPersonalInfo = () => {
  const {currentUser} = auth();

  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    gender: {value: 'Male'},
    email: '',
    phoneNumber: '',
  });
  const [hidden, setHidden] = useState({
    email: '',
    phoneNumber: '',
  });
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const goTo = useCallback(
    route => () => {
      navigation.navigate(route, {returnTo: 'EditPersonalInfo'});
    },
    [navigation],
  );

  const submit = useCallback(async () => {
    if (disabled) {
      return;
    }

    setLoading(true);
    const authData = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    await AsyncStorage.setItem(
      'authentication::data',
      JSON.stringify({...authData, gender: data.gender.value}),
    );

    currentUser
      .updateProfile({
        displayName: `${data.firstname} ${data.lastname}`,
        gender: data.gender.value,
        email: data.email,
        phoneNumber: data.phoneNumber,
      })
      .then(async () => {
        const user = await firestore().collection('users').doc(auth().currentUser.uid).get();
        return firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .set({
            ...user.data(),
            fname: data.firstname,
            lname: data.lastname,
            gender: data.gender.value,
            email: data.email,
            phoneNumber: data.phoneNumber,
          })
          .then(() => {
            setLoading(false);
          })
          .catch(e => {
            setLoading(false);
            console.error(
              'Something went wrong with updating (set) the user in firestore: ',
              e,
              JSON.stringify(e),
            );
          });
      })
      .catch(e => {
        console.error(
          'Something went wrong with updating (updateProfile) the user in firestore: ',
          e,
          JSON.stringify(e),
        );
      });
  }, [currentUser, data, disabled]);

  const change = useCallback(
    which => value => {
      setData({
        ...data,
        [which]: value,
      });
    },
    [data],
  );

  const getUserDetails = useCallback(async () => {
    if (!currentUser) {
      return;
    }

    const authData = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    if (authData) {
      setData({...authData, gender: {value: authData.gender || ''}});

      setHidden({
        email: `${authData.email.substring(0, 1)}${new Array(
          authData.email.length - authData.email.substring(authData.email.indexOf('@')).length,
        ).join('*')}${authData.email.substring(authData.email.indexOf('@'))}`,
        phoneNumber: `${authData.phoneNumber.substring(0, 4)}${new Array(
          authData.phoneNumber.length - 7,
        ).join('*')}${authData.phoneNumber.substr(-3)}`,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    setDisabled(!Object.keys(data).some(item => !!data[item]));

    return navigation.addListener('focus', () => {
      getUserDetails();
    });
  }, [navigation, getUserDetails, data]);

  return (
    <Page
      type="large"
      header="Edit personal info"
      footer={
        <>
          <Divider top={20} bottom={10} />

          <Container row type="spaceBetween">
            <Button accessibilityLabel="Back" type="plain" onPress={getUserDetails}>
              Reset
            </Button>

            <Button
              accessibilityLabel="Next"
              type="standard"
              loading={loading}
              disabled={disabled}
              onPress={submit}>
              Save
            </Button>
          </Container>
        </>
      }>
      <Whitespace marginTop={36} />

      <Input
        placeholder="First name"
        type="email-address"
        value={data.firstname}
        onChange={change('firstname')}
      />

      <Whitespace marginTop={20} />

      <Input
        placeholder="Last name"
        type="email-address"
        value={data.lastname}
        onChange={change('lastname')}
      />

      <Dropdown
        data={TYPES.GENDERS}
        displayKey="value"
        label="Gender"
        suffix={arrowDown}
        value={data.gender.value}
        onChange={change('gender')}
      />

      <Divider top={20} bottom={10} />

      <CardDisplay
        description="Email"
        date={hidden.email}
        onPress={goTo('Email')}
        suffix={
          <Typography type="link" color="#252525">
            Edit
          </Typography>
        }
        spaceBetween
      />

      <Divider top={20} bottom={10} />

      <CardDisplay
        description="Phone numbers"
        onPress={goTo('PhoneNumber')}
        date="For notifications, reminders, and help logging in."
        spaceBetween
      />

      <Whitespace marginTop={20} />

      <CardDisplay
        description={hidden.phoneNumber}
        onPress={goTo('PhoneNumber')}
        suffix={
          <Typography type="link" color="#252525">
            Edit
          </Typography>
        }
        spaceBetween
      />

      <Whitespace marginTop={30} />

      <Button type="secondary" color="transparent" fitWidth onPress={goTo('PhoneNumber')}>
        Add another phone number
      </Button>
    </Page>
  );
};

export default EditPersonalInfo;
