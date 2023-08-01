import React, {useMemo} from 'react';
import auth from '@react-native-firebase/auth';

import {Page, Whitespace, Divider, Typography, Button, Image, CardDisplay} from '../../components';
import userImage from '../../assets/images/menu/user.png';
import verification from '../../assets/images/verification.png';
import language from '../../assets/images/language.png';
import checkmark from '../../assets/images/checkmark.png';

const AccountDetails = () => {
  const {currentUser} = auth();

  const firstname = useMemo(() => currentUser?.displayName?.split(' ')?.[0], [currentUser]);

  const signedUp = useMemo(
    () => new Date(currentUser?.metadata?.creationTime).getFullYear(),
    [currentUser],
  );

  const src = useMemo(
    () => (currentUser.photoURL ? {uri: currentUser.photoURL} : userImage),
    [currentUser],
  );

  return (
    <Page>
      <Image src={src} width={100} height={100} circle={100} />

      <Whitespace marginTop={23} />

      <Typography type="largeHeading" left width="100%">
        Hi, I&apos;m {firstname}
      </Typography>

      <Typography type="heading" color="#717171" width="100%">
        Joined in {signedUp}
      </Typography>

      <Divider />

      <Image src={verification} width={29.9} height={33} />

      <Whitespace marginTop={23} />

      <Typography type="heading" left width="100%">
        Identity Verification
      </Typography>

      <Whitespace marginTop={15} />

      <Typography type="notice" left width="100%">
        Show others you&apos;re really you with the identity verification badge
      </Typography>

      <Whitespace marginTop={15} />

      <Button type="secondary" color="transparent" fitWidth>
        Get the badge
      </Button>

      <Divider bottom={10} />

      <CardDisplay
        leftImageWidth={19}
        leftImageHeight={19}
        leftImageSrc={language}
        description={
          <Typography type="notice">Some info is shown in its orginal language.</Typography>
        }
      />

      <Whitespace marginTop={15} />

      {currentUser.phoneNumber ? (
        <>
          <Typography type="largeHeading" weight="700" left color="#252525" width="100%">
            {firstname} confirmed
          </Typography>

          <Whitespace marginTop={15} />

          <CardDisplay
            leftImageWidth={22}
            leftImageHeight={16}
            leftImageSrc={checkmark}
            description={
              <Typography type="notice" size={16}>
                Phone number
              </Typography>
            }
          />
        </>
      ) : null}
    </Page>
  );
};

export default AccountDetails;
