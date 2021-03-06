/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import 'react-native-gesture-handler';
 import SplashScreen from 'react-native-splash-screen'
import React, {useEffect} from 'react';
import * as Sentry from "@sentry/react-native";
import { Settings } from 'react-native-fbsdk-next';

Sentry.init({
  dsn: "https://885eb00f1fb24206a506bef30f3bc2b1@o1224815.ingest.sentry.io/6369972",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 0.8,
});

import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import awsconfig from './src/aws-exports';
import HomeScreen from './src/screens/Home';
import Post from './src/components/Post';
import feed from './assets/data/feed';
import SearchResultsScreen from './src/screens/SearchResults';
import DestinationSearchScreen from './src/screens/DestinationSearch';
import GuestsScreen from './src/screens/GuestsScreen';
import Router from './src/navigation/Router';
import { withAuthenticator } from 'aws-amplify-react-native';
import { Authenticator } from 'aws-amplify-react-native/dist/Auth';
import Amplify from '@aws-amplify/core';
import Onboarding from './src/screens/Onboarding';
import Providers from './src/navigation/Providers';
import ActivityLoader from './src/components/ActivityLoader';
import Geocoder from 'react-native-geocoding';
import { AmplifyTheme } from "aws-amplify-react-native";
Amplify.configure(awsconfig);
Geocoder.init("AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys");


const myTheme = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%',
    backgroundColor: '#FFF',
    padding: 10,
  },
  
  section: {
    flex: 1,
    width: '100%',
    padding: 30,
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 32,
  },
  sectionHeaderText: {
    color: "blue",
    fontSize: 20,
    fontWeight: '500',
  },
  sectionFooter: {
    width: '70%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 1,
    marginBottom: 10,
  },
  
  sectionFooterLink: {
    fontSize: 14,
    color: 'blue',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-evenly'
  },
  navBar: {
    marginTop: 35,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navButton: {
    marginLeft: 12,
    borderRadius: 40,
    
  },
  
  
  button: {
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 16,
    borderRadius: 50,
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 16,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formField: {
    marginBottom: 22,
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 80,
    borderColor: '#C4C4C4',
  },
  inputLabel: {
    marginBottom: 8,
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  phoneInput: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderRadius: 40,
    borderColor: '#C4C4C4',
  },
  picker: {
    flex: 1,
    height: 44,
  },
  pickerItem: {
    height: 44,
  },
});


const post1 = feed[0];
const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  throw new Error("My first Sentry error!");
  return (
    
   
    <View style={styles.sectionContainer}>
      
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
    useEffect(() => {
      SplashScreen.hide();
    })
  return (
    <>
      
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/*<ActivityLoader/>*/}        
      
        <Providers/>
      
      
      
      {/*<Router />*/}
      
      
      
      </>
  );
};


export default Sentry.wrap(App);

