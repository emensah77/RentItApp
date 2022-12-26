const config = {
    initialRouteName: 'Home',
    screens: {
        Home: 'home',
        Post: '/rooms/room/:id?',
    }
}

const linking = {
    // prefixes: ['https://rentit.homes', 'http://', 'https://'],
    prefixes: ['rentit://', 'https://rentit.homes', 'https://*.rentit.homes'],
    config
}

// const config = {
//   initialRouteName: 'Home',
//   screens: {
//     Home: 'home',
//     Post: 'rooms/room/:id?',
//   },
// };

// const linking = {
//   prefixes: ['https://rentit.com', 'rentit://'],
//   config,
// };

export default linking;