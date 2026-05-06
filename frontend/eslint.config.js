import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Allow unused vars starting with _ or capital letters, plus 'motion' which is used as JSX
      // namespace element (<motion.div>) — ESLint can't detect JSX namespace usage as a variable ref
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^[A-Z_]|^motion$|^useAuth$',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_|^error$',
        },
      ],
      // Downgrade react-refresh export rule to warn (context files legitimately export hooks + provider)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Downgrade hook rules that fire false positives on our axios setup pattern
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/immutability': 'off',
    },
  },
])
