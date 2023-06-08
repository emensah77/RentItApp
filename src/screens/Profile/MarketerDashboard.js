import React from 'react';

import {Page, Typography, Button, Whitespace, Container, CardDisplay} from '../../components';

import home from '../../assets/images/home.png';
import earnings from '../../assets/images/earnings.png';
import available from '../../assets/images/available.png';
import unavailable from '../../assets/images/unavailable.png';

const MarketerDashboard = () => {
  return (
    <Page type="large" header="Marketer Dashboard">
      <Whitespace marginTop={100} />

      <Container row center>
        <Button type="tertiary" fitWidth color="#0047B3">
          Apply
        </Button>

        <Whitespace marginLeft={46} />

        <Button type="tertiary" fitWidth disabled color="#0047B3">
          Reset
        </Button>
      </Container>

      <Whitespace marginTop={46} />

      <Container row type="spaceAround">
        <Container type="buttonLike" width="47%" color="#194CC3">
          <CardDisplay
            leftImageHeight={34}
            leftImageWidth={34}
            leftImageSrc={home}
            location={
              <Typography type="notice" color="#FFF">
                Total Homes
              </Typography>
            }
            description={
              <Typography type="notice" color="#FFF">
                10
              </Typography>
            }
            bold={false}
          />
        </Container>

        <Whitespace marginTop={46} />

        <Container type="buttonLike" width="50%" color="#194CC3">
          <CardDisplay
            leftImageHeight={35}
            leftImageWidth={35}
            leftImageSrc={earnings}
            location={
              <Typography type="notice" color="#FFF">
                Total Earnings
              </Typography>
            }
            description={
              <Typography type="notice" color="#FFF">
                GHC 10
              </Typography>
            }
            bold={false}
          />
        </Container>
      </Container>

      <Whitespace marginTop={50} />

      <Container row type="spaceAround">
        <Container type="buttonLike" width="47%" color="#3C8826">
          <CardDisplay
            leftImageHeight={34}
            leftImageWidth={34}
            leftImageSrc={available}
            location={
              <Typography type="notice" color="#FFF">
                Available
              </Typography>
            }
            description={
              <Typography type="notice" color="#FFF">
                10
              </Typography>
            }
            bold={false}
          />
        </Container>

        <Whitespace marginLeft={46} />

        <Container type="buttonLike" width="50%" color="#DD0021">
          <CardDisplay
            leftImageHeight={35}
            leftImageWidth={35}
            leftImageSrc={unavailable}
            location={
              <Typography type="notice" color="#FFF">
                Unavailable
              </Typography>
            }
            description={
              <Typography type="notice" color="#FFF">
                10
              </Typography>
            }
            bold={false}
          />
        </Container>
      </Container>
    </Page>
  );
};

export default MarketerDashboard;
