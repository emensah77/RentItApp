import React, {useState, useCallback, useEffect, useMemo} from 'react';
import auth from '@react-native-firebase/auth';

import PhoneNumber from '../Authentication/PhoneNumber';

import {Input, Typography, Button, Whitespace, Error, Dropdown} from '../../components';
import arrowDown from '../../assets/images/arrow-down.png';

const amenities = [
  {value: 'aircondition'},
  {value: 'kitchen'},
  {value: 'bathroom'},
  {value: 'toilet'},
  {value: 'water'},
  {value: 'wifi'},
];

const oldData = {
  id: '',
  mode: {value: 'For Rent'},
  ownerName: '',
  title: '',
  description: '',
  phoneNumber: '',
  marketerNumber: '',
  currency: {value: ''},
  price: '0',
  availabilityDate: '04/01/2023',
  maxGuests: '0',
  neighbourhood: '',
  bathroomNumber: '0',
  bed: '0',
  bedroom: '0',
  loyaltyProgram: {value: 'No'},
  negotiable: {value: 'No'},
  available: {value: 'No'},
  furnished: {value: 'No'},
  homeType: '',
  ...amenities.map(item => ({[item.value]: {value: 'No'}})).reduce((a, b) => ({...a, ...b}), {}),
};

const MarkerForm = props => {
  const {data: preFillData} = props;

  const [data, setData] = useState({...oldData});
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const modes = useMemo(() => [{value: 'For Rent'}, {value: 'For Sale'}], []);

  const currencies = useMemo(() => [{value: 'GHS'}, {value: 'USD'}], []);

  const availabilities = useMemo(() => [{value: 'Yes'}, {value: 'No'}], []);

  const onChangeData = useCallback(
    which => async value => {
      const _data = {...data, [which]: value};
      setData({..._data});
    },
    [data],
  );

  const submit = useCallback(async () => {
    setLoading(true);
    const response = await fetch('https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemId: data.id,
        userId: auth().currentUser.uid,
        updateValues: Object.keys(data)
          .map(item => ({
            [item]: typeof data[item].value !== 'undefined' ? data[item].value : data[item],
          }))
          .reduce((a, b) => ({...a, ...b}), {}),
      }),
    }).catch(setError);

    if (!response || !response.ok) {
      setError('An error occurred, while trying to save the form.');
    }
    setLoading(false);
  }, [data]);

  useEffect(() => {
    const newData = {};
    Object.keys(oldData).forEach(dataKey => {
      if (!preFillData[dataKey]) {
        return;
      }
      newData[dataKey] =
        oldData[dataKey] && typeof oldData[dataKey].value !== 'undefined'
          ? {value: preFillData[dataKey]}
          : preFillData[dataKey];
    });
    setData({...oldData, ...newData});
  }, [preFillData]);

  useEffect(() => {
    // Confirm from Eben if some options can be saved even if incomplete

    // const isInComplete = Object.keys(data).some(item => {
    //   if (!data[item] || data[item] === '0') {
    //     return true;
    //   }

    //   if (typeof data[item] === 'object' && !data[item].value) {
    //     return true;
    //   }

    //   if (Array.isArray(data[item]) && data[item].length === 0) {
    //     return true;
    //   }

    //   return false;
    // });

    // if (isInComplete) {
    //   return setDisabled(true);
    // }
    setDisabled(false);
  }, [data]);

  return (
    <>
      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        Mode
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('mode')}
        value={data.mode.value}
        data={modes}
        displayKey="value"
        label="Mode"
        suffix={arrowDown}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Owner name"
        type="text"
        name="ownerName"
        label="Owner name"
        value={data.ownerName}
        onChange={onChangeData('ownerName')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Title"
        type="text"
        name="title"
        label="Title"
        value={data.title}
        onChange={onChangeData('title')}
      />

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

      <Typography type="label" width="100%">
        Home owner phone number.
      </Typography>
      <PhoneNumber inline onChangeData={onChangeData('phoneNumber')} />

      <Whitespace marginTop={30} />

      <Typography type="label" width="100%">
        Marketer phone number.
      </Typography>
      <PhoneNumber inline onChangeData={onChangeData('marketerNumber')} />

      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        Currency
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('currency')}
        value={data.currency.value}
        data={currencies}
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

      <Input
        placeholder="Availability Date"
        type="text"
        name="availabilityDate"
        label="Availability Date"
        value={data.availabilityDate}
        onChange={onChangeData('availabilityDate')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Max Guests"
        type="numeric"
        name="maxGuests"
        label="Max Guests"
        value={data.maxGuests}
        onChange={onChangeData('maxGuests')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Neighbourhood"
        type="text"
        name="neighbourhood"
        label="Neighbourhood"
        value={data.neighbourhood}
        onChange={onChangeData('neighbourhood')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Bathroom"
        type="numeric"
        name="bathroom"
        label="Bathroom"
        value={data.bathroomNumber}
        onChange={onChangeData('bathroomNumber')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Bed"
        type="numeric"
        name="bed"
        label="Bed"
        value={data.bed}
        onChange={onChangeData('bed')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Bedroom"
        type="numeric"
        name="bedroom"
        label="Bedroom"
        value={data.bedroom}
        onChange={onChangeData('bedroom')}
      />

      <Whitespace marginTop={10} />

      <Typography size={12} left width="100%">
        Loyalty Programs
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('loyaltyProgram')}
        value={data.loyaltyProgram.value}
        data={availabilities}
        displayKey="value"
        label="Loyalty Program"
        suffix={arrowDown}
      />

      <Whitespace marginTop={20} />

      <Typography size={12} left width="100%">
        Negotiable
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('negotiable')}
        value={data.negotiable.value}
        data={availabilities}
        displayKey="value"
        label="Negotiable"
        suffix={arrowDown}
      />

      <Whitespace marginTop={20} />

      <Typography size={12} left width="100%">
        Available
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('available')}
        value={data.available.value}
        data={availabilities}
        displayKey="value"
        label="Available"
        suffix={arrowDown}
      />

      <Whitespace marginTop={20} />

      <Typography size={12} left width="100%">
        Furnished
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('furnished')}
        value={data.furnished.value}
        data={availabilities}
        displayKey="value"
        label="Furnished"
        suffix={arrowDown}
      />

      <Whitespace marginTop={10} />

      <Typography type="heading" left width="100%">
        Amenities
      </Typography>

      <Whitespace marginTop={15} />

      {amenities.map(({value}) => (
        <React.Fragment key={value}>
          <Typography size={12} left width="100%">
            {`${value.substring(0, 1).toUpperCase()}${value.substring(1)}`}
          </Typography>

          <Whitespace marginTop={-20} />

          <Dropdown
            onChange={onChangeData(value)}
            value={data[value].value}
            data={availabilities}
            displayKey="value"
            label={`${value.substring(0, 1).toUpperCase()}${value.substring(1)}`}
            suffix={arrowDown}
          />

          <Whitespace marginTop={20} />
        </React.Fragment>
      ))}

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

      {/* <Whitespace marginBottom={-20} /> */}

      <Button type="standard" loading={loading} disabled={disabled} onPress={submit}>
        Save
      </Button>

      <Whitespace marginBottom={200} />
    </>
  );
};

export default MarkerForm;
