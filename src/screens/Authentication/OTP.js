import React, {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {Page, Input, Button} from '../../components';

const Email = props => {
  const {
    route: {params},
  } = props;
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const goToFinish = useCallback(() => {
    navigation.navigate('Finish');
  }, [navigation]);

  const submit = useCallback(async () => {
    setLoading(true);
    if (error || !otp) {
      setLoading(false);
      return;
    }

    const credential = auth.PhoneAuthProvider.credential(params?.confirmation?.verificationId, otp);
    if (credential) {
      const authData = JSON.parse((await AsyncStorage.getItem('authentication::data')) || '{}');
      await AsyncStorage.setItem(
        'authentication::data',
        JSON.stringify({...authData, phoneNumber: params?.phoneNumber}),
      );
      goToFinish();
    } else {
      setError('We were unable to verify your phone number. Try again.');
    }
    setLoading(false);
  }, [error, goToFinish, otp, params]);

  const onOTPChange = useCallback(
    async _otp => {
      setOTP(_otp);

      if (/^\d{6,6}$/.test(_otp)) {
        setDisabled(false);
        setError('');
      } else {
        setDisabled(true);
        setError(`Enter the six digit code sent to ${params?.phoneNumber}.`);
      }
    },
    [params?.phoneNumber],
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
