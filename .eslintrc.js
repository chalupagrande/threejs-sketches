module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['prettier', 'react', 'import'],
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'react/jsx-no-undef': ['error', { allowGlobals: true }],
    // eslint- plugin -import
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'import/default': 'off',
    'import/newline-after-import': 'warn',
    'import/namespace': 'off',
  },
}
