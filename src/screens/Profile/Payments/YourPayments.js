import React, {useMemo} from 'react';

import {Page, Whitespace, Divider, CardDisplay, Typography} from '../../../components';

import arrowRight from '../../../assets/images/arrow-right.png';
import temp2 from '../../../assets/images/temp/temp2.png';

const YourPayments = () => {
  const sections = useMemo(
    () => [
      {
        heading: 'Completed',
        items: [
          {
            description: 'Paid ~ Feb 21',
            location: 'MASTERCARD ****1703. Vernon ~ Feb 14-Feb 2023',
            image: temp2,
            width: 57,
            height: 58,
          },
          {
            description: 'Paid ~ Feb 21',
            location: 'MASTERCARD ****1703. Vernon ~ Feb 15-Feb 2023',
            image: temp2,
            width: 57,
            height: 58,
          },
        ],
      },
      {
        heading: '2022',
        items: [
          {
            description: 'Paid ~ Feb 21',
            location: 'MASTERCARD ****1703. Vernon ~ Feb 16-Feb 2023',
            image: temp2,
            width: 57,
            height: 58,
          },
          {
            description: 'Paid ~ Feb 21',
            location: 'MASTERCARD ****1703. Vernon ~ Feb 17-Feb 2023',
            image: temp2,
            width: 57,
            height: 58,
          },
          {
            description: 'Paid ~ Feb 21',
            location: 'MASTERCARD ****1703. Vernon ~ Feb 18-Feb 2023',
            image: temp2,
            width: 57,
            height: 58,
          },
        ],
      },
    ],
    [],
  );

  return (
    <Page type="large" header="Your payments">
      <Whitespace marginTop={18} />

      {sections.map(({heading, items}, i) => (
        <React.Fragment key={heading}>
          {!i ? null : <Whitespace marginTop={37} />}

          <Typography type="notice" left width="105%">
            {heading}
          </Typography>

          <Whitespace marginTop={24} />

          {items?.map(({description, image, width, height, location}) => (
            <React.Fragment key={description}>
              <CardDisplay
                leftImageWidth={width}
                leftImageHeight={height}
                leftImageSrc={image}
                name={description}
                date={
                  <Typography width="70%" color="#717171">
                    {location}
                  </Typography>
                }
                rightImageWidth={6.5}
                rightImageHeight={12.5}
                rightImageSrc={arrowRight}
                center
              />

              <Divider top={13} bottom={13} />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </Page>
  );
};

export default YourPayments;
