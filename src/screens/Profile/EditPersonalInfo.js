import React, {useState} from 'react';

import {
  Page,
  Whitespace,
  Divider,
  Typography,
  CardDisplay,
  Input,
  Dropdown,
  Button,
} from '../../components';
import arrowDown from '../../assets/images/arrow-down.png';

const EditPersonalInfo = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [gender, setGender] = useState({value: ''});

  return (
    <Page type="large" header="Edit personal info">
      <Whitespace marginTop={36} />

      <Input
        placeholder="First name"
        type="email-address"
        value={firstname}
        onChange={setFirstname}
      />

      <Whitespace marginTop={20} />

      <Input placeholder="Last name" type="email-address" value={lastname} onChange={setLastname} />

      <Dropdown
        value={gender.value}
        data={[{value: 'Male'}, {value: 'Female'}]}
        displayKey="value"
        label="Gender"
        suffix={arrowDown}
        onChange={setGender}
      />

      <Divider top={20} bottom={10} />

      <CardDisplay
        description="Email"
        date="nnach***@yahoo.com"
        suffix={
          <Typography type="link" color="#252525">
            Edit
          </Typography>
        }
        spaceBetween
      />

      <Divider top={20} bottom={10} />

      <CardDisplay
        description="Phone numbers"
        date="For notifications, reminders, and help logging in."
        suffix={
          <Typography type="link" color="#252525">
            Edit
          </Typography>
        }
        spaceBetween
      />

      <Whitespace marginTop={20} />

      <CardDisplay
        description="+44****12020"
        suffix={
          <Typography type="link" color="#252525">
            Edit
          </Typography>
        }
        spaceBetween
      />

      <Whitespace marginTop={30} />

      <Button type="secondary" color="transparent" fitWidth>
        Add another phone number
      </Button>

      <Divider top={25} bottom={25} />

      <CardDisplay
        description="Government ID"
        date="Not provided"
        suffix={
          <Typography type="link" color="#252525">
            Add
          </Typography>
        }
        spaceBetween
      />

      <Divider top={25} bottom={25} />

      <CardDisplay
        description="Emergency contact"
        suffix={
          <Typography type="link" color="#252525">
            Edit
          </Typography>
        }
        spaceBetween
      />
    </Page>
  );
};

export default EditPersonalInfo;
