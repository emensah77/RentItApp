import React, {useState, useEffect, useCallback} from 'react';

import PhoneNumber from '../Authentication/PhoneNumber';

import {Input, Typography, Button, Whitespace, Error, Dropdown} from '../../components';
import arrowDown from '../../assets/images/arrow-down.png';
import {localities, getSubLocalities, TYPES} from '../../utils';

const DemandForm = props => {
  const {onSuccess} = props;

  const [data, setData] = useState({
    name: '',
    currency: {value: ''},
    price: '0',
    phoneNumber: {value: ''},
    mode: {value: ''},
    homeType: {value: ''},
    locality: {value: ''},
    subLocality: {value: ''},
    description: '',
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
      'https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/demands',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: data.name,
          Type: data.mode.value,
          Price: `${data.currency.value}${data.price}`,
          // Tags: ['Balcony', 'Near Beach'],
          Locality: data.locality.value,
          Sublocality: data.subLocality.value,
          HomeType: data.homeType.value,
          Description: data.description,
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

      <Input
        placeholder="Name"
        type="text"
        name="name"
        label="Name"
        value={data.name}
        onChange={onChangeData('name')}
      />

      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        Currency
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('currency')}
        value={data.currency.value}
        data={TYPES.CURRENCIES}
        displayKey="value"
        label="Currency"
        suffix={arrowDown}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="0"
        type="numeric"
        name="price"
        label="Price"
        value={data.price}
        onChange={onChangeData('price')}
      />

      <Whitespace marginTop={30} />

      <Typography type="label" width="100%">
        Home owner phone number.
      </Typography>
      <PhoneNumber inline onChangeData={onChangeData('phoneNumber')} />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Description"
        type="text"
        name="description"
        label="Description"
        value={data.description}
        onChange={onChangeData('description')}
      />

      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        Mode
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('mode')}
        value={data.mode.value}
        data={TYPES.MODES}
        displayKey="value"
        label="Mode"
        suffix={arrowDown}
      />

      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        Home Types
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('homeType')}
        value={data.homeType.value}
        data={TYPES.HOME_TYPES}
        displayKey="value"
        label="Home Type"
        suffix={arrowDown}
      />

      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        Locality
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('locality')}
        value={data.locality.value}
        data={localities}
        displayKey="value"
        label="Locality"
        suffix={arrowDown}
      />

      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        Sub locality
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('subLocality')}
        value={data.subLocality.value}
        data={getSubLocalities(data.locality.value || localities[0].value)}
        displayKey="value"
        label="Sub Localities"
        suffix={arrowDown}
      />

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

export default DemandForm;
