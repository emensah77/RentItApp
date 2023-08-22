import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {API, graphqlOperation} from 'aws-amplify';

import Progress from './Progress';

import {createPost} from '../../graphql/mutations';
import {
  Page,
  Container,
  CardDisplay,
  Whitespace,
  Button,
  Typography,
  Divider,
} from '../../components';

import {pageInnerHorizontalPadding} from '../../assets/styles/global';
import arrowLeft from '../../assets/images/arrow-left.png';

let oldData = {};
const Base = props => {
  const {inline, isComplete, isFinal, data, index, total = 7, title, children, label} = props;

  const [progressData, setProgressData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const userId = auth().currentUser.uid;

  const navigation = useNavigation();

  const route = useRoute();

  const skip = useCallback(async () => {
    if (!isComplete) {
      return;
    }

    let params;
    if (progressData) {
      params = {...progressData.progressData};
    }

    navigation.navigate(
      isFinal
        ? 'Home'
        : (progressData && progressData.screenName) || `OnboardingScreen${index + 1}`,
      params,
    );
  }, [isComplete, progressData, navigation, isFinal, index]);

  const load = useCallback(async () => {
    if (index !== 1) {
      return;
    }

    const response = await fetch(
      `https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).catch(e => console.error('Error loading progress', e));

    const _data = await response.json();
    console.debug('Onboarding Progress Data Loaded:', _data);

    if (_data.progressData) {
      oldData = {..._data.progressData};
    }

    if (_data.screenName) {
      setProgressData(_data);
    }
  }, [userId, index]);

  const save = useCallback(async () => {
    if (!data || !isComplete) {
      return;
    }

    __DEV__ &&
      console.debug(
        'Updating Progress',
        JSON.stringify({
          userId,
          progress: {
            screenName: route.name,
            progressData: {...oldData, ...data},
          },
        }),
      );

    const response = await fetch(
      'https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          progress: {
            screenName: route.name,
            progressData: {...oldData, ...data},
          },
        }),
      },
    ).catch(e => console.error('An error occurred while trying to save progress data', e));

    __DEV__ && console.debug('Response for Progress Update', await response.json());
  }, [data, isComplete, route.name, userId]);

  const transformDataForAPI = useCallback(data => {
    // Basic transformations
    const transformedData = {
      newPrice: data.price,
      type: data.homeType,
      currency: [data.currency],
      bed: data.bedCount,
      maxGuests: data.bedRoomCount,
      bedroom: data.bedRoomCount,
      bathroomNumber: data.bathRoomsCount,
      images: data.imageUrls,
      phoneNumbers: [data.phoneNumber],
      marketerNumber: [data.marketerNumber],
      status: 'PENDING',
      image: data.imageUrls[0],
      userID: auth().currentUser.uid,
      amenities: data.amenities,
      ...data, // Add all other fields from the original data
    };

    // Amenities transformations
    const amenitiesMapping = {
      wifi: 'Wifi',
      kitchen: 'Kitchen',
      bathroom: 'Bathroom',
      water: 'Water',
      toilet: 'Toilet',
      aircondition: 'Aircondition',
    };

    Object.keys(amenitiesMapping).forEach(key => {
      transformedData[key] = data.amenities.includes(amenitiesMapping[key]) ? 'Yes' : 'No';
    });

    // Remove old keys
    delete transformedData.price;
    delete transformedData.homeType;
    delete transformedData.bedCount;
    delete transformedData.bedRoomCount;
    delete transformedData.bathRoomsCount;
    delete transformedData.imageUrls;
    delete transformedData.phoneNumber;

    return transformedData;
  }, []);

  const clear = useCallback(async () => {
    // Clear progress data
    const response = await fetch(
      'https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'clear',
        }),
      },
    ).catch(e => console.error('An error occurred while trying to clear progress data', e));

    if (response.ok) {
      oldData = {};
      setProgressData(undefined);
      setTimeout(() => next());
    }

    const _data = await response.json();
    __DEV__ && console.debug('Response for Progress Update', _data);
  }, [next, userId]);

  const finish = useCallback(async () => {
    setIsLoading(true);

    if (!isFinal || !isComplete) {
      return;
    }
    const mergedData = {...oldData, ...data}; // Merge the old data with the new data
    const transformedData = transformDataForAPI(mergedData); // Transform the data for the API

    const uploadedHome = await API.graphql(
      graphqlOperation(
        createPost,
        {
          input: transformedData,
        },
        {
          id: undefined,
        },
      ),
    );

    alert('Your home has been submitted successfully! We will review and approve it if '); // Simple alert to notify the user

    // Sync with past searched
    const {address: a, title: t, description: d} = oldData;
    const h = uploadedHome.data.createPost.id;
    const i = oldData.imageUrls[0];
    await fetch(
      `https://rentit.herokuapp.com/api/v1/emojis?search=${a}&homeId=${h}&title=${t}&description=${d}&image=${i}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).catch(e => console.error('An error occurred while trying to sync with past searches', e));

    clear();
    setIsLoading(false);

    navigation.navigate('Home');
  }, [data, isFinal, isComplete, clear]);

  const back = useCallback(async () => {
    if (index - 1 <= 0) {
      navigation.goBack();
    }
    navigation.navigate(`OnboardingScreen${index - 1}`);
  }, [index, navigation]);

  const next = useCallback(async () => {
    await skip();
    await save();
  }, [skip, save]);

  useEffect(() => {
    oldData = {...oldData, ...data};

    (async () => {
      await load();
      await save();
    })();
  }, [load, save, data]);

  return (
    <Page
      inline={inline}
      leftIcon={arrowLeft}
      header={
        <Container row type="right">
          <Container row type="chipSmall" color="#FFF" width={110}>
            <CardDisplay numberOfLines={1} description="Save & exit" center bold />
          </Container>

          <Whitespace marginLeft={pageInnerHorizontalPadding / 2} />

          <Container row type="chipSmall" color="#FFF" width={110}>
            <CardDisplay numberOfLines={1} description="FAQs" center bold />
          </Container>

          <Whitespace marginLeft={pageInnerHorizontalPadding / 2} />
        </Container>
      }
      footer={
        <>
          {index === 1 ? (
            <>
              <Divider top={25} bottom={15} />

              {progressData ? (
                <Container row type="spaceBetween">
                  <Button accessibilityLabel="Continue" type="plain" onPress={skip}>
                    Continue
                  </Button>

                  <Button accessibilityLabel="Start New Listing" type="standard" onPress={clear}>
                    Start New Listing
                  </Button>
                </Container>
              ) : (
                <Button accessibilityLabel="Get Started" type="standard" onPress={next}>
                  Get Started
                </Button>
              )}
            </>
          ) : index === 16 ? ( // Check if we are on OnboardingScreen16
            <>
              <Progress total={total} progress={index} />

              <Divider top={25} bottom={15} />

              <Container row type="spaceBetween">
                <Button accessibilityLabel="Back" type="plain" onPress={back}>
                  Back
                </Button>

                <Button
                  accessibilityLabel="Finish"
                  type="standard"
                  disabled={!isComplete}
                  loading={isLoading}
                  onPress={finish}>
                  {' '}
                  {/* Call the finish function */}
                  Finish
                </Button>
              </Container>
            </>
          ) : (
            <>
              <Progress total={total} progress={index} />

              <Divider top={25} bottom={15} />

              <Container row type="spaceBetween">
                <Button accessibilityLabel="Back" type="plain" onPress={back}>
                  Back
                </Button>

                <Button
                  accessibilityLabel="Next"
                  type="standard"
                  disabled={!isComplete}
                  onPress={next}>
                  Next
                </Button>
              </Container>
            </>
          )}
        </>
      }>
      {title ? (
        <>
          <Typography height={30} type="heading" size={26} color="#1F2D3D" width="100%">
            {title}
          </Typography>

          <Typography type="notice" weight="400" size={14} color="#4D4D4D" width="100%">
            {label}
          </Typography>

          <Whitespace marginTop={69} />
        </>
      ) : null}

      {children}

      <Whitespace marginTop={25} />
    </Page>
  );
};

export default Base;
