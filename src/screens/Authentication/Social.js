import React, {useState, useCallback, useMemo} from 'react';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-community/google-signin';
import {appleAuth, appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken, Profile} from 'react-native-fbsdk-next';

import {Button, Page, Error} from '../../components';
import emailImg from '../../assets/images/social/email.png';
import appleImg from '../../assets/images/social/apple.png';
import googleImg from '../../assets/images/social/google.png';
// import facebookImg from '../../assets/images/social/facebook.png';

const Social = props => {
  const {noEmail, isPage} = props;

  const [error, setError] = useState('');

  const navigation = useNavigation();

  const Wrapper = useMemo(() => (isPage ? Page : React.Fragment), [isPage]);

  const goTo = useCallback(
    route => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const setDataFromProvider = useCallback(
    async (provider, data) => {
      if (!data) {
        return;
      }

      await AsyncStorage.setItem('authentication::data', JSON.stringify({...data, provider}));

      const query = await firestore()
        .collection('users')
        .where('email', '==', data.email)
        .get()
        .catch(console.error);
      let route = 'Notification';
      if (query && query.docs && query.docs.length > 0) {
        const {_data} = query.docs[0];
        const {
          fname: firstname,
          lname: lastname,
          email: _email,
          phoneNumber,
          birthDay,
          userImg: profilePicture,
          marketing,
          agreement,
          notification,
        } = _data;

        await AsyncStorage.setItem(
          'authentication::data',
          JSON.stringify({
            ...data,
            provider,
            email: _email,
            firstname,
            lastname,
            birthDay,
            phoneNumber,
            profilePicture,
            marketing,
            agreement,
            notification,
          }),
        );

        if (!notification) {
          route = 'Notification';
        }

        if (!agreement) {
          route = 'Agreement';
        }

        if (!_email || !firstname || !lastname || !birthDay) {
          route = 'Finish';
        }
      }
      goTo(route);
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
        const {identityToken, nonce, email, fullName, user: newUser} = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
          email,
          newUser,
        );

        return {
          email,
          firstname: fullName?.givenName,
          lastname: fullName?.familyName,
          // Apple doesn't provide these:
          phoneNumber: '',
          birthDay: '',
          profilePicture: '',
          providerCredential: appleCredential,
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

      const googleCredential = auth.GoogleAuthProvider.credential(signinResponse.idToken);

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
        providerCredential: googleCredential,
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

      const facebookCredential = auth.FacebookAuthProvider.credential(
        accessTokenResponse.accessToken,
      );

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
        providerCredential: facebookCredential,
      };
    } catch (e) {
      return {error: e.message, details: {e, json: JSON.stringify(e)}};
    }
  }, []);

  const authenticate = useCallback(
    provider => async () => {
      let response;
      if (provider === 'email') response = await goTo('Email');
      if (provider === 'apple') response = await apple();
      if (provider === 'google') response = await google();
      if (provider === 'facebook') response = await facebook();

      if (response?.error) {
        console.error('3rd Party Auth Error:', response);
        setError(response.error);
      } else if (response) {
        setDataFromProvider(provider, response);
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

      {Platform.OS === 'ios' && appleAuthAndroid.isSupported && (
        <Button type="primary" prefix={appleImg} onPress={authenticate('apple')}>
          Continue with Apple
        </Button>
      )}

      <Button type="primary" prefix={googleImg} onPress={authenticate('google')}>
        Continue with Google
      </Button>

      {/* <Button type="primary" prefix={facebookImg} onPress={authenticate('facebook')}>
        Continue with Facebook
      </Button> */}
    </Wrapper>
  );
};

export default Social;
