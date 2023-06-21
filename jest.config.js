module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest-setup.js'],
  verbose: true,
  testEnvironment: 'node',
  silent: false,
  detectOpenHandles: true,
  testTimeout: 500000,
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    // '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    __DEV__: true,
  },
  // collectCoverage: true,
  // coverageDirectory: 'analysis/coverage',
  // coveragePathIgnorePatterns: ['/node_modules/'],
  // collectCoverageFrom: ['src/**/*.{js,jsx,ts}'],
  // coverageReporters: ['json', 'lcov', 'text', 'clover'],
  // coverageThreshold: {
  //   global: {
  //     branches: 0,
  //     functions: 0,
  //     lines: 0,
  //     statements: 0,
  //   },
  // },
  clearMocks: true,
  coverageProvider: 'babel',
  testPathIgnorePatterns: ['\\\\node_modules\\\\', '__tests__/helper.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|@ui-kitten' +
      '|@invertase' +
      '|@ptomasroos' +
      '|@fortawesome' +
      '|axios' +
      '|mixpanel-react-native' +
      '|react-native-splash-screen' +
      '|react-native-screens' +
      '|react-native-reanimated' +
      '))',
  ],
};
