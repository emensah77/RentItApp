export default {
  show: jest.fn().mockImplementation(() => {
    console.debug('show splash screen');
  }),
  hide: jest.fn().mockImplementation(() => {
    console.debug('hide splash screen');
  }),
};
