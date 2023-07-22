import React, {useState, useCallback, useMemo, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Base from './Base';

import {Container, Whitespace, CardDisplay, Typography, Button, Input} from '../../components';

const OnboardingScreen15 = () => {
  const [selected, setSelected] = useState('');
  const [data, setData] = useState();
  const [user, setUser] = useState(null);
  const [usersWithPrivileges, setUsersWithPrivileges] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [homeownerName, setHomeownerName] = useState('');
  const [availableForRent, setAvailableForRent] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState(null);

  const isAdmin = useMemo(
    () =>
      usersWithPrivileges.includes(auth().currentUser.uid) || user?.marketer_status === 'ACCEPTED',
    [usersWithPrivileges, user],
  );

  const items = useMemo(
    () => [
      {
        title: 'Loyalty Home',
        description: 'You have given a loyalty package to this homeowner',
      },
      {
        title: 'Negotiable',
        description: 'Price can be negotiated with the home owner',
      },
      {
        title: 'Furnished',
        description: 'Property comes with furniture and amenities',
      },
    ],
    [],
  );

  const onToggleSelection = useCallback(
    title => () => {
      let item = [];
      if (selected.includes(title)) {
        item = selected.filter(s => s !== title);
      } else {
        item = [...selected, title];
      }
      setSelected(item);
    },
    [selected],
  );

  const getUserDetails = useCallback(async () => {
    const {currentUser} = auth();
    if (currentUser) {
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      if (userDoc.exists) {
        setUser(userDoc.data());
      }
    }
  }, []);

  const getUsersWithPrivileges = useCallback(async () => {
    try {
      const callers = await firestore().collection('usersWithPrivileges');
      callers.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setUsersWithPrivileges(prev => [...prev, doc.data().userId]);
        });
      });
    } catch (e) {
      console.error('An error occurred while retreiving privileged users', e);
    }
  }, []);

  const toggleDatePicker = useCallback(() => {
    setDatePickerVisibility(!isDatePickerVisible);
  }, [isDatePickerVisible]);

  const setAvailability = useCallback(
    value => () => {
      setAvailableForRent(value);
      if (!value) {
        toggleDatePicker();
      }
    },
    [toggleDatePicker],
  );

  useEffect(() => {
    getUserDetails();
    getUsersWithPrivileges();
  }, [getUserDetails, getUsersWithPrivileges]);

  useEffect(() => {
    setData({
      loyaltyProgram: selected.includes('Loyalty Home') ? 'Yes' : 'No',
      negotiable: selected.includes('Negotiable') ? 'Yes' : 'No',
      furnished: selected.includes('Furnished') ? 'Yes' : 'No',
      available: availableForRent ? 'Yes' : 'No',
      availabilityDate,
      homeownerName,
    });
  }, [availabilityDate, availableForRent, homeownerName, selected]);

  return (
    <Base index={15} total={17} isComplete={!!data} data={data} title="Your home is?">
      {items.map(({title, description}) => (
        <React.Fragment key={title}>
          {title !== 'Loyalty Home' || (title === 'Loyalty Home' && isAdmin) ? (
            <Container
              type={`chip${selected.includes(title) ? '' : 'De'}Selected`}
              color="#FFF"
              height={100}
              width="100%"
              onPress={onToggleSelection(title)}>
              <CardDisplay
                name={
                  <Typography left size={18} weight="700" width="100%">
                    {title}
                  </Typography>
                }
                status={
                  <Typography numberOfLines={1} left size={14} weight="500" width="200%">
                    {description}
                  </Typography>
                }
                center
                bold
                onPress={onToggleSelection(title)}
              />
            </Container>
          ) : null}

          <Whitespace marginTop={33} />
        </React.Fragment>
      ))}

      <Whitespace marginTop={45} />

      <Typography type="notice" left width="100%" size={18} weight="700">
        Enter the homeowner&apos;s name
      </Typography>

      <Whitespace marginTop={25} />

      <Input
        placeholder="Homeowner's name"
        type="text"
        value={homeownerName}
        onChange={setHomeownerName}
      />

      <Whitespace marginTop={65} />

      <Typography type="notice" left width="100%" size={18} weight="700">
        Is your home available for rent
      </Typography>

      <Whitespace marginTop={25} />

      <Container row type="spaceBetween" width="70%">
        <Button accessibilityLabel="Yes" type="plain" onPress={setAvailability(true)}>
          Yes
        </Button>

        <Input
          buttonType="standard"
          label="No"
          hideValue
          type="date"
          value={availabilityDate}
          onChange={setAvailabilityDate}
        />
      </Container>
    </Base>
  );
};

export default OnboardingScreen15;
