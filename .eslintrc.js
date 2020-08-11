module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    jest: true
  },
  plugins: ['@typescript-eslint', 'babel'],
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  rules: {
    'indent': ['error', 2],
    'no-trailing-spaces': 2,
    'no-multi-spaces': 2,
    'no-irregular-whitespace': 2,
    '@typescript-eslint/array-type': [2, { default: 'array' }],
    '@typescript-eslint/camelcase': 0,
    'camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': [
      2,
      { accessibility: 'no-public' }
    ],
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/member-ordering': 2,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/no-unused-vars': [
      1,
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true }
    ],
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    'no-array-constructor': 2,
    'no-bitwise': 2,
    'no-caller': 2,
    'no-fallthrough': 2,
    'no-unused-expressions': 2,
    'no-console': 2,
    // 'no-floating-promises': true,  //  not implemented in eslint yet
    'no-duplicate-imports': 2,
    // 'no-magic-numbers': 2, // We'll back to this
    'no-multiple-empty-lines': 2,
    quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    radix: 2,
    semi: [2, 'always'],
    'max-len': [
      2,
      { code: 100, tabWidth: 2, ignoreUrls: true, ignoreComments: true }
    ],
    'default-case': 0,
    'comma-dangle': ['error', 'only-multiline'],
    'comma-spacing': ['error', { before: false, after: true }],
    'no-new-wrappers': 2,
    'no-eval': 2,
    'no-shadow': 2,
    'dot-notation': 2,
    'sort-imports': [
      2,
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
      }
    ],
    'react/display-name': 0,
    'react/prop-types': 0,
    'babel/no-invalid-this': 2
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
