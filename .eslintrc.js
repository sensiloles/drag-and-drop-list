module.exports = {
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    browser: true
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    '@typescript-eslint/indent': [2, 2]
  }
};
