module.exports = {
  extends: ['semistandard'],
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-useless-escape': 'off',
    'comma-dangle': ['error', 'never'],
    'eol-last': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'logs/',
    '*.log'
  ]
};