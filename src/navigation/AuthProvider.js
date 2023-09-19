import React, {createContext, useEffect, useState, useMemo} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import firestore from '@react-native-firebase/firestore';

import mixpanel from '../MixpanelConfig';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const setMixpanelUserProperties = currentUser => {
    // Identify the user with a unique ID
    mixpanel.identify(currentUser.uid);

    // Set user properties
    mixpanel.people.set({
      $email: currentUser.email,
      $name: currentUser.displayName,
      // Add any other user properties you want to track
    });
  };

  useEffect(() => {
    const authListener = auth().onAuthStateChanged(newUser => {
      if (newUser) {
        setUser(newUser);
        setMixpanelUserProperties(newUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      // Unsubscribe the listener when the component is unmounted
      authListener();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      login: async (email, password) => {
        try {
          await auth().signInWithEmailAndPassword(email, password);
          mixpanel.track('User Login', {method: 'Email'});
        } catch (e) {
          console.error(e);
        }
      },
      googleLogin: async () => {
        try {
          const {idToken} = await GoogleSignin.signIn();
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
          setLoading(true);
          await auth().signInWithCredential(googleCredential);
          const {currentUser} = auth();
          setMixpanelUserProperties(currentUser);
          mixpanel.track('User Login', {method: 'Google'});
          setLoading(false);
        } catch (error) {
          console.error({error});
        }
      },
      appleLogin: async () => {
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });

          if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identify token returned');
          }

          const {identityToken, nonce, email, user: newUser} = appleAuthRequestResponse;
          const appleCredential = auth.AppleAuthProvider.credential(
            identityToken,
            nonce,
            email,
            newUser,
          );

          setLoading(true);
          await auth().signInWithCredential(appleCredential);
          const {currentUser} = auth();
          setMixpanelUserProperties(currentUser);
          mixpanel.track('User Login', {method: 'Apple'});
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      },
      fbLogin: async () => {
        try {
          const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

          if (result.isCancelled) {
            throw new Error('User cancelled the login process');
          }

          const data = await AccessToken.getCurrentAccessToken();

          if (!data) {
            throw new Error('Something went wrong obtaining access token');
          }

          const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
          setLoading(true);
          await auth().signInWithCredential(facebookCredential);
          mixpanel.track('User Login', {method: 'Facebook'});
          setLoading(false);
        } catch (error) {
          console.error({error});
        }
      },
      register: async (email, password) => {
        try {
          await auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .set({
                  fname: '',
                  lname: '',
                  email,
                  createdAt: firestore.Timestamp.fromDate(new Date()),
                  userImg: null,
                })
                .catch(error => {
                  console.error('Something went wrong with adding user to firestore: ', error);
                });
            })
            .catch(error => {
              console.error('Something went wrong with sign up: ', error);
            });
          mixpanel.track('User Registration', {method: 'Email'});
        } catch (e) {
          console.error(e);
        }
      },
      logout: async () => {
        try {
          await auth().signOut();
        } catch (e) {
          console.error(e);
        }
      },
      updateProfile: async data => {
        setUser({...user, _user: {...user._user, ...data}});
        await auth().currentUser.updateProfile({...data});
        firestore()
          .collection('users')
          .doc(user?._user?.uid)
          .update({...data});
      },
    }),
    [user],
  );

  if (loading) {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator animating size="large" color="blue" style={styles.activityOpacity} />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const styles = StyleSheet.create({
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  activityOpacity: {opacity: 1},
});
