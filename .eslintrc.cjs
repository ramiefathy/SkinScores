module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  ignorePatterns: ['functions/lib/**', 'src/tools/**'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off', // Using TypeScript for type checking
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'jsx-a11y/no-autofocus': 'off', // Autofocus is needed for search dialogs
  },
};
