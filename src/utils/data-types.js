const HOME_TYPES = [
  {
    image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/fullhome.jpeg',
    value: 'Full Home',
  },
  {
    image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/apartment.jpeg',
    value: 'Apartment',
  },
  {
    image: 'https://d5w4alzj7ppu4.cloudfront.net/cities/1bedroom.jpeg',
    value: 'Entire Flat',
  },
  {
    image: 'https://i.insider.com/5ed812183ad861312272b2f5?width=700',
    value: 'Self-Contained',
  },
  {
    image: 'https://pbs.twimg.com/media/CTbpP-AVEAARjVx.jpg',
    value: 'Mansion',
  },
  {
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/11/d7/82/0c/single-room.jpg',
    value: 'Single Room',
  },
  {
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/11/d7/82/0c/single-room.jpg',
    value: 'Chamber and Hall',
  },
  {
    image: 'https://photos.zillowstatic.com/fp/fe45b984d1aca2ff57d2455ebcd8b95f-p_e.jpg',
    value: 'Condos',
  },
  {
    image: 'https://photos.zillowstatic.com/fp/f1d119d24d4c011b9e3b7b177b1a6907-p_e.jpg',
    value: 'Villas',
  },
  {
    image: 'https://photos.zillowstatic.com/fp/72a6b2bf4667a1ffa15ddccacd1ba124-p_e.jpg',
    value: 'Townhouse',
  },
];

const CURRENCIES = [{value: 'GHS'}, {value: 'USD'}];

const MODES = [
  {
    value: 'For Rent',
    description:
      'You are renting your home to tenants, and require monthly payments and offering a stay limited by a time agreed upon.',
  },
  {
    value: 'For Sale',
    description:
      'You are selling your home for a stipulated amount and are not offering a stay limited by time.',
  },
];

const AMENITIES = [
  {title: 'Wifi', value: 'wifi'},
  {title: 'Free Parking', value: 'free-parking'},
  {title: 'Kitchen', value: 'kitchen'},
  {title: 'Hot tub', value: 'hot-tub'},
  {title: 'Toilet', value: 'toilet'},
  {title: 'Washing machine', value: 'washing-machine'},
  {title: 'Pool', value: 'pool'},
  {title: 'Essentials', value: 'essentials'},
  {title: 'Dryer', value: 'dryer'},
  {title: 'Air conditioning', value: 'aircondition'},
  {title: 'Heating', value: 'heating'},
  {title: 'Water', value: 'water'},
  {title: 'Dedicated Workspace', value: 'dedicated-workspace'},
];

const GENDERS = [{value: 'Male'}, {value: 'Female'}];

const YES_OR_NO = [{value: 'Yes'}, {value: 'No'}];

const FACILITIES = [
  {value: 'Beds', id: 'bedCount'},
  {value: 'Bedrooms', id: 'bedRoomCount'},
  {value: 'Bathrooms', id: 'bathRoomsCount'},
];

export default {
  HOME_TYPES,
  CURRENCIES,
  MODES,
  AMENITIES,
  GENDERS,
  YES_OR_NO,
  FACILITIES,
};
