import React from 'react';

import Container from './Container';
import Typography from './Typography';
import Whitespace from './Whitespace';
import Image from './Image';

const CardDisplay = props => {
  const {
    imageWidth,
    imageHeight,
    imageCircle,
    imageSrc,
    name,
    location,
    numberOfLines,
    description,
    status,
    date,
    center,
    bold,
  } = props;

  return (
    <Container row type={center ? 'center' : 'flexStart'}>
      <Image width={imageWidth} height={imageHeight} circle={imageCircle} src={imageSrc} />

      <Container type="contentBox">
        <Container row type="flexStart">
          {name ? <Typography type={bold ? 'levelOneThick' : 'notice'}>{name}</Typography> : null}

          {name && location ? (
            <>
              <Whitespace marginLeft={5} />

              <Typography type="levelOneThick" color="#717171">
                &#8226;
              </Typography>

              <Whitespace marginLeft={5} />
            </>
          ) : null}

          {location ? (
            <Typography type="notice" color="#717171">
              {location}
            </Typography>
          ) : null}
        </Container>

        <Whitespace marginTop={2} />

        <Container row type={center ? 'center' : 'flexStart'}>
          <Typography
            type={bold ? 'levelOneThick' : 'notice'}
            numberOfLines={numberOfLines || (!(name && location) ? 3 : 2)}>
            {description}
          </Typography>
        </Container>

        <Whitespace marginTop={5} />

        <Container row type="flexStart">
          {status ? <Typography type="levelTwoThick">{status}</Typography> : null}

          {status && date ? (
            <>
              <Whitespace marginLeft={5} />

              <Typography type="levelTwoThick" color="#717171">
                &#8226;
              </Typography>

              <Whitespace marginLeft={5} />
            </>
          ) : null}

          {date ? (
            <Typography type="levelTwoThick" color="#717171">
              {date}
            </Typography>
          ) : null}
        </Container>
      </Container>
    </Container>
  );
};

export default CardDisplay;
