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
  collectCoverage: true,
  coverageDirectory: 'analysis/coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts}'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  clearMocks: true,
  coverageProvider: 'babel',
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|react-navigation-tabs' +
      '|react-native-splash-screen' +
      '|react-native-screens' +
      '|react-native-reanimated' +
      ')/)',
  ],
};
