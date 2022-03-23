module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    // typescript-eslint specific options
    warnOnUnsupportedTypeScriptVersion: true
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-unused-vars': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        pathGroups: [
          {
            pattern: 'vite*',
            group: 'builtin',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: [],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'import/newline-after-import': ['error', { count: 1 }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: true
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true
      }
    ]
  }
}
