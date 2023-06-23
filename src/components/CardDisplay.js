import React, {useMemo} from 'react';

import Container from './Container';
import Typography from './Typography';
import Whitespace from './Whitespace';
import Image from './Image';

const CardDisplay = props => {
  const {
    leftImageWidth,
    leftImageHeight,
    leftImageCircle,
    leftImageSrc,
    rightImageWidth,
    rightImageHeight,
    rightImageSrc,
    name,
    location,
    numberOfLines,
    description,
    status,
    date,
    center,
    spaceBetween,
    reverse,
    bold,
    prefix,
    suffix,
    onPress,
    contentBox = true,
  } = props;

  const contentBoxWidth = useMemo(() => {
    // const noPrefix = !prefix; // No UI element appears to ever have a prefix, only a left image
    const noSuffix = !suffix;
    const noLeftImage = !(leftImageSrc && (!!leftImageSrc.uri || typeof leftImageSrc === 'number'));
    const noRightImage = !(
      rightImageSrc &&
      (!!rightImageSrc.uri || typeof rightImageSrc === 'number')
    );
    return noSuffix || noLeftImage || noRightImage
      ? noSuffix && noLeftImage && noRightImage
        ? '100%'
        : (noSuffix && noLeftImage) || (noSuffix && noRightImage) || (noLeftImage && noRightImage)
        ? '87%'
        : '70%'
      : !noSuffix && !noLeftImage && !noRightImage
      ? '55%'
      : '70%';
  }, [leftImageSrc, rightImageSrc, suffix]);

  return (
    <Container
      row
      type={
        center ? 'center' : spaceBetween ? 'spaceBetween' : reverse ? 'rowReverse' : 'flexStart'
      }>
      {leftImageSrc && (!!leftImageSrc.uri || typeof leftImageSrc === 'number') ? (
        <Container center width={40} height={30} onPress={onPress}>
          <Image
            width={leftImageWidth}
            height={leftImageHeight}
            circle={leftImageCircle}
            src={leftImageSrc}
          />
        </Container>
      ) : null}

      {prefix ? (
        <Container center width="15%">
          {prefix || null}
        </Container>
      ) : null}

      <Container type={contentBox ? 'contentBox' : ''} onPress={onPress} width={contentBoxWidth}>
        <Container row type={reverse ? 'rowReverse' : 'flexStart'} onPress={onPress}>
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

        {description ? (
          <>
            <Whitespace marginTop={2} />
            <Container
              row
              type={reverse ? 'rowReverse' : center ? 'center' : 'flexStart'}
              onPress={onPress}>
              <Typography
                type={bold ? 'levelOneThick' : 'notice'}
                numberOfLines={numberOfLines || (!(name && location) ? 3 : 2)}>
                {description}
              </Typography>
            </Container>
          </>
        ) : null}

        {status && date ? <Whitespace marginTop={5} /> : null}

        <Container row type="flexStart" onPress={onPress}>
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

      {suffix ? (
        <Container center width="15%">
          {suffix || null}
        </Container>
      ) : null}

      {rightImageSrc && (!!rightImageSrc.uri || typeof rightImageSrc === 'number') ? (
        <Container center width={40} height={30} onPress={onPress}>
          <Image width={rightImageWidth} height={rightImageHeight} src={rightImageSrc} />
        </Container>
      ) : null}
    </Container>
  );
};

export default CardDisplay;
