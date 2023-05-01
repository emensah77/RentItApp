const config = {
  initialRouteName: 'Home',
  screens: {
    Home: 'home',
    Post: '/rooms/room/:id?',
  },
};

const linking = {
  prefixes: ['rentit://', 'https://rentit.homes', 'https://*.rentit.homes'],
  config,
};

export default linking;
