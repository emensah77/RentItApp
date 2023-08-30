import React from 'react';

import {
  Page,
  Whitespace,
  Container,
  Divider,
  Typography,
  Image,
  CardDisplay,
} from '../../components';
import userImageLarge from '../../assets/images/menu/user-large.png';
import camera from '../../assets/images/menu/camera.png';

const Edit = () => {
  return (
    <Page header="Edit Profile">
      <Container center>
        <Image src={userImageLarge} width={218} height={218} />

        <Container type="rowReverse" width="100%">
          <Image src={camera} width={20} height={18.5} />
        </Container>
      </Container>

      <Whitespace marginTop={42} />

      <CardDisplay
        description="About me"
        suffix={<Typography type="notice">Add</Typography>}
        spaceBetween
      />

      <Divider top={20} bottom={20} />

      <CardDisplay
        description="Location"
        suffix={<Typography type="notice">Add</Typography>}
        spaceBetween
      />

      <Divider top={20} bottom={20} />

      <CardDisplay
        description="Work"
        suffix={<Typography type="notice">Add</Typography>}
        spaceBetween
      />

      <Divider top={20} bottom={20} />

      <CardDisplay
        description="Languages"
        suffix={<Typography type="notice">Add</Typography>}
        spaceBetween
      />

      <Divider top={20} bottom={20} />
    </Page>
  );
};

export default Edit;
