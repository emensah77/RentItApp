import React, {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {Page, Input, Button} from '../../components';

const Email = props => {
  const {
    route: {
      params: {confirmation, phoneNumber, returnTo},
    },
  } = props;
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const goToFinish = useCallback(() => {
    navigation.navigate(returnTo || 'Finish');
  }, [navigation, returnTo]);

  const submit = useCallback(async () => {
    setLoading(true);
    if (error || !otp) {
      setLoading(false);
      return;
    }

    const verified = auth.PhoneAuthProvider.credential(confirmation?.verificationId, otp);
    if (verified) {
      if (auth().currentUser) {
        auth().currentUser.updatePhoneNumber(verified);
      }
      const authData = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
      await AsyncStorage.setItem(
        'authentication::data',
        JSON.stringify({...authData, phoneNumber}),
      );
      goToFinish();
    } else {
      setError('We were unable to verify your phone number. Try again.');
    }
    setLoading(false);
  }, [confirmation, error, goToFinish, otp, phoneNumber]);

  const onOTPChange = useCallback(
    async _otp => {
      setOTP(_otp);

      if (/^\d{6,6}$/.test(_otp)) {
        setDisabled(false);
        setError('');
      } else {
        setDisabled(true);
        setError(`Enter the six digit code sent to ${phoneNumber}.`);
      }
    },
    [phoneNumber],
  );

  return (
    <Page header="Verify OTP">
      <Input placeholder="OTP" type="number-pad" value={otp} error={error} onChange={onOTPChange} />

      <Button loading={loading} type="standard" disabled={disabled} onPress={submit}>
        Verify
      </Button>
    </Page>
  );
};

export default Email;
