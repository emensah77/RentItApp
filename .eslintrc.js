module.exports = {
  root: true,
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    '@react-native-community',
  ],
  plugins: ['react', 'prettier', 'sort-keys-fix', 'jsx-a11y', '@babel', 'react-hooks'],
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        ignoredNodes: [
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
        ],
      },
    ],
    'no-confusing-arrow': [0],
    'no-console': ['error', {allow: ['debug', 'error']}],
    'no-unused-vars': ['error', {vars: 'all', args: 'all', ignoreRestSiblings: false}],
    'react/jsx-filename-extension': [0],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-no-bind': [
      'error',
      {
        ignoreDOMComponents: false,
        ignoreRefs: false,
        allowArrowFunctions: false,
        allowFunctions: false,
        allowBind: false,
      },
    ],
    'react/jsx-props-no-spreading': [0],
    'react/no-did-update-set-state': [0],
    'react-native/no-inline-styles': [0],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
