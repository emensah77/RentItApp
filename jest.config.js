module.exports = {
  setupFiles: ['<rootDir>/jest-setup.js'],
  verbose: true,
  testEnvironment: 'node',
  silent: false,
  detectOpenHandles: true,
  testTimeout: 500000,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  globals: {
    __DEV__: true,
  },
};
