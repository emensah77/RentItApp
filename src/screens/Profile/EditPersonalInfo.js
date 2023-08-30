import React, {useState, useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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

    const userRef = firestore().collection('users').doc(auth().currentUser.uid);
    userRef
      .set(
        {
          fname: data.firstname,
          lname: data.lastname,
          gender: data.gender.value,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
        {merge: true},
      )
      .then(() => {
        setLoading(false);
        getUserDetails();
      })
      .catch(e => {
        setLoading(false);
        console.error(
          'Something went wrong with updating the user in firestore: ',
          e,
          JSON.stringify(e),
        );
      });
  }, [
    data.email,
    data.firstname,
    data.gender.value,
    data.lastname,
    data.phoneNumber,
    disabled,
    getUserDetails,
  ]);

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

    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          const userData = doc.data();
          setData({
            firstname: userData.fname,
            lastname: userData.lname,
            gender: {value: userData.gender},
            email: userData.email,
            phoneNumber: userData.phoneNumber,
          });

          setHidden({
            email: `${userData.email.substring(0, 1)}${new Array(
              userData.email.length - userData.email.substring(userData.email.indexOf('@')).length,
            ).join('*')}${userData.email.substring(userData.email.indexOf('@'))}`,
            phoneNumber: `${userData.phoneNumber.substring(0, 4)}${new Array(
              userData.phoneNumber.length - 7,
            ).join('*')}${userData.phoneNumber.substr(-3)}`,
          });
        } else {
        }
      })
      .catch(e => {
        console.error(
          'Something went wrong with fetching the user from firestore: ',
          e,
          JSON.stringify(e),
        );
      });
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
