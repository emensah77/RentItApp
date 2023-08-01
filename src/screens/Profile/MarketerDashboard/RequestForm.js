import React, {useState, useEffect, useCallback} from 'react';
import auth from '@react-native-firebase/auth';

import PhoneNumber from '../../Authentication/PhoneNumber';

import {Input, Typography, Button, Whitespace, Error, Dropdown} from '../../../components';
import arrowDown from '../../../assets/images/arrow-down.png';

const {currentUser} = auth();
const requestTypes = [{value: 'Transportation'}, {value: 'Logistics'}];

const RequestForm = props => {
  const {onSuccess} = props;

  const [data, setData] = useState({
    requestType: {value: 'Transportation'},
    amount: '0',
    description: '',
    tags: '',
    marketerName: currentUser.displayName,
    contactNumber: currentUser.phoneNumber,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const onChangeData = useCallback(
    which => async value => {
      const _data = {...data, [which]: value};
      setData({..._data});
    },
    [data],
  );

  const submit = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      'https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/marketerrequests',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          marketerID: auth().currentUser.uid,
          status: 'open',
          requestType: data.requestType.value,
          tags: data.tags.split(','),
        }),
      },
    ).catch(setError);
    const _data = await response.json();

    if (!response || !response.ok) {
      setError('An error occurred, while trying to save the form.');
    } else {
      onSuccess(_data);
    }
    setLoading(false);
  }, [data, onSuccess]);

  useEffect(() => {
    const isInComplete = Object.keys(data).some(item => {
      if (!data[item] || data[item] === '0') {
        return true;
      }

      if (typeof data[item] === 'object' && !data[item].value) {
        return true;
      }

      if (Array.isArray(data[item]) && data[item].length === 0) {
        return true;
      }

      return false;
    });

    if (isInComplete) {
      return setDisabled(true);
    }
    setDisabled(false);
  }, [data]);

  return (
    <>
      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        Request Type
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('requestType')}
        value={data.requestType.value}
        data={requestTypes}
        displayKey="value"
        label="Request Type"
        suffix={arrowDown}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Tags (Comma Seperated)"
        type="text"
        name="tags"
        label="Tags (Comma Seperated)"
        value={data.tags}
        onChange={onChangeData('tags')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Description"
        type="text"
        name="description"
        label="Description"
        value={data.description}
        multiLine={2}
        onChange={onChangeData('description')}
      />

      <Whitespace marginTop={90} />

      <Input
        placeholder="0"
        type="numeric"
        name="amount"
        label="Amount"
        value={data.amount}
        onChange={onChangeData('amount')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="marketerName"
        type="text"
        name="marketerName"
        label="Marketer Name"
        value={data.marketerName}
        onChange={onChangeData('marketerName')}
      />

      <Whitespace marginTop={30} />

      <Typography type="label" width="100%">
        Marketer contact phone number.
      </Typography>
      <PhoneNumber inline onChangeData={onChangeData('contactNumber')} />

      <Whitespace marginTop={30} />

      <Typography type="notice">
        By Selecting Agree and continue, I agree to Rentit&apos;s{' '}
        <Typography type="link">
          Terms of Service, Payments Terms of Service and Nondiscrimination Policy
        </Typography>{' '}
        and acknowledge the <Typography type="link">Privacy Policy.</Typography>
      </Typography>

      <Whitespace marginTop={30} />

      <Error text={error} />

      <Button type="standard" disabled={disabled} loading={loading} onPress={submit}>
        Save
      </Button>

      <Whitespace marginBottom={200} />
    </>
  );
};

export default RequestForm;
