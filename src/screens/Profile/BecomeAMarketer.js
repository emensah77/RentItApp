import React, {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {Page, Typography, Button, Whitespace} from '../../components';

const BecomeAMarketer = () => {
  const [status, setStatus] = useState({
    state: 'not-requested',
    description:
      'You can request to admin to become a marketer, once the admin approves your request, enjoy the experience of being a marketer at Rentit.',
  });
  const [loading, setLoading] = useState(false);

  const request = useCallback(async () => {
    setLoading(true);

    const {uid} = auth().currentUser;
    const doc = firestore().collection('users').doc(uid);
    const user = await doc.get().catch(console.error);
    if (user && user.marketer_status === 'REVIEW') {
      return;
    }

    const authData = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    await AsyncStorage.setItem(
      'authentication::data',
      JSON.stringify({...authData, marketer_status: 'REVIEW'}),
    );

    setStatus({
      color: '#F29F23',
      state: 'pending',
      description:
        'Your request has been submitted, once the admin approves your request, enjoy the experience of being a marketer at Rentit.',
    });

    await doc.set({...user.data(), marketer_status: 'REVIEW'}).catch(e => {
      console.error('An error occured with your request to become a marketer', e);

      setStatus({
        color: '#F00',
        state: 'error',
        description: 'An error occured with your request to become a marketer. Try again.',
      });
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const {uid} = auth().currentUser;
      let user = await firestore().collection('users').doc(uid).get();
      user = user.data();
      if (user.marketer_status === 'REVIEW') {
        setLoading(false);
        return setStatus({
          color: '#F29F23',
          state: 'pending',
          description:
            'Your request has been submitted, once the admin approves your request, enjoy the experience of being a marketer at Rentit.',
        });
      }

      if (user.marketer_status === 'ACCEPTED') {
        setStatus({
          color: '#3C8826',
          state: 'successful',
          description: 'Your Marketer request has been approved successfully.',
        });
      } else {
        setStatus({
          color: '#194CC3',
          state: 'not-requested',
          description:
            'You can request to admin to become a marketer, once the admin approves your request, enjoy the experience of being a marketer at Rentit.',
        });
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Page type="large" header="Become a marketer">
      <Whitespace marginTop={35} />

      <Typography type="heading" weight="400" width="100%">
        Why become a marketer?
      </Typography>

      <Whitespace marginTop={23} />

      <Typography type="notice" width="100%">
        Rentit Marketers are the core of the community of the homeowners we are building. You will
        work primarily in your community to connect us with homeowners.
      </Typography>

      <Whitespace marginTop={21} />

      <Typography type="notice" width="100%" color={status.color}>
        {status.description}
      </Typography>

      <Whitespace marginTop={36} />

      {status.state !== 'successful' ? (
        <Button
          color={status.state === 'not-requested' ? '#000' : status.color}
          disabled={status.state !== 'not-requested'}
          type="tertiary"
          onPress={request}
          loading={loading}
          fitWidth>
          {status.state === 'pending' ? 'In Review' : 'Request Now'}
        </Button>
      ) : null}
    </Page>
  );
};

export default BecomeAMarketer;
