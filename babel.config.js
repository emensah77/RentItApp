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
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    ['module:metro-react-native-babel-preset', {useTransformReactJSXExperimental: true}],
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@images': './src/assets/images',
          '@assets': './src/assets',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@redux': './src/redux',
        },
      },
    ],
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        envName: 'REACT_NATIVE_APP_ENV',
        moduleName: 'react-native-dotenv',
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
