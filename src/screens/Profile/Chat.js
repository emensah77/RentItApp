import React from 'react';

import {
  Page,
  Whitespace,
  Input,
  Container,
  Divider,
  CardDisplay,
  Typography,
} from '../../components';

import arrowLeft from '../../assets/images/arrow-left.png';
import menu from '../../assets/images/menu.png';
import logo from '../../assets/images/logo.png';
import moon from '../../assets/images/moon.png';
import listing from '../../assets/images/listing.png';
import share from '../../assets/images/share.png';
import temp from '../../assets/images/temp1.png';

const Chat = () => {
  return (
    <Page
      leftIcon={arrowLeft}
      rightIcon={menu}
      header={
        <Typography type="heading" left>
          Craig{'\n'}
          <Typography type="regular" size={11} left color="#717171">
            Response time: 1 hour
          </Typography>
        </Typography>
      }
      footer={
        <>
          <CardDisplay
            imageCircle={38}
            imageSrc={moon}
            description={
              <Typography type="levelTwoThick" size={12} color="#959595">
                It&apos;s<Typography color="#717171"> 4:32 AM </Typography>
                for your Host. They will see your messages when they are back online
              </Typography>
            }
            bold={false}
          />

          <Whitespace marginTop={8} />

          <Input inline placeholder="Write a message" type="email-address" />
        </>
      }>
      <CardDisplay
        imageWidth={38}
        imageHeight={38}
        imageSrc={temp}
        numberOfLines={1}
        description={
          <Typography type="link" size={15} color="#252525">
            Stunning Family home close to the city
          </Typography>
        }
        status="Canceled"
        date="Feb 13 - 14"
        center
        bold
      />

      <Whitespace marginTop={10} />

      <Container row type="center">
        <Container row type="chipSmall" color="#FFF" width={90}>
          <CardDisplay
            imageWidth={12.95}
            imageHeight={15}
            imageSrc={listing}
            numberOfLines={1}
            description="Listing"
            center
            bold
          />
        </Container>

        <Whitespace marginLeft={8} />

        <Container row type="chipSmall" color="#FFF" width={130}>
          <CardDisplay
            imageWidth={12.95}
            imageHeight={15}
            imageSrc={share}
            numberOfLines={1}
            description="Share listing"
            center
            bold
          />
        </Container>
      </Container>

      <Whitespace marginTop={-35} />

      <Divider />

      <Typography type="levelOneThick" size={12} color="#717171">
        Aug 23, 2022
      </Typography>

      <Whitespace marginTop={24} />

      <Container row center type="chip">
        <CardDisplay
          imageWidth={16}
          imageHeight={16}
          imageSrc={logo}
          numberOfLines={2}
          description={
            <Typography type="levelOneThick" size={12} color="#717171">
              Your inquiry for 1 guest on Feb 13 - 14 has been sent.{' '}
              <Typography type="link" color="#717171">
                Show listing
              </Typography>
            </Typography>
          }
          center
          bold
        />
      </Container>

      <Whitespace marginTop={24} />

      <CardDisplay
        imageCircle={38}
        imageSrc={moon}
        name="Dolly 2"
        location="4:26 PM"
        description="Looking forward to staying"
        bold={false}
      />

      <Whitespace marginTop={24} />

      <Container row center type="chip">
        <CardDisplay
          imageWidth={16}
          imageHeight={16}
          imageSrc={logo}
          numberOfLines={2}
          description={
            <Typography type="levelOneThick" size={12} color="#717171">
              Your reservation is confirmed for 1 guest on Feb 13 - 14.{' '}
              <Typography type="link" color="#717171">
                Show reservation
              </Typography>
            </Typography>
          }
          center
          bold
        />
      </Container>

      <Whitespace marginTop={24} />

      <CardDisplay
        imageCircle={38}
        imageSrc={moon}
        name="Dolly"
        location="4:26 PM"
        description="Sorry I need to cancel"
        bold={false}
      />

      <Whitespace marginTop={16} />

      <Typography type="levelOneThick" size={12} color="#717171">
        UNREAD
      </Typography>

      <Whitespace marginTop={24} />

      <Container row center type="chip">
        <CardDisplay
          imageWidth={16}
          imageHeight={16}
          imageSrc={logo}
          description={
            <Typography type="levelOneThick" size={12} color="#717171">
              Reservation cancelled by guest
            </Typography>
          }
          center
          bold
        />
      </Container>
    </Page>
  );
};

export default Chat;
