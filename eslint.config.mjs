import next from 'eslint-config-next'

export default [
  { ignores: ['.next/**', 'node_modules/**'] },
  ...next,
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'react/prop-types': 'off', // Отключение правила prop-types
      'react/jsx-no-target-blank': 'off',
      'react/no-unescaped-entities': 'off',

      // Картинки сознательно остаются обычными <img>: макет и CSS завязаны
      // на них, а next/image в этом проекте не используется.
      '@next/next/no-img-element': 'off',

      // Правила eslint-plugin-react-hooks v6 (React Compiler). Код перенесён
      // с Vite один в один, поэтому они предупреждают, а не валят сборку —
      // разбирать их стоит отдельной задачей, а не в рамках миграции.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
    },
  },
]
