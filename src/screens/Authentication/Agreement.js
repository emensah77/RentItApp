import React, {useCallback} from 'react';
import {Image, BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Page, Button, Typography, Whitespace} from '../../components';
import logo from '../../assets/images/logo.png';
import {global} from '../../assets/styles';

const Agreement = ({marketerTerms}) => {
  const navigation = useNavigation();

  const goToLocation = useCallback(async () => {
    const authData = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
    await AsyncStorage.setItem(
      'authentication::data',
      JSON.stringify({...authData, agreement: true}),
    );

    // Conditional logic based on marketerTerms
    if (marketerTerms) {
      await AsyncStorage.setItem('marketerTermsAgreed', 'true');
      navigation.goBack();
    } else {
      navigation.replace('Location');
    }
  }, [navigation, marketerTerms]); // Include marketerTerms in the dependency array

  const marketerTermsText = `
    
    Date: 18th November, 2023
    Client: RentIt Ghana
    Contractor: Independent Contractor

    1. Scope of Work:
    The Contractor will perform data validation services for the Client, validating 50 homes per day, starting November 20, 2023, for one month.

    2. Compensation:
    The Client will pay the Contractor the agreed amount communicated, with 20% payment made after 2 weeks and the remainder paid after Contractor completion and verification of work as agreed upon.

    3. Term:
    This Agreement is effective from November 20, 2023, to December 20, 2023. The Client reserves the right to terminate this Agreement at will, with or without cause.

    4. Independent Contractor Status:
    The Contractor is engaged as an independent contractor, responsible for their own taxes, and not entitled to Client's employee benefits.

    5. Confidentiality:
    The Contractor must keep all obtained information confidential and not disclose it to third parties.

    6. Governing Law:
    This Agreement is governed by the laws of Ghana.    
  `;

  // Use conditional logic to display the correct terms
  const termsText = marketerTerms
    ? marketerTermsText
    : 'I agree to treat everyone in the Rentit community -- regardless of their race, religion, national origin, ethnicity, skin color, disability, sex, gender identity, sexual orientation or age -- with respect, and without judgment or bias.';

  return (
    <Page>
      <Image source={logo} style={global.largeIcon} />

      <Whitespace marginTop={40} />

      <Typography type="heading">
        {' '}
        {marketerTerms ? 'Terms of Employment' : 'Our community commitment'}
      </Typography>

      <Whitespace marginTop={8} />

      <Typography type="largeHeading">We want RentIt to be a great place for everyone</Typography>

      <Whitespace marginTop={24} />

      <Typography type="standard">
        To ensure this, we&apos;re asking you to commit to the following:
      </Typography>

      <Whitespace marginTop={24} />

      <Typography type="standard">{termsText}</Typography>

      <Whitespace marginTop={64} />

      <Button type="standard" onPress={goToLocation}>
        Agree and continue
      </Button>

      <Button type="primary" onPress={BackHandler.exitApp}>
        Decline
      </Button>
    </Page>
  );
};

export default Agreement;
