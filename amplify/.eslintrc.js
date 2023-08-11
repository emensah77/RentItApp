module.exports = {
  root: true,
  extends: [
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'prettier',
    'sort-keys-fix',
    '@babel',
    'react-hooks',
    '@typescript-eslint',
  ],
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        ignoredNodes: [
          'TemplateLiteral',
          'ConditionalExpression',
        ],
      },
    ],
    'no-confusing-arrow': [0],
    'no-console': ['error', { allow: ['log', 'debug', 'error'] }],
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
  },
};
