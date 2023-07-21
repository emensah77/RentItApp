import React, {useCallback, useEffect} from 'react';
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

  const userId = auth().currentUser.uid;

  const navigation = useNavigation();

  const route = useRoute();

  const finish = useCallback(async () => {
    if (!isFinal) {
      return;
    }

    const uploadedHome = await API.graphql(
      graphqlOperation(
        createPost,
        {
          input: {...oldData, ...data},
        },
        {
          id: undefined,
        },
      ),
    );

    // Sync with past searched
    const {address: a, title: t, description: d} = oldData;
    await fetch(
      `https://rentit.herokuapp.com/api/v1/emojis?search=${a}&homeId=${uploadedHome.data.createPost.id}&title=${t}&description=${d}&image=${oldData.imageUrls[0]}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).catch(e => console.error('An error occurred while trying to sync with past searches', e));

    // Clear progress data
    await fetch('https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        action: 'clear',
      }),
    }).catch(e => console.error('An error occurred while trying to clear progress data', e));
  }, [data, isFinal, userId]);

  const load = useCallback(async () => {
    const response = await fetch(
      `https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).catch(e => console.error('Error loading progress', e));

    const progressData = await response.json();
    console.debug('Onboarding Progress:', progressData);
  }, [userId]);

  const save = useCallback(async () => {
    if (!data) {
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

    await fetch('https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/', {
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
    }).catch(console.error);
  }, [data, route.name, userId]);

  const next = useCallback(async () => {
    await save();

    if (!isComplete) {
      return;
    }

    navigation.navigate(isFinal ? 'Home' : `OnboardingScreen${index + 1}`);
  }, [save, isComplete, navigation, isFinal, index]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    oldData = {...oldData, ...data};
    save();
    finish();
  }, [save, finish, data]);

  // console.log('Data:', index, data, oldData, userId);

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

              <Button accessibilityLabel="Get Started" type="standard" onPress={next}>
                Get Started
              </Button>
            </>
          ) : (
            <>
              <Progress total={total} progress={index} />

              <Divider top={25} bottom={15} />

              <Container row type="spaceBetween">
                <Button accessibilityLabel="Back" type="plain" onPress={navigation.goBack}>
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
