import React, {useState, useCallback, useMemo} from 'react';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-community/google-signin';
import {appleAuth, appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken, Profile} from 'react-native-fbsdk-next';

import {Button, Page, Error} from '../../components';
import emailImg from '../../assets/images/social/email.png';
import appleImg from '../../assets/images/social/apple.png';
import googleImg from '../../assets/images/social/google.png';
import facebookImg from '../../assets/images/social/facebook.png';

const Social = props => {
  const {noEmail, isPage} = props;

  const [error, setError] = useState('');

  const navigation = useNavigation();

  const Wrapper = useMemo(() => (isPage ? Page : React.Fragment), [isPage]);

  const goTo = useCallback(
    (route, deactivatable) => {
      navigation.navigate(route, deactivatable ? {deactivatable: true} : undefined);
    },
    [navigation],
  );

  const setDataFromProvider = useCallback(
    async data => {
      await AsyncStorage.setItem('authentication::data', JSON.stringify(data));
      goTo('Finish', true);
    },
    [goTo],
  );

  const apple = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        // Configure the request
        await appleAuthAndroid.configure({
          clientId: 'com.example.client-android',
          redirectUri: 'https://example.com/auth/callback',
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: new Date().getTime(),
          state: undefined,
        });

        // Open the browser window for user sign in
        const response = await appleAuthAndroid.signIn();
        // console.log('res', response);
        const {email, fullName} = response;
        return {
          email,
          firstname: fullName?.givenName,
          lastname: fullName?.familyName,
          // Apple doesn't provide these
          phoneNumber: '',
          birthDay: '',
        };
      } else if (Platform.OS === 'ios') {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
          return {
            error: 'An error occurred while trying to authenticate you.',
            details: {appleAuthRequestResponse},
          };
        }

        // Create a Firebase credential from the response
        const {email, fullName} = appleAuthRequestResponse;
        // console.log('appleAuthRequestResponse', appleAuthRequestResponse);

        return {
          email,
          firstname: fullName?.givenName,
          lastname: fullName?.familyName,
          // Apple doesn't provide these:
          phoneNumber: '',
          birthDay: '',
          profilePicture: '',
        };
      }
    } catch (e) {
      return {error: e.message, details: {e, json: JSON.stringify(e)}};
    }
  }, []);

  const google = useCallback(async () => {
    try {
      // Get the users ID token
      const signinResponse = await GoogleSignin.signIn();
      if (!signinResponse.idToken) {
        return {error: 'Failed to sign you in via Google', details: {signinResponse}};
      }

      const currentUser = await GoogleSignin.getCurrentUser();
      if (!currentUser) {
        return {
          error: 'An error occurred while trying to authenticate you.',
          details: {currentUser, signinResponse},
        };
      }

      const {
        user: {email, givenName, familyName, photo},
      } = currentUser;
      return {
        email,
        firstname: givenName,
        lastname: familyName,
        profilePicture: photo,
        // Google doesn't provide these:
        phoneNumber: '',
        birthDay: '',
      };
    } catch (e) {
      return {error: e.message, details: {e, json: JSON.stringify(e)}};
    }
  }, []);

  const facebook = useCallback(async () => {
    try {
      // Attempt login with permissions
      const permissionsResponse = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (permissionsResponse.isCancelled) {
        return {
          error: 'Failed to sign you in via Facebook.',
          details: {permissionsResponse},
        };
      }

      // Once signed in, get the users AccesToken
      const accessTokenResponse = await AccessToken.getCurrentAccessToken();
      if (!accessTokenResponse) {
        return {
          error: 'An error occurred while trying to authenticate you.',
          details: {accessTokenResponse, permissionsResponse},
        };
      }

      const currentUser = await Profile.getCurrentProfile();
      if (!currentUser) {
        return {
          error: 'An error occurred while trying to authenticate you.',
          details: {accessTokenResponse, permissionsResponse, currentUser},
        };
      }

      const {
        user: {email, givenName, familyName},
      } = currentUser;
      return {
        firstname: givenName,
        lastname: familyName,
        // Facebook doesn't provide these:
        email: Platform.OS === 'android' ? '' : email,
        phoneNumber: '',
        birthDay: '',
        profilePicture: '',
      };
    } catch (e) {
      return {error: e.message, details: {e, json: JSON.stringify(e)}};
    }
  }, []);

  const authenticate = useCallback(
    platform => async () => {
      let response;
      if (platform === 'email') response = await goTo('Email');
      if (platform === 'apple') response = await apple();
      if (platform === 'google') response = await google();
      if (platform === 'facebook') response = await facebook();

      if (response?.error) {
        console.error('3rd Party Auth Error:', response);
        return setError(response.error);
      } else if (response) {
        setDataFromProvider(response);
      }
    },
    [goTo, apple, google, facebook, setDataFromProvider],
  );

  return (
    <Wrapper>
      <Error text={error} />

      {!noEmail && (
        <Button type="primary" prefix={emailImg} onPress={authenticate('email')}>
          Continue with Email
        </Button>
      )}

      {appleAuthAndroid.isSupported && (
        <Button type="primary" prefix={appleImg} onPress={authenticate('apple')}>
          Continue with Apple
        </Button>
      )}

      <Button type="primary" prefix={googleImg} onPress={authenticate('google')}>
        Continue with Google
      </Button>

      <Button type="primary" prefix={facebookImg} onPress={authenticate('facebook')}>
        Continue with Facebook
      </Button>
    </Wrapper>
  );
};

export default Social;
