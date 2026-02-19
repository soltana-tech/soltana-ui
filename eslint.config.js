import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
  {
    // Config files are excluded because they use Vite/Playwright/Turbo APIs
    // that conflict with the project's strict TypeScript ESLint rules
    // (e.g., untyped default exports, __dirname usage).
    ignores: [
      '**/dist/',
      '**/docs-dist/',
      '**/node_modules/',
      'tests/',
      '*.config.js',
      '*.config.ts',
      'apps/**/*.config.ts',
      'packages/**/*.config.ts',
    ],
  }
);
