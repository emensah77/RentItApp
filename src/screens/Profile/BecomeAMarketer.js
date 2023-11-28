import React, {useState, useEffect, useCallback, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {Page, Typography, Button, Whitespace, Dropdown, CardDisplay} from '../../components';

const BecomeAMarketer = () => {
  const [status, setStatus] = useState({
    state: 'not-requested',
    description:
      'You can request to admin to become a marketer, once the admin approves your request, enjoy the experience of being a marketer at Rentit.',
  });
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  const assignSupervisor = useCallback(async supervisor => {
    if (!supervisor) return; // guard clause to ensure supervisor is available

    const {uid} = auth().currentUser;
    const userDoc = firestore().collection('users').doc(uid);
    try {
      await userDoc.update({supervisor_id: supervisor.id});
    } catch (error) {
      console.error('Error updating supervisor:', error);
    }
  }, []);

  const handleSupervisorSelection = useCallback(
    supervisor => {
      setSelectedSupervisor(supervisor);
      assignSupervisor(supervisor); // pass supervisor directly
    },
    [assignSupervisor],
  );
  const leftImageUri = useMemo(
    () => (selectedSupervisor ? {uri: selectedSupervisor.userImg} : null),
    [selectedSupervisor],
  );

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
    const fetchData = async () => {
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
      if (user.supervisor_id) {
        const supervisorDoc = await firestore().collection('users').doc(user.supervisor_id).get();
        if (supervisorDoc.exists) {
          setSelectedSupervisor({
            ...supervisorDoc.data(),
            id: supervisorDoc.id,
          });
        }
      }
      setLoading(false);
    };

    fetchData();

    const fetchSupervisors = async () => {
      const snapshot = await firestore()
        .collection('users')
        .where('role', '==', 'SUPERVISOR')
        .get();

      if (!snapshot.empty) {
        const supervisorData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setSupervisors(supervisorData);
      }
    };

    fetchSupervisors();
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

      {status.state === 'successful' && (
        <Dropdown
          data={supervisors}
          displayKey="fname"
          imageKey="userImg"
          value={selectedSupervisor?.fname}
          label="Select a Supervisor"
          onChange={handleSupervisorSelection}
        />
      )}

      <Whitespace marginTop={36} />
      <Typography type="levelOneThick">Your Supervisor Details</Typography>
      <Whitespace marginTop={36} />

      {selectedSupervisor && (
        <>
          <CardDisplay
            spaceBetween
            prefix
            leftImageSrc={leftImageUri}
            name={selectedSupervisor.fname}
            description={`Contact: ${selectedSupervisor.phoneNumber}`}
            leftImageWidth={50}
            leftImageHeight={50}
          />
        </>
      )}

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
