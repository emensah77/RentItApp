import React, {useState, useCallback, useMemo} from 'react';

import Base from './Base';

import {Container, Whitespace, Typography, Image} from '../../components';

const OnboardingScreen3 = () => {
  const [selected, setSelected] = useState('');
  const [data, setData] = useState();

  const items = useMemo(
    () => [
      {
        image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/fullhome.jpeg',
        title: 'Full Home',
      },
      {
        image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/apartment.jpeg',
        title: 'Apartment',
      },
      {
        image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/1bedroom.jpeg',
        title: 'Entire Flat',
      },
      {
        image: 'https://i.insider.com/5ed812183ad861312272b2f5?width=700',
        title: 'Self-Contained',
      },
      {
        image: 'https://pbs.twimg.com/media/CTbpP-AVEAARjVx.jpg',
        title: 'Mansion',
      },
      {
        image: 'https://media-cdn.tripadvisor.com/media/photo-s/11/d7/82/0c/single-room.jpg',
        title: 'Single Room',
      },
      {
        image: 'https://media-cdn.tripadvisor.com/media/photo-s/11/d7/82/0c/single-room.jpg',
        title: 'Chamber and Hall',
      },
      {
        image: 'https://photos.zillowstatic.com/fp/fe45b984d1aca2ff57d2455ebcd8b95f-p_e.jpg',
        title: 'Condos',
      },
      {
        image: 'https://photos.zillowstatic.com/fp/f1d119d24d4c011b9e3b7b177b1a6907-p_e.jpg',
        title: 'Villas',
      },
      {
        image: 'https://photos.zillowstatic.com/fp/72a6b2bf4667a1ffa15ddccacd1ba124-p_e.jpg',
        title: 'Townhouse',
      },
    ],
    [],
  );

  const getUri = useCallback(uri => ({uri}), []);

  const select = useCallback(
    homeType => () => {
      setSelected(homeType);
      setData({homeType});
    },
    [],
  );

  return (
    <Base
      index={3}
      isComplete={!!data}
      data={data}
      title="Which of these best describe your place?">
      {items.map(({title, image}) => (
        <React.Fragment key={title}>
          <Container row type="spaceBetween" onPress={select(title)}>
            <Typography
              type="notice"
              size={16}
              weight="800"
              color={selected === title ? '#0047B3' : '#1F2D3D'}>
              {title}
            </Typography>

            <Image src={getUri(image)} width={147} height={87} borderRadius={14} />
          </Container>

          <Whitespace marginTop={25} />
        </React.Fragment>
      ))}
    </Base>
  );
};

export default OnboardingScreen3;
