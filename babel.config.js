module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        loose: true,
      },
    ],
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        envName: 'REACT_NATIVE_APP_ENV',
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: false,
        verbose: false,
      },
    ],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'], // removing consoles.log from app during release (production) versions
    },
  },
};
