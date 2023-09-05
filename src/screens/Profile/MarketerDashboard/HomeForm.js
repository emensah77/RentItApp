import React, {useState, useCallback, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

import PhoneNumber from '../../Authentication/PhoneNumber';

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
  newPrice: 0,
  availabilityDate: '04/01/2023',
  maxGuests: 0,
  neighbourhood: '',
  bathroomNumber: 0,
  bed: 0,
  bedroom: 0,
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
  }, [data, onSuccess, transformData]);

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
    // setData({homeType: {value: 'Mansion'},"aircondition": {"value": "Yes"}, "availabilityDate": "04/30/2023", "available": {"value": "Yes"}, "bathroom": {"value": "Yes"}, "bathroomNumber": "2", "bed": "2", "bedroom": "2", "currency": {"value": "USD"}, "description": "OPPOSITE ROMAN RIDGE SHOPPING CENTER NORTEI ABABIO STREET AIRPORT AIRPORT RESIDENTIAL defined", "furnished": {"value": "Yes"}, "homeType": "", "id": "ef0327b9-f2b0-4779-bcd6-749b9563694f", "kitchen": {"value": "Yes"}, "loyaltyProgram": {"value": "Yes"}, "marketerNumber": "+2348179222327", "maxGuests": "20", "mode": {"value": "For Sale"}, "negotiable": {"value": "Yes"}, "neighbourhood": "23rfg", "ownerName": "own", "phoneNumber": "+2348179222327", "price": "10", "title": "title", "toilet": {"value": "Yes"}, "water": {"value": "Yes"}, "wifi": {"value": "Yes"}});
  }, [preFillData]);

  return (
    <>
      <Header onClose={onClose}>Edit Homes</Header>

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
        camera={false}
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
        placeholder="Neighbourhood"
        type="text"
        name="neighbourhood"
        label="Neighbourhood"
        value={data.neighborhood}
        onChange={onChangeData('neighbourhood')}
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
