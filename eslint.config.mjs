import next from 'eslint-config-next'

export default [
  { ignores: ['.next/**', 'node_modules/**'] },
  ...next,
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/no-unescaped-entities': 'off',

      '@next/next/no-img-element': 'off',

      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
    },
  },
]
