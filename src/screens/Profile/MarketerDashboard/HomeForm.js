import React, {useState, useCallback, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';

import PhoneNumber from '../../Authentication/PhoneNumber';
import Location from '../../Authentication/Location';

import {
  Input,
  Typography,
  Button,
  Whitespace,
  Error,
  Dropdown,
  Upload,
  Header,
} from '../../../components';
import arrowDown from '../../../assets/images/arrow-down.png';
import {TYPES} from '../../../utils';

const oldData = {
  id: '',
  mode: {value: 'For Rent'},
  images: [],
  title: '',
  description: '',
  phoneNumbers: [],
  marketerNumber: [],
  homeownerName: '',
  currency: {value: ''},
  latitude: null,
  longitude: null,
  newPrice: 0,
  availabilityDate: '04/01/2023',
  maxGuests: 0,
  neighborhood: '',
  bathroomNumber: 0,
  locality: '',
  sublocality: '',
  bed: 0,
  bedroom: 0,
  isDuplicate: 'No',
  loyaltyProgram: {value: 'No'},
  negotiable: {value: 'No'},
  available: {value: 'No'},
  verified: {value: 'No'},
  furnished: {value: 'No'},
  type: {value: ''},
  status: {value: ''},
  ...TYPES.AMENITIES.map(item => ({[item.value]: {value: 'No'}})).reduce(
    (a, b) => ({...a, ...b}),
    {},
  ),
};

const HomeForm = props => {
  const {data: preFillData, onSuccess, onClose} = props;

  const [data, setData] = useState({...oldData});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const onChangeData = useCallback(
    which => async value => {
      let parsedValue = value;

      // Convert to number if specific fields are updated
      if (['newPrice', 'maxGuests', 'bathroomNumber', 'bed', 'bedroom'].includes(which)) {
        parsedValue = parseInt(value, 10);
      }
      const _data = {...data, [which]: parsedValue};
      setData(_data);
    },
    [data],
  );

  const handleDuplicateClick = useCallback(() => {
    const latVariation = (Math.random() - 0.5) * 0.00006; // generates a random number between -0.00003 and +0.00003
    const longVariation = (Math.random() - 0.5) * 0.00006;

    const newLatitude = data.latitude ? data.latitude + latVariation : null;
    const newLongitude = data.longitude ? data.longitude + longVariation : null;

    setOriginalData(JSON.parse(JSON.stringify(data))); // Deep copy
    setData({
      ...data,
      id: uuid.v4(),
      isDuplicate: 'Yes',
      latitude: newLatitude,
      longitude: newLongitude,
    });
  }, [data]);

  const handleCancelDuplicate = useCallback(() => {
    if (originalData) {
      setData(JSON.parse(JSON.stringify(originalData))); // Deep copy to revert back to the original data
      setOriginalData(null);
    }
  }, [originalData]);

  const handleGetPosition = useCallback(position => {
    const {latitude, longitude} = position.coords;
    setUserLocation({latitude, longitude});
  }, []);

  const transformData = useCallback(dataa => {
    return Object.keys(dataa).reduce((acc, key) => {
      if (typeof dataa[key].value !== 'undefined') {
        acc[key] = dataa[key].value;
      } else {
        acc[key] = dataa[key];
      }
      return acc;
    }, {});
  }, []);

  const submit = useCallback(async () => {
    setLoading(true);

    if (
      data.title === 'defaultTitle' ||
      data.type.value === 'defaultType' ||
      data.availabilityDate === 'defaultAvailabilityDate' ||
      data.status.value === 'defaultStatus'
    ) {
      setError('Title, Type, Availability Date, or Status should not have default values.');
      setLoading(false);
      return;
    }

    if (data.status.value === 'APPROVED') {
      const isInComplete = Object.keys(data).filter(item => {
        if (!data[item] || data[item] === '0') {
          if (item !== 'bathroomNumber' || data[item] !== 0) {
            return true;
          }
        }

        if (Array.isArray(data[item]) && data[item].length === 0) {
          return true;
        }

        if (
          typeof data[item] === 'object' &&
          !Array.isArray(data[item]) &&
          !data[item].value &&
          data[item].value !== 0
        ) {
          return true;
        }

        return false;
      });

      if (isInComplete.length) {
        setError(
          `Please complete the following fields before approving: ${isInComplete.join(', ')}`,
        );
        setLoading(false);
        return; // Exit out of the submit function
      }
    }

    const itemId = data.id;
    delete data.id;
    const updateValues = transformData(data);
    updateValues.userLocation = userLocation;

    if (updateValues.status) {
      updateValues.status = updateValues.status.toLowerCase();
    }
    const response = await fetch(
      'https://xprc5hqvgh.execute-api.us-east-2.amazonaws.com/prod/homes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          userId: auth().currentUser.uid,
          updateValues,
        }),
      },
    ).catch(setError);
    const _data = await response.json();

    if (!data || !response || !response.ok) {
      setError('An error occurred, while trying to save the form.');
    } else {
      onSuccess(_data);
    }
    setLoading(false);
  }, [data, onSuccess, transformData, userLocation]);

  useEffect(() => {
    const newData = {};
    Object.keys(oldData).forEach(dataKey => {
      if (!preFillData[dataKey]) {
        return;
      }

      if (dataKey === 'phoneNumbers' && typeof preFillData[dataKey] === 'string') {
        newData[dataKey] = [preFillData[dataKey]];
      } else if (dataKey === 'marketerNumber' && typeof preFillData[dataKey] === 'string') {
        newData[dataKey] = [preFillData[dataKey]];
      } else {
        newData[dataKey] =
          oldData[dataKey] && typeof oldData[dataKey].value !== 'undefined'
            ? {value: preFillData[dataKey]}
            : preFillData[dataKey];
      }
    });
    setData({...oldData, ...newData});
  }, [preFillData]);

  return (
    <>
      <Header onClose={onClose}>Edit Homes</Header>
      {!originalData && (
        <Button onPress={handleDuplicateClick} type="secondary">
          Duplicate
        </Button>
      )}

      {originalData && (
        <Button onPress={handleCancelDuplicate} type="danger">
          Cancel Duplicate
        </Button>
      )}

      <Whitespace marginTop={10} />

      <Location getPosition={handleGetPosition} noRender={true} />

      <Whitespace marginTop={10} />

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
      <Upload
        picker={true}
        imageNamePrefix="home-marketer"
        noFlatlist
        initialImages={data.images}
        getImages={onChangeData('images')}
      />

      <Whitespace marginTop={10} />

      <Typography size={12} left width="100%">
        Home Type
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('type')}
        value={data.type.value}
        data={TYPES.HOME_TYPES}
        displayKey="value"
        label="Home Type"
        suffix={arrowDown}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Owner name"
        type="text"
        name="Homeowner Name"
        label="Homeowner Name"
        value={data.homeownerName}
        onChange={onChangeData('homeownerName')}
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

      <PhoneNumber
        initialPhoneNumber={data.phoneNumbers?.length > 0 ? data.phoneNumbers[0] : ''}
        initialCountryCode="233"
        inline
        onChangeData={onChangeData('phoneNumbers')}
      />

      <Whitespace marginTop={30} />

      <Typography type="label" width="100%">
        Marketer phone number.
      </Typography>
      <PhoneNumber
        initialPhoneNumber={data.marketerNumber?.length > 0 ? data.marketerNumber[0] : ''}
        initialCountryCode="233"
        inline
        onChangeData={onChangeData('marketerNumber')}
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
        name="newPrice"
        label="Price"
        value={data.newPrice.toString()}
        onChange={onChangeData('newPrice')}
      />

      <Whitespace marginTop={30} />

      <Typography size={12} left width="100%">
        Availability Date (mm/dd/yyyy)
      </Typography>

      <Whitespace marginTop={-20} />

      <Input
        placeholder="Availability Date (mm/dd/yyyy)"
        type="date"
        name="availabilityDate"
        label="Availability Date (mm/dd/yyyy)"
        value={data.availabilityDate}
        onChange={onChangeData('availabilityDate')}
        suffix={arrowDown}
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
        placeholder="Neighborhood"
        type="text"
        name="neighborhood"
        label="Neighborhood"
        value={data.neighborhood}
        onChange={onChangeData('neighborhood')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Bathroom"
        type="numeric"
        name="bathroom"
        label="Bathroom"
        value={data.bathroomNumber.toString()}
        onChange={onChangeData('bathroomNumber')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Bed"
        type="numeric"
        name="bed"
        label="Bed"
        value={data.bed.toString()}
        onChange={onChangeData('bed')}
      />

      <Whitespace marginTop={30} />

      <Input
        placeholder="Bedroom"
        type="numeric"
        name="bedroom"
        label="Bedroom"
        value={data.bedroom.toString()}
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
        data={TYPES.YES_OR_NO}
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
        data={TYPES.YES_OR_NO}
        displayKey="value"
        label="Negotiable"
        suffix={arrowDown}
      />

      <Whitespace marginTop={20} />

      <Typography size={12} left width="100%">
        Verified
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('verified')}
        value={data.verified.value}
        data={TYPES.YES_OR_NO}
        displayKey="value"
        label="Verified"
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
        data={TYPES.YES_OR_NO}
        displayKey="value"
        label="Available"
        suffix={arrowDown}
      />

      <Whitespace marginTop={20} />

      <Typography size={12} left width="100%">
        Status
      </Typography>

      <Whitespace marginTop={-20} />

      <Dropdown
        onChange={onChangeData('status')}
        value={data.status.value}
        data={TYPES.STATUSES}
        displayKey="value"
        label="Status"
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
        data={TYPES.YES_OR_NO}
        displayKey="value"
        label="Furnished"
        suffix={arrowDown}
      />

      <Whitespace marginTop={10} />

      <Typography type="heading" left width="100%">
        Amenities
      </Typography>

      <Whitespace marginTop={15} />

      {TYPES.AMENITIES.map(({value}) => (
        <React.Fragment key={value}>
          <Typography size={12} left width="100%">
            {`${value.substring(0, 1).toUpperCase()}${value.substring(1)}`}
          </Typography>

          <Whitespace marginTop={-20} />

          <Dropdown
            onChange={onChangeData(value)}
            value={data[value].value}
            data={TYPES.YES_OR_NO}
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

      <Button type="standard" loading={loading} onPress={submit}>
        Save
      </Button>
    </>
  );
};

export default HomeForm;
